// Lists every unfinished [TODO: …] in js/data.js with its line number: node tools/todos.mjs
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../js/data.js", import.meta.url), "utf8").split("\n");
let n = 0;
src.forEach((line, i) => {
  for (const m of line.matchAll(/\[TODO:([^\]]*)\]/g)) {
    n++;
    console.log(`js/data.js:${String(i + 1).padEnd(4)} ${m[1].trim()}   ← ${line.trim().slice(0, 70)}`);
  }
});
console.log(`\n${n} TODOs`);
