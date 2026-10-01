# Capstone evidence bundle

This is a retrospective check dated **2026-10-02** of saved Run08 and Run09 evaluation scores. It does not call a model, repeat an experiment, or contact a network service. The scores are **LLM-judge scores, not objective accuracy**.

## Files

- [build_capstone_evidence.py](../../../scripts/build_capstone_evidence.py): standalone extraction, validation, statistics, and plotting script.
- `capstone-results.json`: allowlisted aggregate statistics and de-identified paired scores.
- `capstone-results.schema.json`: strict JSON Schema for the exported data structure.
- `capstone-run08.svg` and `capstone-run08.png`: three-way score comparison.
- `capstone-run09.svg` and `capstone-run09.png`: reviewer comparison and paired difference with a 95% confidence interval.

## Reproduce

Run the following commands from the portfolio repository root. Write regenerated output to a separate directory.

Use Python 3.10 or newer with NumPy and SciPy available for independent verification; Matplotlib is additionally required to generate charts. The checked build used Python 3.12, NumPy 2.3.2, SciPy 1.16.1, and Matplotlib 3.10.5. No installation or model service is performed by the script.

```sh
python scripts/build_capstone_evidence.py --source-dir PRIVATE_ARCHIVE --output-dir capstone-rebuild
```

The private archive must contain the two source filenames recorded in the safe JSON. The script reads source files without modifying them and uses a separate output directory. It validates exactly 69 rows in each run, unique non-empty ticket identities, the same ticket set across both runs, and finite numeric scores in the range 0–100. Missing scores, booleans, duplicates, and out-of-range values are rejected. Source ticket identities are used only in memory for pairing, then replaced with `case_001` through `case_069`.

To independently verify the downloadable data without the private archive:

```sh
python scripts/build_capstone_evidence.py --verify-export assets/evidence/capstone/capstone-results.json
```

This command checks the closed object structure, 69 unique pseudonymous cases per run, complete method pairing, finite 0–100 scores, source-basename and checksum formats, and method mappings. It then recalculates all means, sample standard deviations, extrema, mean paired differences, paired t-statistics, two-sided p-values, and 95% confidence intervals from the exported scores and compares them with the saved summaries. Invalid structure, invalid scores, or inconsistent summaries produce a nonzero exit status. It needs no private tickets, model service, or Matplotlib.

This verifies internal consistency. Without the private originals it cannot verify experimental provenance, whether ticket identities were originally paired correctly, or whether source checksums match the original bytes.

To render charts without the private archive:

```sh
python scripts/build_capstone_evidence.py --plot-only assets/evidence/capstone/capstone-results.json --output-dir capstone-rebuild
```

Plots first run the same independent verification and are generated exclusively from the de-identified JSON. SVG text remains editable; PNG exports use 180 dpi. Each figure is 7 inches wide and uses text sizes of at least 12 points. Fixed SVG identifiers and omitted creation timestamps make repeated outputs identical within the checked runtime.

## Data schema

The root contains `schema_version`, `review_date`, `analysis_type`, `score_label`, `score_scale`, `sample`, `limitations`, and `runs`.

Each run contains its source basename and SHA-256 checksum, sample size, method mapping and setting limitations, method summaries, paired comparisons, interpretation, and 69 pseudonymous cases. Every case contains only `case_id` and a method-to-score mapping. There is no identity lookup, repository name, issue or pull-request number, source text, judge explanation, credential, or local filesystem path. The scores remain potentially linkable if matched against the private sources; this is de-identification, not a guarantee of anonymity.

Run08 maps `baseline_score` to `single_pass`, `poc_score` to `multi_agent`, and `cot_score` to `single_pass_cot`. Run09 uses a different mapping: `baseline_score` means `single_pass_cot`, while `poc_score` means `multi_agent_cot`. Never assume `baseline_score` means the same architecture across runs.

The schema rejects additional object keys. Scores are constrained to 0–100, case arrays to 69 entries, source checksums to 64 lowercase hexadecimal characters, and pseudonymous identifiers to the expected format. Identity uniqueness, complete method pairing, and cross-run ticket-set agreement are enforced while extracting, before the identities are discarded.

## Statistical interpretation

Summaries use arithmetic means and sample standard deviations (`ddof=1`). Comparisons use two-sided paired t-tests, 68 degrees of freedom, and 95% confidence intervals on the mean paired difference. Comparisons are exploratory; p-values are unadjusted. These calculations reproduce saved judge scores and do not establish a causal mechanism or generalize beyond the evaluation setting.

Run08 reports CoT minus multi-agent as **+14.28 points**, with **p = 1.64708e-13**. Run09 reports reviewer minus single-pass CoT as **−0.90 points**, with **95% CI [−4.53, +2.73]** and **p = 0.6232**. Run09 does not establish degradation or equivalence. Run08 used three-way judging and Run09 pairwise judging; do not treat score changes between them as a performance trend.

The model and judge configuration is reported context. The archived score JSON files do not establish exact model digests, runtime, prompts, or judge settings. No ROUGE-L, human-verified accuracy, production speedup, or cost claim is exported. The original source SHA-256 checksums identify the reviewed bytes; they do not by themselves verify experimental provenance.
