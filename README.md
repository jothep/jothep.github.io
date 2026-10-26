# Xiang Zhu — personal engineering portfolio

A small static personal site with engineering case studies covering infrastructure, delivery and AI knowledge-base generation.

## Pages

- `/`: professional introduction, enterprise experience, projects and research, technical deep dives, selected writing, Codex activity, About and Contact.
- `/certifications/`: academic degree and professional certificate images with award dates, linked from About.
- `/experience/`: chronological enterprise-engagement directory, with role, dates, contribution summaries and links to detailed cases.
- `/engineering/`: directory of completed project questions, considered answers and follow-ups.
- `/projects/banking-container-platform/decisions.html`: CMB fixed network identities and VM/container coexistence, with operational and collaboration follow-ups.
- `/changelog/`: dated portfolio updates, including earlier milestones reconstructed from website commits.
- `/designs/hpb-pipeline-migration/`: HPB delivery implementation, runner preparation, SIT pipeline, environment differences and technical questions.
- `/projects/government-health-delivery/decisions.html`: HPB engineering judgment about script boundaries, environment constraints and delivery ownership, with pending challenges.
- `/designs/aws-cross-region-dr/`: an independent AWS warm standby design covering recovery goals, architecture and operating decisions.
- `/projects/story-filler/`: context, architecture, decisions, local platform practice, delivery, AI-assisted engineering and dated evidence.
- `/projects/story-filler/decisions.html`: an engineering-judgment retrospective, with edited author answers and linked implementation evidence.
- `/projects/ai-knowledge-base/`: the MSE907 capstone, with implemented architecture, decisions, checked score comparisons, an original synthetic example and explicit evidence limits.
- `/projects/banking-cms-consulting/`: Shenzhen Rural Commercial Bank CMS consulting, two inspections and operations guidance.
- `/projects/banking-devops-consulting/`: ICBC, Zhuhai consulting on delivery measures, database changes and traffic switching.
- `/projects/automotive-devops/`: Daimler AG credential migration, GoCD Pipeline-as-Code, OpenShift delivery and handover.
- `/projects/aws-platform-reliability/`: Authority Brands SRE support, Terraform module refactoring, platform assessment and EKS upgrade planning.
- `/projects/application-monitoring/`: Costa application monitoring, Graylog-to-Alertmanager-to-Slack integration and scheduled homepage checks.
- `/projects/banking-container-platform/`: China Merchants Bank container-platform consulting and business analysis for operations systems across four phases, with design decisions, delivery support and monitoring capabilities.
- `/projects/fintech-platform/`: SadaPay GitOps delivery, AWS/EKS responsibilities and Terraform provisioning, with Istio and Gloo configuration context.
- `/projects/government-health-delivery/`: a Health Promotion Board, Singapore DevOps retrospective covering day-to-day platform and developer support, pipeline troubleshooting, migration ownership and client execution boundaries.

The maintained site uses its own HTML pages and shared CSS and JavaScript in `assets/`. It does not load an older website template. Typography uses the reader’s system fonts. No font files are bundled and no font CDN is required. The shared `--font-sans` and `--mono` variables in `assets/site.css` keep font choices in one place; their appearance can vary slightly across operating systems.

## Enterprise cases added on 14 October 2026

The author approved publication of Authority Brands and Costa on 14 October 2026, following
local review. Each case has a canonical URL and is maintained in HTML/CSS. The full directory
includes all documented engagements in chronological order. The homepage features four representative
cases; its selection and maintenance rules are described below.

Authority Brands: Jul–Nov 2021, SRE Support / DevOps Developer at Thoughtworks. Lead with
confirmed Terraform module refactoring and the jointly prepared platform assessment. Describe
EKS upgrade planning as a project workflow, without turning it into a new personal execution
claim. Recovery service modules are a confirmed contribution.

Costa: Apr–Jun 2019, DevOps Engineer at Thoughtworks, using AWS, Terraform and monitoring
tools including Prometheus. Keep this broader context separate from the specific alert path.
The author confirmed developing the monitoring system. Its log alert path is Graylog to
Alertmanager via a notification integration, then Slack. Scheduled homepage checks have a separate Slack reporting path. China/Japan are
business contexts; use functional diagrams without client addresses or original screenshots.

Keep internal source analysis outside the visitor-facing text. These are portfolio case
studies, not new deployments or measurements of the historical client systems.

## Preview

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. No package install or build is required. The architecture view supports mouse and keyboard tabs. Without JavaScript, all diagrams remain readable.

## Publish with GitHub Pages

This repository is the account's user site, `jothep.github.io`. Settings → Pages is configured to publish `main` from `/ (root)`. An empty `.nojekyll` file keeps these HTML/CSS/JS files static. Push reviewed changes to `main`, check the Pages deployment result, then verify `/`, `/experience/`, `/projects/automotive-devops/`, `/projects/banking-devops-consulting/`, `/projects/banking-cms-consulting/`, `/projects/story-filler/`, `/projects/ai-knowledge-base/`, `/projects/government-health-delivery/`, `/projects/fintech-platform/`, `/projects/banking-container-platform/`, `/projects/aws-platform-reliability/`, `/projects/application-monitoring/`, `/designs/aws-cross-region-dr/`, `/designs/hpb-pipeline-migration/`, `/projects/government-health-delivery/decisions.html`, `/engineering/`, `/certifications/` and `/changelog/` on the public site. The application at `/story-filler/` is published independently by its project repository.

## Content and evidence

The Story Filler case reflects the project review and application release checks on 27–28 September 2026. Its screenshot shows the actual public application, captured on 28 September 2026. A displayed screenshot is not a full gameplay test.

Canonical engineering sources live in the separate public [`jothep/story-filler`](https://github.com/jothep/story-filler) repository: `docs/engineering-case-study.md`, `docs/local-platform-lab.md`, `docs/architecture-production-gcp.md`, and `docs/verification.md`. The original repository remains private. Public aggregate snapshots preserve its historical delivery record; the new repository has its own public release records.

When updating claims, distinguish implemented configuration, dated deployment verification, and future work. Do not infer current uptime, billing, security guarantees, original design intent, or personal authorship from the existence of code. The AI-assisted example describes the September 2026 follow-up review; it does not invent an AI development history for the original application.

## Adding later work

Keep the homepage reading order: **Enterprise experience → Projects & research → Technical deep dives → Selected writing → Codex project activity → About the author → Get in touch**. Enterprise experience follows the hero immediately, as requested by the author on 16 October 2026. Activity stays immediately before About. Insert future work above this closing activity/About/Contact group. Preserve section IDs and the header About link to `#about`. The homepage introduction keeps two compact shortcuts: **Engineering judgment & inquiry** first as a teal filled button, followed by the outlined **View changelog**. Enterprise experience follows immediately below.

Add another Projects & research entry only when its context, personal contribution, decisions and evidence are ready. Keep detailed case pages under `projects/<slug>/`. Each selected project needs a complete, reviewable case study rather than a placeholder entry.

Do not copy application credentials, environment files, Terraform state, private archives or the application's Git history into this repository.

## Adding selected writing

The homepage articles form a horizontal, scrollable row, ordered newest first. Add a complete
`article.writing-card` as the **first child** of `#writing-track` in `index.html`, with its original
publication date, title, summary and link. Keep the remaining cards in descending date order and
update the static `[data-writing-count]` label (for example, `4 articles`); JavaScript also derives the count from the cards. These are item counts, not section numbers. Use the same explicit wording for `[data-work-count]` (for example, `2 case studies`) and keep its static fallback aligned with the project cards.
No JavaScript or CSS changes are needed when adding articles.

Readers can swipe or scroll the row, use the newer/older buttons, or focus the row and use the
arrow keys, Home and End. Scrolling and links still work without JavaScript. There is no autoplay;
reduced-motion preferences are respected, and all cards remain visible when printing.

## Adding technical deep dives

Keep technical studies in `designs/<slug>/` and link them from `#technical-designs`,
immediately after Projects & research. Add one readable `article.design-card` with a topic,
title, concise summary and one link. The list grows as studies are added; do not add empty cards
or a separate index page before it is needed. Keep the design's purpose clear in its introduction.
Use this section for implementation walkthroughs, technical mechanisms, failure analysis and
architecture studies. Identify confirmed implementation through its project context; introduce
independent proposals by their design purpose. Do not treat an independent proposal as a past
client deployment. Link to the related case and engineering judgment page where available.

Keep the Codex activity BEGIN/END markers together when moving content. Its generator replaces
the block in place and uses About as the first-insertion fallback. The activity figures, calendar,
dates and methodology sit inside a native `details.activity-snapshot` disclosure, closed by default.
The short introduction and verification link stay outside it. `render(data)` must preserve this
structure and accept the existing aggregate JSON without collecting new activity. Layout changes
must not refresh the snapshot or access private activity records.

## Maintaining the changelog

For a user-visible website change, add an entry at the top of `changelog/index.html` in the same update. Use the actual change date in Pacific/Auckland, a stable descriptive anchor, a short title, and specific Added, Improved, Updated or Corrected notes. Keep only the newest entry’s Latest badge. Month choices, daily counts and year choices are derived automatically from the entry dates.

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

Keep all documented enterprise cases in `experience/index.html`, ordered by participation end
date, newest first; use start date as the tie-breaker. The homepage features four representative
cases in this order: Health Promotion Board, China Merchants Bank, Daimler and ICBC. Its two-column
`.experience-grid` becomes a single column on narrow screens and needs no JavaScript. This is a
curated selection, not a timeline; participation dates remain visible on each card.

Link the project title directly to its case on both surfaces; do not add a separate “Read the case”
link. Each `article.experience-entry` in the directory has a stable ID, client or approved anonymous
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

When adding an engagement, add its directory entry in chronological order and update the homepage's
“View all N engagements” link. Change the four-case homepage selection only as an intentional
editorial decision; do not automatically add every new case to it. Keep the static selected-case
count aligned with its cards. Selected writing retains its independent horizontal carousel.

The shared main navigation uses “Experience” and links to the homepage's `#enterprise-experience`.
The visible “Projects & research” heading retains the `#work` ID so existing links keep working.
Keep these sections above About and Contact. Do not manufacture performance metrics, testimonials
or answers to new interview challenges. The Codex activity snapshot is not refreshed as part of
enterprise-case work. Preserve draft labels and publication boundaries for unpublished cases.

### Publication approved — 17 October 2026

This update features four enterprise cases, updates the shared navigation and
Projects & research label, and strengthens existing case summaries and the China Merchants Bank
introduction. The full directory retains all eight engagements and its chronological order.
The author approved publication after reviewing the local layout and the clarified wording
for business analysis for operations systems.

## Public writing: contributions, decisions and results

The portfolio presents the author's experience, technical judgement and ideas. Lead with the work,
the reasoning and the result. Use page types such as client case, research study and technical design
to orient readers. Avoid repeated disclaimers or lists of things the author has not done.

State the actual method and evidence positively: which checks passed, what configuration declares,
what a metric measures and what an experiment supports. Keep material operating constraints and
research methodology in one useful place. A proposed design remains a design; reframing must not
invent deployments, tests, metrics or ownership. Editorial and evidence-handling instructions are
for maintainers, not boilerplate to reproduce on every public page.

## Editing the site directly

The HTML files are the content source. Edit paragraphs and links in place, using semantic sections and two-space indentation. Shared presentation lives in `assets/site.css`; optional interaction lives in `assets/site.js`. No build step is required. Keep only maintained pages, their required assets, supporting evidence and development configuration in this repository. Do not add old resumes, retired templates or operating-system metadata files.

For routine edits, use this file map:

| File or directory | Purpose |
| --- | --- |
| `index.html` | Homepage content and the dated activity snapshot |
| `certifications/index.html` and `certifications/certificates.css` | Certificate gallery and scoped styles |
| `experience/index.html` | Full directory of documented enterprise engagements |
| `projects/*/index.html` | Detailed case-study content |
| `designs/*/index.html` | Technical design studies; distinguish proposals from confirmed implementation retrospectives |
| `engineering/index.html` and `engineering/directory.css` | Project inquiry directory and its scoped layout |
| `projects/*/decisions.html` | Questions addressed to the author, considered answers and follow-ups |
| `changelog/index.html` | Dated website changes; source for archive filters and update counts |
| `changelog/changelog.css` and `changelog/changelog.js` | Scoped calendar, month filtering and pagination |
| `assets/site.css` | Shared visual styles, grouped by section comments |
| `assets/site.js` | Architecture tabs, compact contents menu, section highlighting and writing carousel |
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


## Engineering inquiry directory — publication approved, 18 October 2026

`engineering/index.html` links to the completed CMB and Story Filler discussions. Add future
projects as readable `article.inquiry-entry` rows, with a short context, topic summary and one
primary link to `projects/<slug>/decisions.html`. Keep judgment questions about decisions,
constraints and ownership there; keep implementation mechanisms in the related technical deep dive. Keep the displayed project/question counts in
sync with the actual entries. Do not add placeholders for discussions not yet prepared.

The CMB page reuses the shared judgment-page styles and optional mobile contents menu. Its
case-study entry, the directory and the individual inquiry page should remain connected.
Keep the main questions lettered a., b., etc., with follow-ups under the associated answer.
Questions address the author; considered answers use first-person language. Do not add an
AI-answer panel when the author has already understood and incorporated the clarification.

The author confirmed during the 18 October discussion that database access required fixed
application source IPs **and source ports**. hostNetwork shares the host network; the complete
configuration satisfies the access rule. Do not infer the specific source-port implementation,
a universal NodePort latency problem, or automatic host failover. The old host is shut down and
removed before a replacement takes its addresses; bank system administrators use the platform
management interface. VM/container coexistence was planned around unchanged legacy systems
and permissions. UX and development colleagues led the common UI; the author's focus was
infrastructure and container integration. Retained private records remain outside this site.

The author approved publication on 18 October 2026 after reviewing the local pages. Verify
`/engineering/` and both inquiry pages alongside the existing publication checks. The project
participation dates remain 2018–2020.

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

Lead with day-to-day AWS/EKS support, Terraform provisioning and the confirmed DR-module work.
Keep Istio/Gloo as brief platform context rather than a main personal workstream.
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


## AWS cross-Region DR design

Prepared and approved for publication by the author on 14 October 2026 after local review.
The page has a canonical URL and is included in the public-site verification. Keep the
publication date separate from any future recovery exercises or implementation results.

The author confirmed on 14 October 2026 that he worked on Terraform modules intended to support
disaster recovery during the SadaPay engagement. This is a new personal clarification, not a
claim independently established by the retained original artifacts. Keep the public responsibility
brief. Do not infer whole-system DR ownership, cross-Region implementation, failover execution,
drills, measured RTO/RPO or cost outcomes. Do not transfer another engagement's recovery-module
work to this case.

`designs/aws-cross-region-dr/` is a separate illustrative proposal. EKS, ALB, RDS PostgreSQL,
two VPCs and the warm standby topology are example choices, not SadaPay's historical architecture.
Use the Technical design page type and independent-study link wording to identify its purpose.
Lead the introduction with the design approach; do not repeat project disclaimers in the hero,
figures or references. Return links lead to the homepage’s Technical deep dives section. The original
project files, private preparation notes and personal archive remain outside this repository.

Edit the readable HTML and scoped `design.css` directly. The original `warm-standby.svg` and
`warm-standby-mobile.svg` present the same architecture at different widths; update both if a
flow or label changes. Native SVG and an HTML recovery sequence require no diagram runtime.
Preview both compositions, the mobile contents menu, source links and return navigation after edits.
Keep AWS and HashiCorp references close to the technical design. Diagram arrows distinguish
client traffic, asynchronous replication and independent backup copies; traffic moves only after
writer isolation, database takeover, capacity preparation and application validation.

## China Merchants Bank case

The author approved publication on 14 October 2026 after reviewing the local case. Project
participation is 2018–2020; do not invent months or combine it with a later, separate consulting
engagement. Use the confirmed client-project role, Container Platform Consultant & DevOps Lead.
Give a brief overall account of deployment standardisation, technical guidance and project/team coordination
before the phase-specific examples. Business analysis for operations systems began in Phase 2
and became the main focus in Phase 3.
Phase 1 includes initial planning/design and a return near its end. Phases 2 and 3
were full-phase participation; Phase 3 mainly involved business analysis for operations systems
alongside consulting. Phase 4
coverage stays brief: early design only, without claims about its subsequent delivery.

Use “business analysis for operations systems” for this responsibility, as clarified by the author
on 17 October 2026. Use “business analyst for operations systems” when naming the role. Preserve
the existing `#phase3-baops` anchor for older links; its visible label uses the clarified wording.

The fixed-address solution concerned business application containers. Preserve collaboration
with the bank architect, Thoughtworks development lead and Red Hat consultant where stated.
Present supported work and results directly; internal presentations are evidence for the author,
not public references. Keep scenario-classification counts out of the public narrative. Distinguish
event completion from automatic repair and project capabilities from sole personal authorship.

Keep source documents, private analysis, internal names, topology, addresses and screenshots
outside this repository. The case uses authored prose and conceptual diagrams. Maintain the
homepage card, chronological directory entry and case breadcrumb together. This publication is
a portfolio update, not a client-platform deployment. Edit the public HTML and scoped `case.css`
directly; the historical local generator is not part of this site.

## Daimler case — published 17 October 2026

The author approved publication on 17 October 2026 after reviewing the local portfolio additions.
`/projects/automotive-devops/` has a canonical URL and is included in the homepage, directory and
changelog. The earlier five-case wording update was published separately in commit `f7af0f6`.

Use Daimler AG as the public client name; keep internal project identifiers and original files
private. The confirmed engagement is Nov 2020–May 2021, DevOps Team Lead as the client-facing
role within Thoughtworks employment. Lead with the overall credential, CI/CD and platform
support scope before selected technical examples.

The canonical account confirms gopass to HA Vault on OpenShift and password synchronisation
from over one hour to seconds for 200+ users. Describe that deployment’s workflow, not a
universal gopass limitation or an encryption benchmark. Do not merge a separate source’s user
population or onboarding timing into this result. GoCD Pipeline-as-Code and Nexus container
management are separately confirmed. The new HTML diagram summarises delivery responsibilities;
it is not an imported client topology or a claim of original diagram authorship.

Interim reports establish staged migrations and local pipeline-file validation. They also contain
ongoing backup/recovery investigations, access-control proposals and a future AWS move. Do not
promote those items into completed implementations or tested recovery outcomes. Preserve broad
confirmed responsibilities even where retained records cover only part of the engagement.
No raw files, original screenshots, commands, internal URLs or credential values belong here.

## ICBC consulting case — published 17 October 2026

The author confirms a Thoughtworks consulting engagement in Zhuhai lasting about three months.
Use 2021, supported by the retained materials; precise start/end months are not confirmed. The
chronological entry is between Authority Brands and Daimler, using the June/July working
material context without turning document dates into an exact employment period. Its route is
`/projects/banking-devops-consulting/`; the directory anchor is `#icbc`.

Present analysis, option comparison and advice in response to bank-defined problems. Concrete
examples include remaining manual delivery work, obtainable measures, cloned database baselines,
parallel migration histories and traffic-control options. Do not claim personal implementation of
all programme plans, metric collection, production canary rollouts or quantified improvements.
Bank-authored configuration and measurement plans are context. Generic presentations and the
cross-project architecture image are reference material, not ICBC delivery evidence. The diagram
is a newly written conceptual sequence. No client source attachments or private identifiers belong
in this repository. Preserve the separate CMB and Daimler experiences.

The author approved publication of this case and its directory/changelog entries on 17 October 2026.

## Shenzhen Rural Commercial Bank case — published 17 October 2026

The author confirmed a small Thoughtworks client engagement in 2023: two inspections and help
looking into two specific issues. The concise case lives at `/projects/banking-cms-consulting/`,
linked from directory anchor `#szrcb`. Do not infer precise months or a larger implementation role.
The inspection template describes the method; blank result fields are not completed check results.
The written responses cover more topics than the two recalled issues; do not identify two particular
symptoms as confirmed incidents or turn the document into nine delivered investigations.
Personally attributed training material supports prepared operations guidance, without establishing
a delivered workshop, platform build or recovery exercise. Keep old commands, internal addresses,
version inventory, topology and original files private. The author approved publication with the
ICBC and Daimler cases on 17 October 2026. Nimble was deferred at that time; its short directory entry was prepared on 20 October 2026 after new material and a candidate clarification.


## HPB pipeline deep dive and judgment — publication approved, 19 October 2026

The 19 October candidate account expands the HPB case with an implementation walkthrough at
`/designs/hpb-pipeline-migration/` and a separate engineering judgment page at
`/projects/government-health-delivery/decisions.html`. Keep the engagement page concise and retain
its broader Azure/AKS and developer-support scope. The technical page owns runner preparation,
script structure, the SIT sequence, environment differences and technical follow-ups. The judgment
page owns the answers about script responsibilities, environment constraints and delivery ownership.
Cross-link rather than copying whole answers. The homepage Technical deep dives card leads to the
walkthrough; `/engineering/#health-promotion-board` leads to the judgment page.

The confirmed model is one runner VM per SIT/UAT/PRD, management through VPN and a generic bastion
host, Ansible-managed host creation/software updates, users/permissions, NSG connectivity, registry
access and managed identity dependencies. Do not infer executor, runner tags, identity type or
roles, exact access rules, a named Bastion product or high availability. Restricted operations
remain executed by client support teams.

Each environment builds and deploys separately from the same release version's source because
cross-environment access is restricted. Do not describe immutable-artifact promotion or claim that
separate builds are the only possible response to restricted access. SIT deploys automatically;
UAT/PRD require manual confirmation. Do not name approver roles or GitLab approval features.
Migration work progressed through validated SIT/UAT before PRD.

The SIT sequence is PR creation → static code and dependency/vulnerability checks → application
package → image build → image scan → registry push → Helm chart creation → Helm deployment to
SIT AKS → application liveness/status checks → DAST. All stages passing is the stated deployment
success criterion. FOD provides SAST/DAST integration; other tools include SonarQube. Do not assign
all scanning to either product or invent commands, chart mechanics, tests, rollback or metrics.

The diagrams are semantic HTML and scoped CSS in `designs/hpb-pipeline-migration/design.css`.
Keep stage order readable on desktop and narrow screens. Environment arrows represent separate
use of release source, never cross-environment artifact transfer. No original client diagrams,
addresses, resource identifiers, code or private documents are copied into the site.

The judgment page has three considered answers drawn from confirmed experience. Each has a
clearly marked next challenge with its answer in preparation. The technical page has two concise
implementation clarifications, one proposed deployment-script design and four pending mechanism
questions. The 19 October follow-up confirms cross-environment Helm-script reuse and use of
HPB-provided image-scanning scripts. The new design answer separates shared deployment logic
from environment settings and reads credentials from GitLab CI/CD variables. Keep this as a
current proposal, not a claim about HPB’s original configuration or credential-loading mechanism. Do not supply retrospective implementation
details or answers to new challenges before the author works through and confirms them. A topic
being listed does not establish that its mechanism was implemented. No private interview notes or
interview-employer details belong in the public pages.

The author approved publication on 19 October 2026 after reviewing the local pages. Check the
HPB case, both new pages, homepage card, inquiry directory and changelog after Pages deployment.
The Codex activity snapshot and historical application documents are unchanged.

## Nimble directory entry — publication approved, 20 October 2026

The author supplied a retained AWS build note and confirmed work on a pipeline for the platform
itself, based on AWS CodePipeline and the client's requirements. The canonical profile records
Thoughtworks, DevOps Engineer and November–December 2019; the author now recalls about one month.
Keep both the existing time window and approximate duration. Australia offshore is the delivery
relationship, not proof of onsite employment.

Use a concise entry at `/experience/#nimble`, between CMB and Costa. The homepage keeps four
selected cases; only its full-directory count changes to nine. No standalone page is needed for
the current scope. Preserve the distinction between the confirmed CodePipeline contribution and
the retained note's S3/CodeBuild/S3 build recipe; do not add an unconfirmed build target, production
deployment, final run result, trigger, approval, test gate, permissions or metric.

Keep the private source and analysis outside this repository. Existing historical CVs and
application documents are unchanged. The author approved publication on 20 October 2026
after reviewing the local directory entry.


## Certificate gallery — publication approved, 21 October 2026

The author requested a dedicated `/certifications/` page. About links to it through
“View education & certifications”, replacing the earlier AI-example link in that section. Other
AI-practice links remain in place. Keep About immediately before Contact; the homepage
contains no certificate images, image preloads or gallery styles. The author approved publication
on 21 October 2026 after reviewing the local gallery, including the Master’s degree certificate.

Certificate cards and their scoped styles live in `certifications/index.html` and
`certifications/certificates.css`. The page reuses the shared header, footer and typography,
with a return link to `/#about`. It uses no JavaScript. The original homepage-card preview
was revised before publication; it is not a separate released feature.

Use a small WebP preview for each card, with `loading="lazy"`, `decoding="async"` and its real
width and height. The fixed preview area reserves space and uses `object-fit: contain` to
preserve the entire image. Each card links to a separate, larger WebP in a new tab; full images
are not embedded or preloaded. Native links work without JavaScript. Do not add a gallery
library or original PDFs. The three previews total 69,354 bytes; the separate larger
images are 66,624, 133,128 and 70,472 bytes. These are file sizes, not measured transfer times.

To add a certificate, duplicate one `article.certificate-card`, update both image paths,
alt text, intrinsic dimensions, title, issuer and earned year. Keep previews around 720 pixels
wide and aim below 50 KB per preview where legibility allows. Export without embedded metadata.
Cards use two columns on desktop and one on narrow screens. Future cards stay on this page, so the homepage does not grow as the collection expands.

The CKA image was rendered from the author's certificate PDF; the OCP image comes from the
existing certificate photograph. Both are resized/encoded derivatives with no content retouching.
CKA is a historical credential earned in 2019, expired in April 2022; use earned-year wording,
not a claim of current certification. Preserve the original documents outside this repository.
Changelog notes describe the gallery feature, not author biography or certification milestones.

The gallery is titled **Education & certifications** and places the Master's degree first,
followed by CKA and OCP. Card labels distinguish academic degrees from professional
certifications. The Master of Software Engineering was conferred by Yoobee Colleges on
27 July 2026 (NZQF Level 9). Its public raster derivatives hide the personal student identifier;
the original document is unchanged. Only the WebP derivatives belong in this repository,
not the PDF or its intermediate rendering copy. The local career-document archive already
holds the identical original and indexes the degree, so no duplicate archive copy was added.


## Changelog browsing — 23 October 2026

Keep all update text as readable, newest-first `article.changelog-entry` elements in
`changelog/index.html`. Each entry needs a unique stable ID and an ISO `time[datetime]` date.
Do not create a second JSON content store or duplicate the archive into monthly HTML files.

The optional, deferred `changelog/changelog.js` derives month and year choices, calendar counts
and eight-entry pages from those articles. The default view is the newest recorded month.
Choosing a calendar day filters its updates; a control restores the full month. Month/day/page
state is encoded in query parameters. Existing entry and entry-title hashes reveal the relevant
month and page, including on initial load and browser Back/Forward navigation.

The compact heatmap counts changelog records, not commits, deployments or engineering effort.
It has no summary cards. Tooltips and accessible labels retain the dates and counts;
selecting a day shows its date beside the results. It shows months from the selected year's first
recorded month to its last, including empty months between them. Additional months scroll
horizontally. Keep the title, heatmap and month toolbar compact so the newest entry is visible
in the first desktop viewport. Pagination and the historical archive note sit below the entries.
Use ISO dates as authored Auckland calendar dates; UTC is only a stable way to calculate weekdays,
not a conversion of the record's timezone.

Scoped `changelog/changelog.css` explicitly hides filtered articles, preserves visible keyboard
focus and reveals the complete archive for print. Without JavaScript, all articles remain
visible. Shared CSS, the homepage and the Codex activity snapshot are unchanged. Check filters,
pagination, old hashes, history navigation, narrow-screen layout and the new entry's self-count
before publishing. The compact layout was approved for publication on 23 October 2026.


## Homepage traffic counter — Cloudflare, 26 October 2026

The homepage uses a dedicated Cloudflare Worker and D1 database on the Workers Free plan.
The author authorised this counter deployment separately from the local homepage layout drafts.
Publish counter changes from an isolated checkout; do not include unreviewed reading-path changes.

The client remains a small footer detail and starts after the page load event. A four-second
request deadline, no automatic retries and timestamped cached counts keep statistics independent
of homepage loading. Views count homepage loads; visitors estimate distinct browsers using a
stored random identifier. Local previews cannot call the production counter.

Implementation, counting definitions, local tests, preview commands and deployment maintenance
are in [`services/homepage-counter/README.md`](services/homepage-counter/README.md).
Use `npm run preview` there for a working local counter. Its **Local test data** label distinguishes
preview figures from public totals. Public totals start on 26 October 2026. No local test data or
unverified historical Busuanzi figures were imported.

## Certificate gallery expansion — 26 October 2026

The author supplied a HashiCorp Terraform Associate (004) certificate and approved publication.
The certificate names Xiang Zhu and expires on 24 October 2028. The public Credly record
verifies issuance on 24 October 2026 and acceptance on 26 October 2026. Use the official
record for the issue date; the download filename is not an issue-date source.

The degree remains first, followed by Terraform, CKA and OCP. Use a two-column desktop grid
and a single column below 760 pixels. The Terraform card has the stable anchor
`/certifications/#terraform-associate`. Its preview is 720 × 556 pixels; the linked full image
is 1800 × 1391 pixels. Both WebP images preserve the certificate's content and contain no
embedded source metadata. Keep the original PDF in the private career-document archive.
The homepage continues to link to the gallery without loading its certificate images.

The Terraform card pairs the certificate thumbnail with the unaltered official badge artwork.
The locally resized badge is 480 × 480 pixels; no Credly embed script or iframe is loaded.
Both the badge image and “Verify on Credly” link open the verified public record:
https://www.credly.com/badges/62305abb-76b0-4a8c-b07e-e0bd92ec154a/public_url
The supplied `/earner/earned/badge/` URL requires sign-in and is not the public verification link.
Credly lists IBM Professional Certification as issuer; the certificate and badge use the
HashiCorp certification name. The original badge image is archived privately with the PDF.
