# Xiang Zhu — personal engineering portfolio

A small static personal site, with Māori Story Filler as the first detailed case study.

## Pages

- `/`: professional introduction and selected work.
- `/projects/story-filler/`: context, architecture, decisions, local platform practice, delivery, AI-assisted engineering and dated evidence.

The older `Portfolio/` directory is retained. Its existing local font assets are reused by the new pages; the original license files remain in place. The new homepage does not repeat unverified claims from that earlier template.

## Preview

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. No package install or build is required. The architecture view supports mouse and keyboard tabs. Without JavaScript, all diagrams remain readable.

## Publish with GitHub Pages

This repository is the account's user site, `jothep.github.io`. Settings → Pages is configured to publish `main` from `/ (root)`. An empty `.nojekyll` file keeps these HTML/CSS/JS files static. Push reviewed changes to `main`, check the Pages deployment result, then verify both `/` and `/projects/story-filler/` on the public site. The existing application at `/maori-story-fill/` is published independently by its project repository.

## Content and evidence

The Story Filler case reflects the project review and application release checks on 27 September 2026. Its screenshot shows the actual public application, captured on 28 September 2026. A displayed screenshot is not a full gameplay test.

Canonical engineering sources live in the separate `maori-story-fill` repository: `docs/engineering-case-study.md`, `docs/local-platform-lab.md`, `docs/architecture-production-gcp.md`, and `docs/verification.md`. The application repository remains private while retained historical sensitive objects are addressed. Until then, source and original Actions run links are explicitly labelled as requiring repository access.

When updating claims, distinguish implemented configuration, dated deployment verification, and future work. Do not infer current uptime, billing, security guarantees, original design intent, or personal authorship from the existence of code. The AI-assisted example describes the September 2026 follow-up review; it does not invent an AI development history for the original application.

## Adding later work

Add another selected-work entry only when its context, personal contribution, decisions and evidence are ready. Keep detailed case pages under `projects/<slug>/`. The current site deliberately has one complete project rather than placeholder entries.

Do not copy application credentials, environment files, Terraform state, private archives or the application's Git history into this repository.
