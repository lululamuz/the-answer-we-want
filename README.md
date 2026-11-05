# The Answer People Wanted

Project #5 — Digital Divination · Advanced Critical Computation 2026 (Parsons)

## Folder structure

```
the-answer-we-want/
├── index.html            Overview page with links
├── proposal/
│   └── proposal.pdf      Project proposal
├── prototype/            White-boxed prototype
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── data.json
└── final/                The final version goes here later
```

## How the code works

1. `fetch("data.json")` loads the data file. Each category has a list of `keywords` and three lists of responses: `positive`, `ambiguous`, `negative`.
2. When "Ask the oracle" is clicked, `askOracle()` reads the question and makes it lowercase.
3. `findCategory()` uses `if / else` to check the question against Love, then Career, then Decisions keywords. If no keyword is found, the category is General.
4. `pickRandom()` uses `Math.random()` to choose a tone, then a response from that tone.
5. After 1.5 seconds (`setTimeout`), the answer appears.
6. `reflect()` shows a follow-up line for Yes / No / I'm not sure.
7. The white-box view at the bottom shows the detected category and the selected response.

## Testing locally

Opening `index.html` by double-clicking will not load `data.json`, so run a local server:

```
cd the-answer-we-want
python3 -m http.server 8000
```

Then open http://localhost:8000/prototype/ (or use VS Code's Live Server).

## Deploying to GitHub Pages

1. Create a public repository, e.g. `the-answer-we-want`.
2. Upload the contents of this folder so `index.html` is at the top level.
3. Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
4. After a minute the site is at `https://<username>.github.io/the-answer-we-want/`, and the prototype at `.../prototype/`.
