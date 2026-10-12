# Xiang Zhu — personal engineering portfolio

A small static personal site with engineering case studies covering infrastructure, delivery and AI knowledge-base generation.

## Pages

- `/`: professional introduction, recent projects, enterprise experience, Codex activity and published writing.
- `/experience/`: chronological enterprise-engagement directory, with role, dates, contribution summaries and links to detailed cases.
- `/changelog/`: dated portfolio updates, including earlier milestones reconstructed from website commits.
- `/projects/story-filler/`: context, architecture, decisions, local platform practice, delivery, AI-assisted engineering and dated evidence.
- `/projects/story-filler/decisions.html`: an engineering-judgment retrospective, with edited author answers and linked implementation evidence.
- `/projects/ai-knowledge-base/`: the MSE907 capstone, with implemented architecture, decisions, checked score comparisons, an original synthetic example and explicit evidence limits.
- `/projects/fintech-platform/`: SadaPay GitOps delivery, AWS/EKS responsibilities and Terraform provisioning, with Istio and Gloo configuration context.
- `/projects/government-health-delivery/`: a Health Promotion Board, Singapore DevOps retrospective covering day-to-day platform and developer support, pipeline troubleshooting, migration ownership and client execution boundaries.

The maintained site uses its own HTML pages and shared CSS and JavaScript in `assets/`. It does not load an older website template. Typography uses the reader’s system fonts. No font files are bundled and no font CDN is required. The shared `--font-sans` and `--mono` variables in `assets/site.css` keep font choices in one place; their appearance can vary slightly across operating systems.

## Preview

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. No package install or build is required. The architecture view supports mouse and keyboard tabs. Without JavaScript, all diagrams remain readable.

## Publish with GitHub Pages

This repository is the account's user site, `jothep.github.io`. Settings → Pages is configured to publish `main` from `/ (root)`. An empty `.nojekyll` file keeps these HTML/CSS/JS files static. Push reviewed changes to `main`, check the Pages deployment result, then verify `/`, `/experience/`, `/projects/story-filler/`, `/projects/ai-knowledge-base/`, `/projects/government-health-delivery/`, `/projects/fintech-platform/` and `/changelog/` on the public site. The application at `/story-filler/` is published independently by its project repository.

## Content and evidence

The Story Filler case reflects the project review and application release checks on 27–28 September 2026. Its screenshot shows the actual public application, captured on 28 September 2026. A displayed screenshot is not a full gameplay test.

Canonical engineering sources live in the separate public [`jothep/story-filler`](https://github.com/jothep/story-filler) repository: `docs/engineering-case-study.md`, `docs/local-platform-lab.md`, `docs/architecture-production-gcp.md`, and `docs/verification.md`. The original repository remains private. Public aggregate snapshots preserve its historical delivery record; the new repository has its own public release records.

When updating claims, distinguish implemented configuration, dated deployment verification, and future work. Do not infer current uptime, billing, security guarantees, original design intent, or personal authorship from the existence of code. The AI-assisted example describes the September 2026 follow-up review; it does not invent an AI development history for the original application.

## Adding later work

Keep the homepage closing order fixed: **About the author**, then **Get in touch**. Insert future project, activity or writing sections above About. Preserve the `about` section ID and the header About link to `#about`.

Add another selected-work entry only when its context, personal contribution, decisions and evidence are ready. Keep detailed case pages under `projects/<slug>/`. Each selected project needs a complete, reviewable case study rather than a placeholder entry.

Do not copy application credentials, environment files, Terraform state, private archives or the application's Git history into this repository.

## Adding selected writing

The homepage articles form a horizontal, scrollable row, ordered newest first. Add a complete
`article.writing-card` as the **first child** of `#writing-track` in `index.html`, with its original
publication date, title, summary and link. Keep the remaining cards in descending date order and
update the static `[data-writing-count]` label; JavaScript also derives the count from the cards.
No JavaScript or CSS changes are needed when adding articles.

Readers can swipe or scroll the row, use the newer/older buttons, or focus the row and use the
arrow keys, Home and End. Scrolling and links still work without JavaScript. There is no autoplay;
reduced-motion preferences are respected, and all cards remain visible when printing.

## Maintaining the changelog

For a user-visible website change, add an entry at the top of `changelog/index.html` in the same update. Use the actual change date in Pacific/Auckland, a stable descriptive anchor, a short title, and specific Added, Improved, Updated or Corrected notes. Keep only the newest entry’s Latest badge and maintain the date-navigation links as new months are added.

Link to the affected page or evidence. Historical entries can cite the relevant website commit or comparison; do not invent version tags, release dates or application features. The log describes portfolio features, project content and technical changes. Do not include author biographies, career details or profile-information updates. Adding project documentation is not an application deployment, and article publication dates are separate from the dates articles were linked here. The initial September entries were backfilled on 2 October 2026 from Git history.

Check the homepage button, entry anchors, relative links and mobile layout before publishing. Activity statistics remain a dated snapshot unless a separate, authorised refresh is performed.

## Capstone evidence and publication boundary

The AI knowledge-base page is a retrospective review of retained capstone artefacts. Its Run 08 and Run 09 scores were recalculated on 2 October 2026 without running model inference. The homepage activity snapshot is a separate artefact. Its latest refresh covers 5 September–11 October 2026, with 461 recorded turns across 26 active days; the final day is partial. It uses the same selected software-workspace scope and counting rules as the earlier snapshot.

The capstone publication includes only the authored case page, original diagrams and synthetic example, the score-only export, generated figures, calculation script and evidence notes. Do not copy raw issue/PR data, generated articles, judge explanations, model caches, credentials, reports, slides, submission archives, academic identity fields or private filesystem paths into this site.

Keep interpretation bounded: LLM-judge scores are not objective accuracy percentages; the two runs use different evaluation settings; Run 09 did not show statistically significant benefit or degradation. The inspected implementation has two LLM roles and a deterministic finalisation node. Blind evaluation, ROUGE-L, human review and production deployment are not verified claims.

The local preview was approved for publication on 2 October 2026. Keep the underlying research and evidence-review dates separate from later website updates. Future changes should preserve the same publication boundary and record material changes in the changelog.

## Enterprise case publication boundary

Use the candidate's canonical profile, relevant CV and direct confirmations to establish the
basic role, dates and responsibilities. Retained artefacts add technical examples and detail;
they are not a prerequisite for describing confirmed experience. A lack of old project files
must not reduce an established role to only the tasks visible in the remaining documents.
Give later candidate corrections precedence over older summaries, and ask focused questions
when accounts conflict or a new specific attribution or result is unclear. Do not infer that
the author designed or completed every item visible in retained material. Keep private career
records and original evidence outside this public repository.

The Health Promotion Board, Singapore delivery case was prepared on 12 October 2026 from retained
working notes, authored teaching materials and the author's confirmed project account. This is a historical
retrospective, not a current customer-environment audit. The successful migration outcome is
confirmed by the author; an earlier checklist is an intermediate record, not the final status. The
12 October follow-up explains that most inherited scripts were rewritten around general-purpose,
reusable functionality and custom scripts. Do not infer a language replacement, specific GitLab
reuse features, behavioural-equivalence tests or measured efficiency gains from that account.
The participation period covers the overall engagement, not precise migration dates.

Present the migration and CI/CD rebuild as major deliveries within a broader DevOps role.
Day-to-day Azure/AKS support, helping development teams and troubleshooting pipelines belong in
the main role description. Terraform sessions are a brief knowledge-sharing example, not a main
project workstream. Do not add on-call responsibility, SLO ownership or operational metrics.

Cross-team service requests concerned restricted external operations and migration setup. They
did not block the team’s routine CI/CD pipelines. Deployment timing was coordinated with the
Product Owner. Do not turn the FOD migration-setup blocker or ticketed external operations into
per-release approval gates or a claim that routine pipeline changes waited on other teams.

On 12 October 2026, the author explicitly approved naming the client as Health Promotion Board,
Singapore on the public portfolio. Keep internal project names, addresses, resource identifiers,
original topology, source files and private evidence packages out of this repository. The page's
responsibility figure is newly drawn and conceptual. Public platform background must not become proof of
personal delivery. Preserve the distinction between the main role in the later migration and
collaborative participation in an earlier incident. Terraform import results describe sandbox
experiments with selected ignored attributes, not production recovery or complete drift coverage.

Keep `#enterprise-experience` as a homepage selection of two or three representative cases.
The complete set of documented engagements belongs in `experience/index.html`, ordered by most
recent participation. Each `article.experience-entry` has a stable ID, client or approved anonymous
name, role, participation dates, employer relationship, short contribution summary and optional
case link. A short, confirmed account can remain in the directory until a full case is ready;
do not invent details or create placeholder pages to fill the structure.

Use recognisable client/industry names and engineering subjects in the directory and homepage.
On detailed enterprise case pages, use the client or project name as the main heading and a factual
work-scope subtitle. Identify the employer/client relationship in the small text above the heading.
Narrative headings can introduce specific investigations or delivery topics within a case.
Treat an engagement as one entry: routine support, migrations, investigations and knowledge
sharing are topics within that engagement,
not separate homepage cards. Distinguish the employer from its client and participation dates
from the date of any particular delivery. Keep existing case URLs and section anchors stable.
Each case breadcrumb returns to its own directory entry.

When adding an engagement, copy one readable HTML entry and change its content. The shared CSS
handles additional entries without JavaScript, filtering or a build step. Only edit the homepage
selection when changing which cases to feature; it does not need to grow with the directory.
Keep these entries above About and Contact. Do not manufacture performance metrics, testimonials
or answers to new interview challenges. The Codex activity snapshot is not refreshed as part of
enterprise-case work. Preserve draft labels and publication boundaries for unpublished cases.

## Editing the site directly

The HTML files are the content source. Edit paragraphs and links in place, using semantic sections and two-space indentation. Shared presentation lives in `assets/site.css`; optional interaction lives in `assets/site.js`. No build step is required. Keep only maintained pages, their required assets, supporting evidence and development configuration in this repository. Do not add old resumes, retired templates or operating-system metadata files.

For routine edits, use this file map:

| File or directory | Purpose |
| --- | --- |
| `index.html` | Homepage content and the dated activity snapshot |
| `experience/index.html` | Full directory of documented enterprise engagements |
| `projects/*/index.html` | Detailed case-study content |
| `projects/story-filler/decisions.html` | Questions addressed to the author, answers and AI review notes |
| `changelog/index.html` | Dated website changes |
| `assets/site.css` | Shared visual styles, grouped by section comments |
| `assets/site.js` | Architecture tabs, compact contents menu and section highlighting |
| `scripts/` | Optional evidence and activity generators; not required to serve the site |
| `assets/evidence/` | Published, dated evidence; do not regenerate it as part of formatting |

Use the checked-in Prettier settings for HTML, CSS and JavaScript. Formatting is an optional authoring tool, not a publishing dependency:

```sh
npx prettier@3.6.2 --write "**/*.{html,css,js}"
```

Use `htmlWhitespaceSensitivity: "css"` so formatting preserves spaces around inline text. Keep punctuation directly beside an inline closing tag, for example `</a>.` or `</code>;`. For a long-link paragraph that Prettier would split into hard-to-read tags, use a local `<!-- prettier-ignore -->` comment and keep that paragraph neatly indented by hand. Do not switch to global whitespace-insensitive HTML formatting.

The activity generator also emits indented, multi-line HTML and preserves the surrounding page indentation when replacing its marked block. A formatting pass must not refresh the dated activity snapshot or read private activity records.

Keep CSS declarations on separate lines and add brief comments for major page sections. After formatting shared files, check the homepage, all case studies, the engineering-decisions page and the changelog in a browser. Confirm narrow layouts, anchor links and architecture tabs still work.

### Editing engineering answers

Present the author's considered answers after discussion. Integrate small corrections, missing context and explanations the author has understood into those answers; the public page does not need to catalogue every initial misconception. Preserve useful follow-up questions that test the decision. The purpose is to make the author's reasoning clear and credible.

Keep substantive technical extensions separate when they go beyond the author's answer or understanding, and obtain the author's review before adding them. Consolidation must not turn a design proposal into an implemented feature, a suggested check into a completed test, or a current understanding into a claim of past experience. Use compact implementation notes for those distinctions.

Write every question and follow-up as a reviewer addressing the author with "you" or "your". Keep the author's answers in the first person and label AI review separately. Do not present the exchange as an interview with real experts. Use question titles without job-role labels. Keep planned Go or Operator work out of the current case study until there is work to present. Distinguish the date of a retrospective/source review from the dates of deployment evidence, and do not imply that a historical forecast was recorded at the time unless it was.


## SadaPay case publication boundary

The author approved publication on 12 October 2026. The current scope focuses on confirmed
AWS/EKS infrastructure support, Terraform provisioning and use of the existing Argo CD/GitHub
Actions GitOps setup. Istio is confirmed platform context; retained non-production Gloo values
support a neutral description of routing configuration.

The author's later scope correction on the same date supersedes the earlier request-flow
narrative. Exclude the sketch, login/redirect investigation and associated client-presentation
claims from the public case, summaries and changelog descriptions. Do not reintroduce these as
personal delivery or an interview example without renewed confirmation. The retained gateway
values do not establish Gloo selection, introduction, configuration authorship or a deployment
result. Do not infer detailed Istio configuration ownership or an Istio/Gloo integration topology.

Keep product-level explanations of Argo CD separate from confirmed use of the existing setup.
No specific sync policy, repository layout or rollout strategy has been supplied. Do not add
GitOps design ownership, zero-downtime attribution, DR execution or recovery-time claims. The
January personal-development note is not evidence of delivered work or a technical-lead role.

Original materials remain outside this repository. Do not copy source YAML, shell scripts,
screenshots, private notes, hostnames, upstream identifiers, endpoint maps, tokens or
credential-shaped values into the website or its Git history. Retained material supplements
confirmed responsibilities; it does not define their full scope.

Keep About and Contact ordering, existing enterprise work, and dated activity snapshots intact.
Publication of this case is a portfolio update, not a deployment of the client platform.
