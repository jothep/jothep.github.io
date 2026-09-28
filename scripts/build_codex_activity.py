#!/usr/bin/env python3
"""Build an aggregate-only portfolio snapshot from selected local Codex workspaces.

Reads metadata columns only. No conversation text, tokens, credentials, thread IDs,
workspace paths or project names are included in the public output.
"""
import argparse
import calendar
from collections import Counter
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import sqlite3
from zoneinfo import ZoneInfo


def readonly(path):
    return sqlite3.connect(path.resolve().as_uri() + '?mode=ro', uri=True)


def collect(codex_home, workspaces, zone, cutoff):
    # Explicit filenames: an unknown local schema must fail rather than invent data.
    with readonly(codex_home / 'state_5.sqlite') as state:
        roots = {
            thread_id for thread_id, cwd, source in state.execute(
                'SELECT id, cwd, source FROM threads'
            ) if source in ('vscode', 'cli', 'exec') and Path(cwd).resolve() in workspaces
        }
    if not roots:
        raise ValueError('No eligible top-level threads in the selected workspaces.')
    days, seen, missing, duplicates, excluded_running = Counter(), set(), 0, 0, 0
    # Deduplicate copied turn IDs across forked conversations. Counting by turn ID
    # does not count a delegated agent as another user interaction.
    with readonly(codex_home / 'thread_history_1.sqlite') as history:
        rows = history.execute(
            'SELECT thread_id, turn_id, status, started_at FROM thread_turns '
            'ORDER BY started_at, turn_id'
        )
        for thread_id, turn_id, status, started in rows:
            if thread_id not in roots:
                continue
            if status not in ('completed', 'failed', 'interrupted'):
                excluded_running += 1
                continue
            if not started:
                missing += 1
                continue
            if started > cutoff.timestamp():
                continue
            if turn_id in seen:
                duplicates += 1
                continue
            seen.add(turn_id)
            days[datetime.fromtimestamp(started, zone).date().isoformat()] += 1
    if not days:
        raise ValueError('No dated, finished turns in the selected workspaces.')
    start = date.fromisoformat(min(days))
    end = cutoff.astimezone(zone).date()
    daily = [
        {'date': (start + timedelta(days=n)).isoformat(),
         'turns': days[(start + timedelta(days=n)).isoformat()]}
        for n in range((end - start).days + 1)
    ]
    return {
        'schema_version': 1,
        'generated_at': cutoff.isoformat(timespec='seconds'),
        'timezone': str(zone),
        'scope': 'Selected local software-project workspaces',
        'source': 'Local Codex thread metadata; self-reported snapshot',
        'metric': 'Distinct top-level turns with a recorded start time and a terminal status',
        'period_start': start.isoformat(), 'period_end': end.isoformat(),
        'totals': {'recorded_turns': sum(days.values()), 'active_days': len(days),
                   'calendar_days': len(daily)},
        'exclusions': {'duplicate_turn_records': duplicates,
                       'records_without_start_time': missing,
                       'nonterminal_turn_records': excluded_running},
        'limitations': [
            'Selected workspaces include planning, implementation, debugging and documentation.',
            'Subagents and other workspaces are excluded. Forked turn IDs are counted once.',
            'Failed and interrupted turns count as activity, not completed work.',
            'Dates use the start of each turn in Pacific/Auckland; ongoing turns are excluded.',
            'Zero means no qualifying retained record, not proof of no activity.',
            'Coverage is limited to dated records retained on this computer.',
            'This is not an official OpenAI usage export or an account-wide total.',
            'Activity is not a measure of commits, lines of code, code ownership or quality.'
        ],
        'daily': daily,
    }


def level(n):
    return 0 if n == 0 else 1 if n < 10 else 2 if n < 30 else 3 if n < 60 else 4


def render(data):
    start = date.fromisoformat(data['period_start'])
    end = date.fromisoformat(data['period_end'])
    counts = {x['date']: x['turns'] for x in data['daily']}
    panels = []
    month = start.replace(day=1)
    while month <= end:
        cells = ['<span class="activity-day is-empty" aria-hidden="true"></span>'] * month.weekday()
        for n in range(1, calendar.monthrange(month.year, month.month)[1] + 1):
            d = month.replace(day=n)
            if not start <= d <= end:
                cells.append('<span class="activity-day is-empty" aria-hidden="true"></span>')
                continue
            value = counts[d.isoformat()]
            label = f'{d:%-d %B %Y}: {value} recorded turns'
            cells.append(f'<span class="activity-day" data-level="{level(value)}" title="{label}" aria-label="{label}"><span aria-hidden="true">{n}</span></span>')
        panels.append(f'<div class="activity-month"><h3>{month:%B %Y}</h3><div class="activity-weekdays" aria-hidden="true"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="activity-days">{"".join(cells)}</div></div>')
        month = date(month.year + (month.month == 12), month.month % 12 + 1, 1)
    totals = data['totals']
    daily_rows = ''.join(f'<tr><th scope="row">{x["date"]}</th><td>{x["turns"]}</td></tr>' for x in data['daily'])
    exclusions = data['exclusions']
    return f'''    <!-- BEGIN CODEX ACTIVITY: generated by scripts/build_codex_activity.py -->
    <section class="ai-activity-section wrap" id="ai-activity" aria-labelledby="ai-activity-title">
      <div class="section-label"><h2 id="ai-activity-title">Codex project activity</h2><span>AI-assisted practice</span></div>
      <p class="reading-note">I use Codex across planning, implementation, debugging and documentation. This snapshot shows the rhythm of that work; the Story Filler case study shows how I check the results.</p>
      <div class="activity-card">
        <div class="activity-heading"><p class="eyebrow">Selected software-project workspaces</p><p class="activity-caption"><time datetime="{start}">{start:%-d %b %Y}</time> – <time datetime="{end}">{end:%-d %b %Y}</time> · Auckland time</p></div>
        <dl class="activity-metrics"><div><dt>Recorded turns</dt><dd>{totals['recorded_turns']:,}</dd></div><div><dt>Active days</dt><dd>{totals['active_days']}</dd></div><div><dt>Calendar days covered</dt><dd>{totals['calendar_days']}</dd></div></dl>
        <figure class="activity-calendar" aria-label="Daily Codex activity by month"><div class="activity-months">{''.join(panels)}</div><figcaption class="activity-legend"><span>Turns per day</span><span><i data-level="0"></i>0</span><span><i data-level="1"></i>1–9</span><span><i data-level="2"></i>10–29</span><span><i data-level="3"></i>30–59</span><span><i data-level="4"></i>60+</span></figcaption></figure>
        <p class="activity-caption">Static snapshot updated {end:%-d %B %Y}; the final day is partial. Activity measures use of Codex, not code output or engineering quality.</p>
        <details class="activity-methodology"><summary>What these numbers include</summary><p>Aggregated locally from retained Codex metadata for explicitly selected software-project workspaces. A turn is one recorded assistant work cycle; a follow-up starts another turn. Planning and documentation in those workspaces are included. Other workspaces, including job-search tasks, are excluded.</p><p>Only top-level turns with a start time and a finished, failed or interrupted status are counted. Forked copies are deduplicated by turn ID; subagent work is excluded. Dates use each turn’s start in Pacific/Auckland. This export omitted {exclusions['duplicate_turn_records']} duplicate records, {exclusions['records_without_start_time']} records without a start time and {exclusions['nonterminal_turn_records']} nonterminal records. An active day has at least one qualifying turn; zero means no qualifying record was retained.</p><p>This is a self-reported local snapshot, with coverage limited to retained records. It is not an official OpenAI export or an account-wide total, and it does not count completed features, commits, lines of code or hours worked. Only dates and aggregate counts are published; prompts, responses, workspace paths and credentials stay local.</p><p><a href="assets/evidence/codex-activity.json">Download the aggregate snapshot (JSON)</a> · <a href="https://github.com/jothep/jothep.github.io/blob/main/scripts/build_codex_activity.py">Read the counting script</a></p><details><summary>Daily counts in a table</summary><table><caption>Recorded turns by start date</caption><thead><tr><th scope="col">Date</th><th scope="col">Turns</th></tr></thead><tbody>{daily_rows}</tbody></table></details></details>
      </div>
      <div class="activity-links"><a class="text-link" href="projects/story-filler/#ai-practice">See how I verify AI-assisted work <span aria-hidden="true">↗</span></a></div>
    </section>
    <!-- END CODEX ACTIVITY -->
'''


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--codex-home', type=Path, default=Path.home() / '.codex')
    p.add_argument('--workspace', type=Path, action='append', required=True,
                   help='Explicit local workspace to include; repeat as needed. Paths stay local.')
    p.add_argument('--site', type=Path, required=True)
    args = p.parse_args()
    data = collect(args.codex_home, {x.resolve() for x in args.workspace},
                   ZoneInfo('Pacific/Auckland'), datetime.now(timezone.utc))
    html = (args.site / 'index.html').read_text()
    block = render(data)
    begin = '    <!-- BEGIN CODEX ACTIVITY: generated by scripts/build_codex_activity.py -->'
    end = '    <!-- END CODEX ACTIVITY -->\n'
    if begin in html:
        a = html.index(begin)
        b = html.index(end, a) + len(end)
        html = html[:a] + block + html[b:]
    else:
        marker = '    <section class="writing-section wrap"'
        if marker not in html:
            raise ValueError('Homepage insertion point not found.')
        html = html.replace(marker, block + marker, 1)
    target = args.site / 'assets/evidence/codex-activity.json'
    target.write_text(json.dumps(data, indent=2) + '\n')
    (args.site / 'index.html').write_text(html)
    print(json.dumps({'totals': data['totals'], 'period_start': data['period_start'],
                      'period_end': data['period_end'], 'exclusions': data['exclusions']}))


if __name__ == '__main__':
    main()
