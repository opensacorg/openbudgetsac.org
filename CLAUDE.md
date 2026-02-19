# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open Budget Sacramento is a fiscal transparency and data visualization web app for the City of Sacramento. It presents budget data through interactive Sankey flow diagrams and D3 treemap visualizations.

## Development Commands

All commands are run from `_src/`:

```bash
# Install dependencies
npm install --force   # --force is required

# Start Eleventy dev server (localhost:8011)
npm run serve

# Bundle React Compare app (run separately from Eleventy)
npm run watch         # watch mode during development
npm run build         # one-time build

# Compile SCSS (run after editing any SASS files)
npm run build-css
```

Docker alternative (from repo root):
```bash
docker compose up --build
```

The dev workflow requires **two concurrent processes**: `npm run serve` (Eleventy) and `npm run watch` (Webpack for the React Compare app).

> Note: Last confirmed working Node version is v15.14.0. CI/CD uses Node 16.x.

## Architecture

### Build Pipeline

- **Eleventy** (`_src/.eleventy.js`) compiles Pug templates from `_src/` to `../build/` and copies assets (styles, js, data, images) through as-is
- **Webpack** bundles `_src/js/compare/index.jsx` → `_src/js/dist/compare.bundle.js` for the React Compare page
- **Dart Sass** compiles `_src/css/main.scss` → `_src/styles/main.css`
- GitHub Actions (`deploy.yml`) runs the full build and deploys to GitHub Pages (gh-pages branch)

### Page Types

1. **Static pages** — Pug templates (`.pug`) in `_src/`
2. **Flow pages** — Sankey/cash-flow diagrams driven by `_src/data/flow/FY*.csv`; use `partials/flowScripts.pug` and `_src/js/flow.js` / `sankey.js`
3. **Treemap pages** — D3 drill-down driven by `_src/data/tree/Approved.{Expense,Revenue}.FY*.json`; use `partials/treeScripts.pug` and `_src/js/budget-treemap.js`
4. **Compare page** (`compare.pug`) — React SPA in `_src/js/compare/`, bundled by Webpack, data from `_src/data/compare/`
5. **Legacy pages** — `.jade` files for historical budget cycles (2013–2021); do not modify

### Data Pipeline

Budget data flows: **CSV source → Python scripts → JSON → frontend visualizations**

- `_treemap/` contains Python scripts (`treemap_process_data_py3.py`, `compare_process_data.py`) that transform raw CSV budget exports into the JSON format consumed by the treemap visualizations
- Flow data stays as CSV; the frontend `flow.js` reads it directly
- Fiscal year data coverage: flow FY13–FY25, treemap FY13–FY24

### Key Directories

| Path | Purpose |
|------|---------|
| `_src/` | All source files; the primary development directory |
| `_src/js/compare/` | React Compare app (JSX components) |
| `_src/data/tree/` | Pre-processed treemap JSON by fiscal year |
| `_src/data/flow/` | Cash flow CSV files by fiscal year |
| `_src/css/` | SCSS source (entry: `main.scss`) |
| `_src/partials/` | Reusable Pug template partials |
| `_treemap/` | Python data processing scripts |
| `build/` | Eleventy output (git-ignored) |

## Adding New Fiscal Year Data

- **Flow page**: Add `FY{YY}.csv` to `_src/data/flow/`, create a new Pug page using `adopted-budget-flow.pug` as a template
- **Treemap page**: Run Python scripts in `_treemap/` to generate JSON, add output to `_src/data/tree/`, create a new Pug page using `adopted-budget-tree.pug` as a template
- **Compare data**: Run `compare_process_data.py` to generate the per-year expense/revenue JSON files in `_src/data/compare/`

## No Test Suite

There is no automated test framework in this project.
