// Writes the rendered content into index.html and case-studies/*.html, so the
// pages read correctly before (or without) JavaScript: slow networks, link
// previews, search engines. The scripts still render the same content on load.
//
// Needs Playwright (npm i -D playwright && npx playwright install chromium).
// Run after any change to js/data.js:  node tools/prerender.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = new URL("..", import.meta.url).pathname;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".pdf": "application/pdf" };
const server = createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = readFileSync(join(root, path.endsWith("/") ? path + "index.html" : path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const base = `http://localhost:${server.address().port}/`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fill = (src, name, html) => {
  const re = new RegExp(`(<!--pr:${name}-->)[\\s\\S]*?(<!--/pr-->)`);
  if (!re.test(src)) throw new Error(`marker ${name} missing`);
  return src.replace(re, (m, a, b) => a + html + b);
};

const browser = await chromium.launch();
// Render the still version: no animation libraries, no fonts, no motion.
const context = await browser.newContext({ reducedMotion: "reduce" });
await context.route(/^https?:\/\/(?!localhost)/, (r) => r.abort());

async function rendered(path, read, arg) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + path, { waitUntil: "load" });
  await page.waitForTimeout(300);
  if (errors.length) throw new Error(`${path}: ${errors.join("; ")}`);
  const out = await page.evaluate(read, arg);
  await page.close();
  return out;
}

// Home page
const HOME = {
  stats: ".hero__stats", story: ".about__story", spec: ".spec", work: ".work__scenes", process: ".process__track",
  roles: ".timeline__roles", toolkit: ".toolkit__list", creds: ".creds", contact: ".contact__rows"
};
const home = await rendered("index.html", (sel) => {
  const parts = Object.fromEntries(Object.entries(sel).map(([k, s]) => [k, document.querySelector(s).innerHTML]));
  const SITE = window.SITE;
  const binds = {};
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const k = el.dataset.bind;
    binds[k] = k.split(".").reduce((o, x) => (o ? o[x] : undefined), SITE);
  });
  return { parts, binds, resume: SITE.links.resume };
}, HOME);
let src = readFileSync(root + "index.html", "utf8");
for (const [k, html] of Object.entries(home.parts)) src = fill(src, k, html.trim());
src = src.replace(/(<[^<>]*\bdata-bind="([\w.]+)"[^<>]*>)[^<]*(<\/)/g, (m, open, key, close) => open + esc(home.binds[key] ?? "") + close);
src = src.replace(/(<a\b[^>]*\bjs-resume\b[^>]*\bhref=")[^"]*(")/g, (m, a, b) => a + esc(home.resume) + b);
writeFileSync(root + "index.html", src);
console.log("prerendered index.html");

// Case studies
for (const f of readdirSync(root + "case-studies").filter((f) => f.endsWith(".html"))) {
  const html = await rendered("case-studies/" + f, () => document.getElementById("main").innerHTML);
  writeFileSync(root + "case-studies/" + f, fill(readFileSync(root + "case-studies/" + f, "utf8"), "main", html.trim()));
  console.log("prerendered case-studies/" + f);
}

await browser.close();
server.close();
