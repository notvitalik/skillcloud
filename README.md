# Skill Cloud Generator

A lightweight, offline-capable skill word cloud builder that runs directly in your browser—no frameworks or build steps required.

## Features
- Start with sample skills and experience levels
- Add or delete rows (up to 10, with at least one remaining)
- Inline validation that keeps “Generate Cloud” disabled until every row is valid
- Deterministic SVG word cloud layout (golden-angle radial pattern)
- Responsive rendering that reflows on resize with debouncing
- Export the cloud as SVG or PNG
- Works when opened via `file://` or any static server

## Getting Started
1. Open `index.html` in your browser (double-click or drag into a tab). No server is necessary.
2. Edit the Skill and Experience values. Experience must be an integer `>= 0`.
3. Use **+ Add row** to add skills (up to 10). Delete rows as needed, but at least one row always remains.
4. When all rows are valid, click **Generate Cloud** to view the SVG word cloud.
5. Use **Back** to return to inputs without losing data.

## Exports
- **Export SVG** downloads `skill-cloud.svg` of the current layout.
- **Export PNG** rasterizes the SVG to a canvas and downloads `skill-cloud.png`.

## Development Notes
- Built with plain HTML, CSS, and vanilla JavaScript—no external libraries.
- The layout places words around the center using a golden-angle spiral, scaling font sizes based on experience.
- Cloud re-renders on window resize with a 150ms debounce for stability.
