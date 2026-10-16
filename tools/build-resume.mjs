// Builds assets/Dinesh-Kumar-Resume.pdf from js/data.js, so the resume always
// matches the site. Needs Playwright: npm i -D playwright && npx playwright install chromium
// Run: node tools/build-resume.mjs
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = new URL("..", import.meta.url).pathname;
const ctx = { window: {} };
vm.runInNewContext(readFileSync(root + "js/data.js", "utf8"), ctx);
const S = ctx.window.SITE;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sf3 = (x) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const short = (v) => (v >= 1e7 ? `₹${sf3(v / 1e7)} Cr` : `₹${sf3(v / 1e5)} L`);
const total = S.projects.reduce((a, p) => a + p.boq.total, 0);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<style>
  @page { size: A4; margin: 10mm 12mm 9mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Geist, system-ui, sans-serif; color: #14191D; font-size: 8.5pt; line-height: 1.38; }
  .mono, h2, th, .k { font-family: "Geist Mono", ui-monospace, monospace; font-size: 7pt; letter-spacing: .08em; text-transform: uppercase; font-weight: 400; }
  .muted { color: #5B6670; }
  header { border-bottom: 1px solid #14191D; padding-bottom: 10px; display: grid; grid-template-columns: 1fr auto; gap: 8px 24px; align-items: end; }
  h1 { font-size: 22pt; font-weight: 500; letter-spacing: -.03em; line-height: 1; }
  .title { margin-top: 6px; font-size: 10.5pt; font-weight: 500; }
  .tag { margin-top: 2px; }
  .contact { text-align: right; line-height: 1.7; }
  .contact a { color: inherit; text-decoration: none; }
  section { margin-top: 10px; }
  h2 { color: #5B6670; padding-bottom: 5px; border-bottom: 1px solid rgba(20,25,29,.16); margin-bottom: 8px; display: flex; gap: 10px; }
  h2 b { color: #14191D; font-weight: 400; }
  .stats { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 1px solid #14191D; border-bottom: 1px solid rgba(20,25,29,.16); }
  .stats div { padding: 7px 8px 7px 0; }
  .stats div + div { padding-left: 8px; border-left: 1px solid rgba(20,25,29,.16); }
  .stats strong { display: block; font-size: 13pt; font-weight: 500; letter-spacing: -.02em; line-height: 1.1; }
  .stats span { font-family: "Geist Mono", monospace; font-size: 6.2pt; letter-spacing: .06em; text-transform: uppercase; color: #5B6670; }
  p + p { margin-top: 5px; }
  .role { display: grid; grid-template-columns: 34mm 1fr; gap: 12px; padding: 4px 0 5px; }
  .role + .role { border-top: 1px solid rgba(20,25,29,.16); }
  .role h3 { font-size: 10.5pt; font-weight: 500; }
  .role ul { margin-top: 3px; padding-left: 12px; }
  .role li { margin-top: 0; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; color: #5B6670; padding: 4px 8px 4px 0; border-bottom: 1px solid #14191D; }
  td { padding: 3px 8px 3px 0; border-bottom: 1px solid rgba(20,25,29,.16); vertical-align: top; }
  .num { text-align: right; white-space: nowrap; font-family: "Geist Mono", monospace; font-size: 8pt; }
  tfoot td { border-bottom: 0; border-top: 1px solid #14191D; }
  .skills div { display: grid; grid-template-columns: 34mm 1fr; gap: 12px; padding: 2.5px 0; border-bottom: 1px solid rgba(20,25,29,.16); }
  .skills .k { padding-top: 2px; color: #5B6670; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .block { break-inside: avoid; }
</style></head><body>
<header>
  <div>
    <h1>${esc(S.person.name)}</h1>
    <p class="title">${esc(S.person.title)}</p>
    <p class="tag mono muted">${esc(S.hero.line)}</p>
  </div>
  <div class="contact mono">
    <div>${esc(S.person.location)}</div>
    <div><a href="tel:${esc(S.links.phoneHref.replace("tel:", ""))}">${esc(S.links.phone)}</a></div>
    <div><a href="mailto:${esc(S.links.email)}">${esc(S.links.email)}</a></div>
    <div><a href="${esc(S.site.url)}">${esc(S.site.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</a></div>
  </div>
</header>

<section class="stats">${S.stats.map((s) => `<div><strong>${esc(s.prefix || "")}${s.value}${esc(s.suffix)}</strong><span>${esc(s.label)}</span></div>`).join("")}</section>

<section class="block"><h2><b>01</b> Profile</h2>${S.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}</section>

<section><h2><b>02</b> Experience</h2>
${S.experience.map((r) => `<div class="role block"><div><div class="mono">${esc(r.dates)}</div><div class="mono muted" style="margin-top:3px">${esc(r.company)}</div></div>
<div><h3>${esc(r.role)}</h3><ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>`).join("")}
</section>

<section class="block"><h2><b>03</b> Featured projects · BOQ values excl. GST · client names withheld</h2>
<table><thead><tr><th>Project</th><th>Type</th><th class="num">Trades</th><th class="num">BOQ value</th></tr></thead>
<tbody>${S.projects.map((p) => `<tr><td>${esc(p.name)}</td><td class="muted">${esc(p.type)}</td><td class="num">${p.trades.length}</td><td class="num">${short(p.boq.total)}</td></tr>`).join("")}</tbody>
<tfoot><tr><td colspan="3" class="mono">Total, ${S.projects.length} projects</td><td class="num">${short(total)}</td></tr></tfoot></table>
</section>

<section class="block"><h2><b>04</b> Toolkit</h2><div class="skills">
${S.skills.map(([k, v]) => `<div><span class="k">${esc(k)}</span><span>${esc(v)}</span></div>`).join("")}
</div></section>

<section class="two block">
  <div><h2><b>05</b> Education</h2><p><strong style="font-weight:500">${esc(S.education.degree)}</strong></p><p>${esc(S.education.school)} · ${esc(S.education.years)}</p></div>
  <div><h2><b>06</b> Languages</h2><p>${S.languages.map(([l, v]) => `${esc(l)} <span class="muted">(${esc(v)})</span>`).join(" · ")}</p></div>
</section>

</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: root + S.links.resume, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("wrote " + S.links.resume);
