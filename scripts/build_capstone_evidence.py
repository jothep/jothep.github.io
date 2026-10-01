#!/usr/bin/env python3
"""Build an allowlisted, de-identified retrospective evidence bundle.

Usage:
    python build_capstone_evidence.py --source-dir PRIVATE_ARCHIVE --output-dir evidence
    python build_capstone_evidence.py --plot-only capstone-results.json --output-dir evidence
    python build_capstone_evidence.py --verify-export capstone-results.json

Dependencies: Python >=3.10, numpy, scipy, matplotlib. No model/API/network calls.
Original research files are read only. Plots read only the exported safe JSON.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import re
import statistics
import sys
import tempfile

EXPECTED_N = 69
AUDIT_DATE = "2026-10-02"
SCHEMA_VERSION = "1.0.0"
SOURCE_FILES = {
    "run08": "evaluation_results_run_08_3way_comparison_ollama_llama3_ollama_llama3.json",
    "run09": "evaluation_results_run_09_paradox_proof.json",
}
METHODS = {
    "run08": {
        "single_pass": ("baseline_score", "Single pass"),
        "multi_agent": ("poc_score", "Multi-agent"),
        "single_pass_cot": ("cot_score", "Single-pass CoT"),
    },
    "run09": {
        "single_pass_cot": ("baseline_score", "Single-pass CoT"),
        "multi_agent_cot": ("poc_score", "CoT + reviewer"),
    },
}
BLUE = "#173bcc"
GRAY = "#788394"
LIGHT_GRAY = "#afb7c3"
INK = "#172033"
MUTED = "#596477"


def read_score_rows(source_dir: Path, run_id: str):
    """Inspect only identity and required score values; discard all other content."""
    try:
        raw = (source_dir / SOURCE_FILES[run_id]).read_bytes()
        data = json.loads(raw)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"{run_id}: source is unavailable or is not valid JSON") from None
    if not isinstance(data, dict) or not isinstance(data.get("evaluations"), list):
        raise ValueError(f"{run_id}: evaluations must be an array")
    rows = data["evaluations"]
    if len(rows) != EXPECTED_N:
        raise ValueError(f"{run_id}: expected exactly {EXPECTED_N} paired rows")
    scores_by_ticket = {}
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError(f"{run_id}: each evaluation must be an object")
        ticket = row.get("ticket")
        if not isinstance(ticket, str) or not ticket.strip():
            raise ValueError(f"{run_id}: a non-empty ticket identity is required for pairing")
        if ticket in scores_by_ticket:
            raise ValueError(f"{run_id}: duplicate ticket identity")
        clean_scores = {}
        for method_id, (score_key, _) in METHODS[run_id].items():
            value = row.get(score_key)
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise ValueError(f"{run_id}: every required score must be numeric")
            if not math.isfinite(value) or not 0 <= value <= 100:
                raise ValueError(f"{run_id}: scores must be finite and between 0 and 100")
            clean_scores[method_id] = float(value)
        scores_by_ticket[ticket] = clean_scores
    # The identity map stays in memory and is never included in exported objects.
    return scores_by_ticket, hashlib.sha256(raw).hexdigest()


def aggregate(values: list[float]) -> dict:
    return {
        "n": len(values),
        "mean": statistics.mean(values),
        "sample_sd": statistics.stdev(values),
        "minimum": min(values),
        "maximum": max(values),
    }


def paired_comparison(cases: list[dict], method_a: str, method_b: str) -> dict:
    from scipy import stats

    a = [case["scores"][method_a] for case in cases]
    b = [case["scores"][method_b] for case in cases]
    result = stats.ttest_rel(a, b, alternative="two-sided")
    differences = [left - right for left, right in zip(a, b)]
    confidence = result.confidence_interval(confidence_level=0.95)
    return {
        "method_a": method_a,
        "method_b": method_b,
        "difference_definition": "method_a minus method_b",
        "n_pairs": len(cases),
        "mean_difference": statistics.mean(differences),
        "sample_sd_difference": statistics.stdev(differences),
        "t_statistic": float(result.statistic),
        "degrees_of_freedom": len(cases) - 1,
        "p_value_two_sided": float(result.pvalue),
        "confidence_level": 0.95,
        "confidence_interval": [float(confidence.low), float(confidence.high)],
        "alpha": 0.05,
        "p_value_adjustment": "none; exploratory comparisons",
    }


def build_results(source_dir: Path) -> dict:
    source = {run: read_score_rows(source_dir, run) for run in SOURCE_FILES}
    if set(source["run08"][0]) != set(source["run09"][0]):
        raise ValueError("Run08 and Run09 must contain the same 69 unique ticket identities")
    # Sort privately for stable pseudonymous case IDs. No identity lookup is exported.
    private_ticket_order = sorted(source["run08"][0])
    result = {
        "schema_version": SCHEMA_VERSION,
        "review_date": AUDIT_DATE,
        "analysis_type": "Retrospective recalculation of archived evaluation scores; not a model rerun.",
        "score_label": "LLM-judge scores, not objective accuracy",
        "score_scale": {"minimum": 0, "maximum": 100},
        "sample": {
            "n": EXPECTED_N,
            "sampling": "Purposively sampled open-source technical tickets; not a random population sample.",
            "pairing": "Each row contains paired scores for one unique ticket; both runs have the same ticket set.",
            "case_ids": "Pseudonymous sequential identifiers; no identity lookup is exported. Scores remain linkable if matched to the private source.",
        },
        "limitations": [
            "Results describe this saved evaluation setting, not general model quality or production accuracy.",
            "Run08 uses three-way judging; Run09 uses pairwise judging. Do not interpret cross-run score changes as a trend.",
            "The experiment report describes local Ollama Llama 3 8B; score artifacts do not verify exact model digests, runtime, prompts, or judge settings.",
            "The inspected evaluator uses a 0-100 rubric, visible method labels and fixed ordering; this export does not establish blind or randomized assessment.",
            "No ROUGE-L, human accuracy labels, token costs, or controlled latency measurements are included.",
            "Paired t-tests summarize these saved judge scores; p-values do not establish an architectural mechanism or external generalizability.",
        ],
        "runs": {},
    }
    for run_id, (scores_by_ticket, digest) in source.items():
        cases = [
            {"case_id": f"case_{i:03d}", "scores": dict(scores_by_ticket[ticket])}
            for i, ticket in enumerate(private_ticket_order, start=1)
        ]
        methods = {
            method_id: {
                "label": label,
                "source_score_field": field,
                **aggregate([case["scores"][method_id] for case in cases]),
            }
            for method_id, (field, label) in METHODS[run_id].items()
        }
        comparisons = (
            [("single_pass_cot", "multi_agent"), ("single_pass_cot", "single_pass"), ("multi_agent", "single_pass")]
            if run_id == "run08" else [("multi_agent_cot", "single_pass_cot")]
        )
        result["runs"][run_id] = {
            "label": "Run08: three-way comparison" if run_id == "run08" else "Run09: reviewer-loop comparison",
            "source_filename": SOURCE_FILES[run_id],
            "source_sha256": digest,
            "n": len(cases),
            "evaluation_protocol": "Three-way LLM judging" if run_id == "run08" else "Pairwise LLM judging",
            "mapping_evidence": (
                "Score fields are interpreted using the Run08 experiment report and evaluator conventions. The JSON has no run-setting metadata."
                if run_id == "run08" else
                "Source JSON metadata explicitly maps baseline_score to single-pass CoT and poc_score to multi-agent CoT."
            ),
            "settings_evidence_limit": "Model and judge settings are reported context, not independently verified from the archived score JSON.",
            "methods": methods,
            "comparisons": [paired_comparison(cases, a, b) for a, b in comparisons],
            "interpretation": (
                "Single-pass CoT received higher judge scores than the other two methods in this saved three-way evaluation."
                if run_id == "run08" else
                "The reviewer condition had a slightly lower observed mean; the paired difference was not statistically significant. This does not prove degradation or equivalence."
            ),
            "cases": cases,
        }
    return result


def build_schema(data: dict) -> dict:
    """Generate a closed-object JSON Schema for the explicitly constructed export."""
    def infer(value, key=""):
        if isinstance(value, dict):
            return {"type": "object", "additionalProperties": False,
                    "required": list(value), "properties": {k: infer(v, k) for k, v in value.items()}}
        if isinstance(value, list):
            node = {"type": "array", "items": infer(value[0]) if value else {}}
            if key == "cases":
                node.update(minItems=69, maxItems=69)
            elif key == "confidence_interval":
                node.update(minItems=2, maxItems=2)
            return node
        if isinstance(value, bool):
            return {"type": "boolean"}
        if isinstance(value, int):
            return {"const": 69} if key in ("n", "n_pairs") else {"type": "integer"}
        if isinstance(value, float):
            node = {"type": "number"}
            if key in ("single_pass", "multi_agent", "single_pass_cot", "multi_agent_cot", "mean", "minimum", "maximum"):
                node.update(minimum=0, maximum=100)
            if key in ("sample_sd", "sample_sd_difference"):
                node["minimum"] = 0
            if key in ("p_value_two_sided", "confidence_level", "alpha"):
                node.update(minimum=0, maximum=1)
            return node
        node = {"type": "string"}
        if key == "source_sha256":
            node["pattern"] = "^[a-f0-9]{64}$"
        if key == "case_id":
            node["pattern"] = "^case_(00[1-9]|0[1-5][0-9]|06[0-9])$"
        if key in ("schema_version", "review_date", "source_filename"):
            node = {"const": value}
        return node

    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "title": "De-identified capstone evaluation evidence",
        "description": "Allowlisted retrospective score data; no source ticket identity or text.",
        **infer(data),
    }


def verify_export(safe_json: Path) -> dict:
    """Independently verify the exported cases and summaries without private sources.

    This validates consistency, not experimental provenance or the private identity
    pairing. Exported hashes cannot be checked against originals without those files.
    """
    try:
        data = json.loads(safe_json.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        raise ValueError("Export is unavailable or is not valid JSON") from None

    def require(condition: bool, message: str):
        if not condition:
            raise ValueError("Export verification: " + message)

    def exact_keys(value, expected, message):
        require(isinstance(value, dict) and set(value) == set(expected), message)

    def number(value):
        return not isinstance(value, bool) and isinstance(value, (int, float)) and math.isfinite(value)

    def scalar_equal(actual, expected, field):
        if isinstance(expected, (int, float)):
            require(number(actual), "summary numbers must be finite")
            if isinstance(expected, int):
                require(type(actual) is int, "count fields must be integers")
            tolerance = 1e-15 if field == "p_value_two_sided" else 1e-12
            require(math.isclose(actual, expected, rel_tol=1e-9, abs_tol=tolerance), "stored summary differs from paired-score recalculation")
        else:
            require(actual == expected, "comparison definition or mapping is inconsistent")

    exact_keys(data, ["schema_version", "review_date", "analysis_type", "score_label", "score_scale", "sample", "limitations", "runs"], "unexpected top-level fields")
    require(data["schema_version"] == SCHEMA_VERSION, "unsupported schema version")
    require(data["review_date"] == AUDIT_DATE, "unexpected retrospective review date")
    for field in ["analysis_type", "score_label"]:
        require(isinstance(data[field], str) and bool(data[field].strip()), "missing context text")
    exact_keys(data["score_scale"], ["minimum", "maximum"], "invalid score-scale structure")
    require(all(type(value) is int for value in data["score_scale"].values()), "score-scale bounds must be integers")
    require(data["score_scale"] == {"minimum": 0, "maximum": 100}, "score scale must be 0 to 100")
    exact_keys(data["sample"], ["n", "sampling", "pairing", "case_ids"], "invalid sample structure")
    require(type(data["sample"]["n"]) is int and data["sample"]["n"] == EXPECTED_N, "sample size must be 69")
    for field in ["sampling", "pairing", "case_ids"]:
        require(isinstance(data["sample"][field], str), "invalid sample context")
    require(isinstance(data["limitations"], list) and bool(data["limitations"]) and all(isinstance(item, str) for item in data["limitations"]), "limitations must be a non-empty string array")
    exact_keys(data["runs"], ["run08", "run09"], "expected Run08 and Run09 only")
    expected_ids = {f"case_{i:03d}" for i in range(1, EXPECTED_N + 1)}
    run_fields = ["label", "source_filename", "source_sha256", "n", "evaluation_protocol", "mapping_evidence", "settings_evidence_limit", "methods", "comparisons", "interpretation", "cases"]
    for run_id, run in data["runs"].items():
        exact_keys(run, run_fields, "unexpected run fields")
        require(type(run["n"]) is int and run["n"] == EXPECTED_N, "run size must be 69")
        require(run["source_filename"] == SOURCE_FILES[run_id], "source basename does not match the run")
        require(isinstance(run["source_sha256"], str) and re.fullmatch(r"[a-f0-9]{64}", run["source_sha256"]) is not None, "invalid source checksum format")
        for field in ["label", "evaluation_protocol", "mapping_evidence", "settings_evidence_limit", "interpretation"]:
            require(isinstance(run[field], str) and bool(run[field].strip()), "invalid run context text")
        require(isinstance(run["cases"], list) and len(run["cases"]) == EXPECTED_N, "expected 69 paired cases per run")
        case_ids = []
        for case in run["cases"]:
            exact_keys(case, ["case_id", "scores"], "unexpected case fields")
            require(isinstance(case["case_id"], str), "case IDs must be strings")
            case_ids.append(case["case_id"])
            exact_keys(case["scores"], METHODS[run_id], "case score mapping is incomplete or has extra fields")
            require(all(number(value) and 0 <= value <= 100 for value in case["scores"].values()), "scores must be finite numbers from 0 to 100")
        require(set(case_ids) == expected_ids and len(set(case_ids)) == EXPECTED_N, "case IDs must be unique case_001 through case_069")
        exact_keys(run["methods"], METHODS[run_id], "unexpected method summaries")
        for method_id, (source_field, label) in METHODS[run_id].items():
            summary = run["methods"][method_id]
            expected = {"label": label, "source_score_field": source_field,
                        **aggregate([case["scores"][method_id] for case in run["cases"]])}
            exact_keys(summary, expected, "unexpected method-summary fields")
            for field, value in expected.items():
                scalar_equal(summary[field], value, field)
        pair_order = ([("single_pass_cot", "multi_agent"), ("single_pass_cot", "single_pass"), ("multi_agent", "single_pass")]
                      if run_id == "run08" else [("multi_agent_cot", "single_pass_cot")])
        require(isinstance(run["comparisons"], list) and len(run["comparisons"]) == len(pair_order), "wrong number of paired comparisons")
        for stored, (method_a, method_b) in zip(run["comparisons"], pair_order):
            expected = paired_comparison(run["cases"], method_a, method_b)
            exact_keys(stored, expected, "unexpected comparison fields")
            for field, value in expected.items():
                if field == "confidence_interval":
                    require(isinstance(stored[field], list) and len(stored[field]) == 2, "invalid confidence interval")
                    for actual, target in zip(stored[field], value):
                        scalar_equal(actual, target, field)
                else:
                    scalar_equal(stored[field], value, field)
    return data


def prepare_matplotlib():
    # Font-cache writes stay outside the private archive and the exported bundle.
    os.environ.setdefault("MPLCONFIGDIR", str(Path(tempfile.gettempdir()) / "capstone-mpl-cache"))
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    plt.rcParams.update({
        "font.family": ["DejaVu Sans", "Arial", "Helvetica", "sans-serif"],
        "font.size": 12,
        "text.color": INK,
        "axes.labelcolor": MUTED,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
        "svg.fonttype": "none",
        "svg.hashsalt": "capstone-evidence-v1",
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        "savefig.facecolor": "white",
    })
    return plt


def score_axis(ax, methods: dict, method_order: list[str], colors: list[str]):
    n = len(method_order)
    for index, (method_id, color) in enumerate(zip(method_order, colors)):
        y = n - index - 1
        method = methods[method_id]
        ax.text(0, y + .26, method["label"], fontsize=13, weight="medium")
        ax.text(100, y + .26, f"{method['mean']:.2f} ± {method['sample_sd']:.2f}", ha="right", fontsize=12)
        ax.errorbar(method["mean"], y, xerr=method["sample_sd"], fmt="o", markersize=9,
                    color=color, ecolor=color, elinewidth=2.3, capsize=6, capthick=1.8, zorder=3)
    ax.set(xlim=(-2, 102), ylim=(-.48, n - .3), yticks=[], xticks=[0, 25, 50, 75, 100])
    ax.set_xlabel("Judge score / 100", fontsize=12, labelpad=9)
    ax.grid(axis="x", color="#e5e8ed", linewidth=.8, zorder=0)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.tick_params(axis="x", length=0, labelsize=12)


def save_figure(fig, output_dir: Path, name: str, description: str):
    for extension in ["svg", "png"]:
        metadata = ({"Date": None, "Creator": "Capstone evidence builder", "Description": description}
                    if extension == "svg" else {"Software": "Capstone evidence builder", "Description": description})
        fig.savefig(output_dir / f"{name}.{extension}", dpi=180, metadata=metadata)


def plot_results(safe_json: Path, output_dir: Path):
    """Render exclusively from the verified de-identified JSON, never sources."""
    data = verify_export(safe_json)
    plt = prepare_matplotlib()
    footer = "Retrospective check · 02 Oct 2026 · No model rerun"
    run08 = data["runs"]["run08"]
    fig = plt.figure(figsize=(7, 6.0))
    fig.text(.095, .94, "Run08 · Three-way comparison", fontsize=19, weight="bold")
    fig.text(.095, .887, "69 paired cases · Mean ± sample SD", fontsize=13, color=MUTED)
    fig.text(.095, .835, "LLM-judge scores, not objective accuracy", fontsize=12, color=BLUE)
    ax = fig.add_axes([.095, .285, .84, .465])
    score_axis(ax, run08["methods"], ["single_pass", "multi_agent", "single_pass_cot"], [GRAY, LIGHT_GRAY, BLUE])
    compare = run08["comparisons"][0]
    fig.text(.095, .157, f"CoT − multi-agent: +{compare['mean_difference']:.2f} points", fontsize=13, weight="medium")
    fig.text(.095, .112, f"Two-sided paired t-test: p = {compare['p_value_two_sided']:.2e}", fontsize=12, color=MUTED)
    fig.text(.095, .043, footer, fontsize=12, color=MUTED)
    save_figure(fig, output_dir, "capstone-run08", "Run08 archived LLM-judge means with sample standard deviations, 69 paired cases. Not objective accuracy.")
    plt.close(fig)

    run09 = data["runs"]["run09"]
    compare = run09["comparisons"][0]
    fig = plt.figure(figsize=(7, 7.6))
    fig.text(.095, .951, "Run09 · Reviewer-loop comparison", fontsize=18, weight="bold")
    fig.text(.095, .909, "69 paired cases · Mean ± sample SD", fontsize=13, color=MUTED)
    fig.text(.095, .868, "LLM-judge scores, not objective accuracy", fontsize=12, color=BLUE)
    ax = fig.add_axes([.095, .548, .84, .26])
    score_axis(ax, run09["methods"], ["single_pass_cot", "multi_agent_cot"], [GRAY, BLUE])
    fig.text(.095, .430, "Paired difference: reviewer − single-pass CoT", fontsize=13, weight="medium")
    lower, upper = compare["confidence_interval"]
    difference = compare["mean_difference"]
    fig.text(.095, .387, f"{difference:+.2f} points · 95% CI [{lower:+.2f}, {upper:+.2f}]", fontsize=12, color=MUTED)
    diff_ax = fig.add_axes([.14, .26, .75, .09])
    diff_ax.axvline(0, color=GRAY, linestyle="--", linewidth=1.2)
    diff_ax.errorbar(difference, 0, xerr=[[difference-lower], [upper-difference]], fmt="o", color=BLUE,
                     markersize=9, elinewidth=2.3, capsize=6, capthick=1.8)
    diff_ax.set(xlim=(-6, 6), ylim=(-.6, .6), xticks=[-6, -3, 0, 3, 6], yticks=[])
    diff_ax.set_xlabel("Mean paired difference (score points)", fontsize=12, labelpad=8)
    diff_ax.tick_params(axis="x", length=0, labelsize=12)
    for spine in diff_ax.spines.values():
        spine.set_visible(False)
    fig.text(.095, .166, f"p = {compare['p_value_two_sided']:.4f} · No statistically significant difference", fontsize=12, weight="medium")
    fig.text(.095, .116, "Separate judging protocol from Run08;", fontsize=12, color=MUTED)
    fig.text(.095, .082, "cross-run scores do not establish a performance trend.", fontsize=12, color=MUTED)
    fig.text(.095, .029, footer, fontsize=12, color=MUTED)
    save_figure(fig, output_dir, "capstone-run09", "Run09 archived judge scores and paired reviewer-minus-single-pass difference with a 95% confidence interval. p=0.6232. No statistically significant difference. Not objective accuracy.")
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--source-dir", type=Path, help="Private original research directory; read only")
    source.add_argument("--plot-only", type=Path, help="Render figures from an already exported safe JSON")
    source.add_argument("--verify-export", type=Path, help="Recalculate and verify an exported JSON without private sources")
    parser.add_argument("--output-dir", type=Path, default=Path("evidence"))
    args = parser.parse_args()
    try:
        if args.verify_export:
            verify_export(args.verify_export)
            print("Verified de-identified export: 2 runs, 69 paired cases each; means, sample SDs, t-tests and 95% CIs match.")
            print("Internal consistency verified; experimental provenance and private source hashes were not revalidated.")
            return 0
        args.output_dir.mkdir(parents=True, exist_ok=True)
        if args.source_dir:
            if args.source_dir.resolve() == args.output_dir.resolve():
                raise ValueError("Use an output directory separate from the private source directory")
            result = build_results(args.source_dir)
            safe_json = args.output_dir / "capstone-results.json"
            safe_json.write_text(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False) + "\n", encoding="utf-8")
            schema_file = args.output_dir / "capstone-results.schema.json"
            schema_file.write_text(json.dumps(build_schema(result), indent=2) + "\n", encoding="utf-8")
        else:
            safe_json = args.plot_only
        plot_results(safe_json, args.output_dir)
    except (ValueError, OSError) as exc:
        # Do not print raw data, ticket IDs, private paths or low-level exceptions.
        message = str(exc) if isinstance(exc, ValueError) else "Cannot read or write a required file"
        print(f"Evidence build failed: {message}", file=sys.stderr)
        return 1
    print("Built de-identified evidence: 69 paired cases per run; source identities and text excluded.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
