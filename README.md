# Xiang Zhu — personal engineering portfolio

A small static personal site with engineering case studies covering infrastructure, delivery and AI knowledge-base generation.

## Pages

- `/`: professional introduction, selected work, Codex activity and published writing.
- `/changelog/`: dated portfolio updates, including earlier milestones reconstructed from website commits.
- `/projects/story-filler/`: context, architecture, decisions, local platform practice, delivery, AI-assisted engineering and dated evidence.
- `/projects/story-filler/decisions.html`: an engineering-judgment retrospective, with edited author answers and linked implementation evidence.
- `/projects/ai-knowledge-base/`: the MSE907 capstone, with implemented architecture, decisions, checked score comparisons, an original synthetic example and explicit evidence limits.

The maintained site uses its own HTML pages and shared CSS and JavaScript in `assets/`. It does not load an older website template. Two third-party fonts, HK Grotesk and Jost, are bundled in `assets/fonts/` with their copyright notices and SIL OFL licenses; see [font sources and licenses](assets/fonts/README.md).

## Preview

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. No package install or build is required. The architecture view supports mouse and keyboard tabs. Without JavaScript, all diagrams remain readable.

## Publish with GitHub Pages

This repository is the account's user site, `jothep.github.io`. Settings → Pages is configured to publish `main` from `/ (root)`. An empty `.nojekyll` file keeps these HTML/CSS/JS files static. Push reviewed changes to `main`, check the Pages deployment result, then verify `/`, `/projects/story-filler/`, `/projects/ai-knowledge-base/` and `/changelog/` on the public site. The application at `/story-filler/` is published independently by its project repository.

## Content and evidence

The Story Filler case reflects the project review and application release checks on 27–28 September 2026. Its screenshot shows the actual public application, captured on 28 September 2026. A displayed screenshot is not a full gameplay test.

Canonical engineering sources live in the separate public [`jothep/story-filler`](https://github.com/jothep/story-filler) repository: `docs/engineering-case-study.md`, `docs/local-platform-lab.md`, `docs/architecture-production-gcp.md`, and `docs/verification.md`. The original repository remains private. Public aggregate snapshots preserve its historical delivery record; the new repository has its own public release records.

When updating claims, distinguish implemented configuration, dated deployment verification, and future work. Do not infer current uptime, billing, security guarantees, original design intent, or personal authorship from the existence of code. The AI-assisted example describes the September 2026 follow-up review; it does not invent an AI development history for the original application.

## Adding later work

Keep the homepage closing order fixed: **About the author**, then **Get in touch**. Insert future project, activity or writing sections above About. Preserve the `about` section ID and the header About link to `#about`.

Add another selected-work entry only when its context, personal contribution, decisions and evidence are ready. Keep detailed case pages under `projects/<slug>/`. Each selected project needs a complete, reviewable case study rather than a placeholder entry.

Do not copy application credentials, environment files, Terraform state, private archives or the application's Git history into this repository.

## Maintaining the changelog

For a user-visible website change, add an entry at the top of `changelog/index.html` in the same update. Use the actual change date in Pacific/Auckland, a stable descriptive anchor, a short title, and specific Added, Improved, Updated or Corrected notes. Keep only the newest entry’s Latest badge and maintain the date-navigation links as new months are added.

Link to the affected page or evidence. Historical entries can cite the relevant website commit or comparison; do not invent version tags, release dates or application features. The log describes portfolio features, project content and technical changes. Do not include author biographies, career details or profile-information updates. Adding project documentation is not an application deployment, and article publication dates are separate from the dates articles were linked here. The initial September entries were backfilled on 2 October 2026 from Git history.

Check the homepage button, entry anchors, relative links and mobile layout before publishing. Activity statistics remain a dated snapshot unless a separate, authorised refresh is performed.

## Capstone evidence and publication boundary

The AI knowledge-base page is a retrospective review of retained capstone artefacts. Its Run 08 and Run 09 scores were recalculated on 2 October 2026 without running model inference. The homepage activity snapshot is a separate artefact and was not refreshed.

The capstone publication includes only the authored case page, original diagrams and synthetic example, the score-only export, generated figures, calculation script and evidence notes. Do not copy raw issue/PR data, generated articles, judge explanations, model caches, credentials, reports, slides, submission archives, academic identity fields or private filesystem paths into this site.

Keep interpretation bounded: LLM-judge scores are not objective accuracy percentages; the two runs use different evaluation settings; Run 09 did not show statistically significant benefit or degradation. The inspected implementation has two LLM roles and a deterministic finalisation node. Blind evaluation, ROUGE-L, human review and production deployment are not verified claims.

The local preview was approved for publication on 2 October 2026. Keep the underlying research and evidence-review dates separate from later website updates. Future changes should preserve the same publication boundary and record material changes in the changelog.

## Editing the site directly

The HTML files are the content source. Edit paragraphs and links in place, using semantic sections and two-space indentation. Shared presentation lives in `assets/site.css`; optional interaction lives in `assets/site.js`. No build step is required. Keep only maintained pages, their required assets, supporting evidence and development configuration in this repository. Do not add old resumes, retired templates or operating-system metadata files.

For routine edits, use this file map:

| File or directory | Purpose |
| --- | --- |
| `index.html` | Homepage content and the dated activity snapshot |
| `projects/*/index.html` | Detailed case-study content |
| `projects/story-filler/decisions.html` | Questions addressed to the author, answers and AI review notes |
| `changelog/index.html` | Dated website changes |
| `assets/site.css` | Shared visual styles, grouped by section comments |
| `assets/site.js` | Architecture tabs, compact contents menu and section highlighting |
| `scripts/` | Optional evidence and activity generators; not required to serve the site |
| `assets/evidence/` | Published, dated evidence; do not regenerate it as part of formatting |
| `assets/fonts/` | Locally hosted third-party fonts, copyright notices and full font licenses |

Use the checked-in Prettier settings for HTML, CSS and JavaScript. Formatting is an optional authoring tool, not a publishing dependency:

```sh
npx prettier@3.6.2 --write "**/*.{html,css,js}"
```

Use `htmlWhitespaceSensitivity: "css"` so formatting preserves spaces around inline text. Keep punctuation directly beside an inline closing tag, for example `</a>.` or `</code>;`. For a long-link paragraph that Prettier would split into hard-to-read tags, use a local `<!-- prettier-ignore -->` comment and keep that paragraph neatly indented by hand. Do not switch to global whitespace-insensitive HTML formatting.

The activity generator also emits indented, multi-line HTML and preserves the surrounding page indentation when replacing its marked block. A formatting pass must not refresh the dated activity snapshot or read private activity records.

Keep CSS declarations on separate lines and add brief comments for major page sections. After formatting shared files, check the homepage, both case studies, the engineering-decisions page and the changelog in a browser. Confirm narrow layouts, anchor links and architecture tabs still work.

### Editing engineering answers

Present the author's considered answers after discussion. Integrate small corrections, missing context and explanations the author has understood into those answers; the public page does not need to catalogue every initial misconception. Preserve useful follow-up questions that test the decision. The purpose is to make the author's reasoning clear and credible.

Keep substantive technical extensions separate when they go beyond the author's answer or understanding, and obtain the author's review before adding them. Consolidation must not turn a design proposal into an implemented feature, a suggested check into a completed test, or a current understanding into a claim of past experience. Use compact implementation notes for those distinctions.

Write every question and follow-up as a reviewer addressing the author with "you" or "your". Keep the author's answers in the first person and label AI review separately. Do not present the exchange as an interview with real experts. Use question titles without job-role labels. Keep planned Go or Operator work out of the current case study until there is work to present. Distinguish the date of a retrospective/source review from the dates of deployment evidence, and do not imply that a historical forecast was recorded at the time unless it was.
