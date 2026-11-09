# Xiang Zhu — engineering portfolio

Source for [jothep.github.io](https://jothep.github.io/): a static personal site with enterprise
case studies, engineering decisions, technical deep dives and recent projects in cloud
infrastructure, delivery and AI-assisted engineering.

## Pages

| Path | Content |
| --- | --- |
| `/` | Introduction, selected enterprise experience, engineering questions, projects, How I work with AI, deep dives, writing, About and Contact |
| `/experience/` | All enterprise engagements, newest first, with links to detailed cases |
| `/projects/*/` | Enterprise case studies, Story Filler and the AI knowledge-base capstone |
| `/projects/*/decisions.html` | Engineering judgment pages: questions, considered answers and follow-ups |
| `/designs/*/` | Technical deep dives: the HPB pipeline migration and an AWS cross-Region DR design |
| `/engineering/` | Directory of engineering judgment discussions |
| `/certifications/` | Degree and professional certificates |
| `/changelog/` | Dated portfolio updates |

The Story Filler application at `/story-filler/` is published from its own repository,
[`jothep/story-filler`](https://github.com/jothep/story-filler).

## How it is built

Plain HTML, CSS and a little JavaScript, with no framework and no build step. Pages use the
reader's system fonts. Shared styles live in `assets/site.css` and optional interaction in
`assets/site.js`; pages with their own layout keep scoped CSS beside them. Without JavaScript,
all content and diagrams remain readable.

| File or directory | Purpose |
| --- | --- |
| `index.html` | Homepage |
| `experience/`, `projects/`, `designs/`, `engineering/` | Content pages |
| `certifications/`, `changelog/` | Certificate gallery; dated updates with month filtering |
| `assets/` | Shared CSS/JS, images, the public CV and the social preview image |
| `assets/evidence/` | Published, dated evidence with its own methodology notes |
| `scripts/` | Optional evidence and activity generators; not needed to serve the site |
| `services/homepage-counter/` | Cloudflare Worker for the homepage view counter ([README](services/homepage-counter/README.md)) |
| `tests/` | Node tests for the counter client |

## Preview locally

From the repository root:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8080/`. No install is needed. Run the counter-client tests with:

```sh
node --test tests/homepage-traffic.test.cjs
```

Formatting uses the checked-in Prettier settings (`htmlWhitespaceSensitivity: "css"`):

```sh
npx prettier@3.6.2 --write "**/*.{html,css,js}"
```

## Publish

GitHub Pages publishes `main` from the repository root; `.nojekyll` keeps files static. Push
reviewed changes to `main`, wait for the Pages deployment, then check the changed pages on the
live site. User-visible changes get a dated entry at the top of `changelog/index.html`.
