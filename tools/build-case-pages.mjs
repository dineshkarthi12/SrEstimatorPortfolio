// Writes case-studies/<slug>.html for every project in js/data.js.
// Run after adding, removing or renaming a project: node tools/build-case-pages.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url).pathname;
const ctx = { window: {} };
vm.runInNewContext(readFileSync(root + "js/data.js", "utf8"), ctx);
const S = ctx.window.SITE;
const V = "20261016a";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = (s) => String(s).replace(/\[TODO:[^\]]*\]/g, "").replace(/\s{2,}/g, " ").trim();
const short = (v) => v >= 1e7 ? `₹${(v / 1e7).toPrecision(3)} Cr` : `₹${(v / 1e5).toPrecision(3)} L`;
const base = S.site.url.replace(/\s*\/\/.*$/, "");

mkdirSync(root + "case-studies", { recursive: true });
for (const p of S.projects) {
  const title = `${p.name} · BOQ case study · ${S.person.name}`;
  const desc = `${short(p.boq.total)} BOQ (excl. GST) across ${p.trades.length} trades: ${strip(p.challenge[0])}`;
  const url = `${base}case-studies/${p.slug}.html`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="theme-color" content="#E9E6E0">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${esc(url)}">

  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${esc(S.person.name)} · Senior Estimator">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${esc(base)}assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${esc(base)}assets/og-image.jpg">

  <script>document.documentElement.classList.add(matchMedia("(prefers-reduced-motion: reduce)").matches ? "static" : "motion");try{if(sessionStorage.getItem("dk-pt")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("pt-in")}catch(e){}</script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="../css/style.css?v=${V}">
  <link rel="stylesheet" href="../css/case.css?v=${V}">

  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
  <script defer src="../js/data.js?v=${V}"></script>
  <script defer src="../js/common.js?v=${V}"></script>
  <script defer src="../js/estimate.js?v=${V}"></script>
  <script defer src="../js/case.js?v=${V}"></script>
</head>
<body data-page="case" data-root="../" data-project="${p.slug}">
  <main id="main"></main>

  <noscript>
    <div class="noscript">
      <h1 class="display" style="font-size:3rem">${esc(p.name)}</h1>
      <p>${esc(desc)} This page needs JavaScript to show the case study.</p>
      <p><a href="../index.html">Back to the portfolio</a> · <a href="mailto:${esc(S.links.email)}">${esc(S.links.email)}</a></p>
    </div>
  </noscript>
</body>
</html>
`;
  writeFileSync(root + `case-studies/${p.slug}.html`, html);
  console.log("wrote case-studies/" + p.slug + ".html");
}
