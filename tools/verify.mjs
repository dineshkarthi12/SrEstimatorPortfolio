// Checks the numbers in js/data.js: node tools/verify.mjs
//  - every project's trades add up (to the paisa) to its BOQ summary total
//  - GST is 18% of the total and net = total + GST, where the summary shows them
//  - projects are listed in value order
//  - the "largest single BOQ" headline stat is no bigger than the largest project
//  - every ₹ figure quoted in challenge/result text matches a real trade or total
import { readFileSync } from "node:fs";
import vm from "node:vm";

const root = new URL("..", import.meta.url).pathname;
const ctx = { window: {} };
vm.runInNewContext(readFileSync(root + "js/data.js", "utf8"), ctx);
const S = ctx.window.SITE;

const paise = (v) => Math.round(v * 100);
const sf3 = (x) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const short = (v) => (v >= 1e7 ? `₹${sf3(v / 1e7)} Cr` : `₹${sf3(v / 1e5)} L`);
const inr = (v) => "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

let fail = 0;
const ok = (cond, msg) => { console.log(`${cond ? "  ok " : "  FAIL"}  ${msg}`); if (!cond) fail++; };

S.projects.forEach((p, i) => {
  console.log(`\n${String(i + 1).padStart(2, "0")} ${p.name}`);
  const priced = p.trades.filter((t) => t[1] != null);
  const sum = priced.reduce((a, t) => a + paise(t[1]), 0);
  ok(sum === paise(p.boq.total), `${priced.length} priced trades sum to ${inr(sum / 100)} = summary ${inr(p.boq.total)}`);
  if (p.boq.gst != null) {
    ok(Math.abs(Math.round(paise(p.boq.total) * 0.18) - paise(p.boq.gst)) <= 1, `GST 18% = ${inr(p.boq.gst)}`);
    ok(paise(p.boq.net) === paise(p.boq.total) + paise(p.boq.gst), `net total ${inr(p.boq.net)}`);
  }
  ok(new Set(p.trades.map((t) => t[2])).size === p.trades.length, `${p.trades.length} trades, no duplicate keys`);
  p.trades.forEach((t) => { if (!S.bomLibrary[t[2]]) ok(false, `BOM library has "${t[2]}"`); });
  if (i > 0) ok(S.projects[i - 1].boq.total >= p.boq.total, "listed in value order");

  // Every ₹x.xx Cr / ₹x.x L in the copy must be a real number from this BOQ.
  const known = new Set([short(p.boq.total), ...priced.map((t) => short(t[1]))]);
  const text = [...p.challenge, ...p.result].join(" ");
  for (const m of text.matchAll(/₹\d+(?:\.\d+)? (?:Cr|L)\b/g)) ok(known.has(m[0]), `quoted figure ${m[0]} matches the BOQ`);
});

const largest = Math.max(...S.projects.map((p) => p.boq.total));
const stat = S.stats.find((s) => /largest single BOQ/i.test(s.label));
console.log("");
if (stat) ok(stat.value * 1e7 <= largest, `headline "${stat.prefix}${stat.value}${stat.suffix} ${stat.label}" ≤ largest BOQ ${inr(largest)}`);
console.log(fail ? `\n${fail} check(s) failed` : "\nAll checks passed");
process.exit(fail ? 1 : 0);
