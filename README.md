# Dinesh Kumar · Senior Estimator portfolio

Static site (HTML, CSS, vanilla JS). No build step. Deploys as-is on Vercel.

## Where things live

| Path | What |
|---|---|
| `js/data.js` | **All content**: identity, links, stats, projects, trades, BOM, process, experience, toolkit. The TODO list is at the top. |
| `js/estimate.js` | Rupee formatting, BOQ total checks, trade-wise bar chart, BOM table, the three layer plates (Drawing → BOM → BOQ), revision timeline |
| `js/home.js` | Home page rendering and scroll scenes |
| `js/case.js` | Case-study template (one per project) |
| `js/common.js` | Header, menus, footer, smooth scroll, page transitions, helpers |
| `css/style.css`, `css/case.css` | Styles ("architectural drawing sheet" theme) |
| `case-studies/*.html` | Generated shells, one per project |
| `assets/projects/<slug>/` | Drawing crops, layer plates and blurred BOQ summary sheets |
| `assets/frames/` | Hero scroll animation (240 desktop / 120 mobile frames) |

## Editing

1. Change content in `js/data.js` only.
2. Unfinished items are written as `[TODO: …]`. While `showTodos: true` they show as dashed TODO chips; set it to `false` to hide them all on the live site.
3. Check the numbers and list what's left:

   ```sh
   node tools/verify.mjs   # trades sum to each BOQ total, GST/net, value order, every ₹ figure in the copy
   node tools/todos.mjs    # every remaining TODO with its line number
   ```

4. If you add, remove or rename a project, regenerate the case-study pages:

   ```sh
   node tools/build-case-pages.mjs
   ```

The page also re-checks every BOQ total in the browser console on load.

## Run locally

```sh
npx http-server -p 8080 -c-1 .
# open http://localhost:8080
```

## Deploy on Vercel

1. Push this repo to GitHub (branch `main`).
2. On vercel.com: **Add New → Project → Import** this repository.
3. Framework preset: **Other**. Build command: *empty*. Output directory: `.` (root). Install command: *empty*.
4. **Deploy**. Every push to `main` redeploys.
5. Copy the production domain into `site.url` in `js/data.js`, and into the `og:url`, `og:image`, `twitter:image` and `canonical` tags in `index.html`, then run `node tools/build-case-pages.mjs` and push.
