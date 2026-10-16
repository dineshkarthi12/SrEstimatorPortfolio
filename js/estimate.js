/*
 * Estimating helpers shared by the home page and case studies:
 * rupee formatting, total checks, the trade-wise bar chart, the BOM table,
 * and the three project layers (Drawing → BOM → BOQ).
 */
(function () {
  "use strict";

  const { S, esc, rich, asset, pad2 } = DK;

  /* ---------- numbers ---------- */

  const paise = (v) => Math.round(v * 100);

  // Indian grouping: 4,28,31,27,43.80
  const inr = (v, dec = 0) => "₹" + Number(v).toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const inrExact = (v) => inr(v, paise(v) % 100 ? 2 : 0);

  // Three significant figures in crore or lakh: ₹42.8 Cr, ₹4.27 Cr, ₹49.6 L
  function sf3(x) { return x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2); }
  function shortParts(v) {
    return v >= 1e7 ? { num: sf3(v / 1e7), unit: "Cr" } : { num: sf3(v / 1e5), unit: "L" };
  }
  const short = (v) => { const s = shortParts(v); return `₹${s.num} ${s.unit}`; };

  const priced = (p) => p.trades.filter((t) => t[1] != null);

  // Sum the trades in paise so floating point never moves a total.
  function check(p) {
    const sum = priced(p).reduce((a, t) => a + paise(t[1]), 0);
    const total = paise(p.boq.total);
    const res = { ok: sum === total, sum: sum / 100, total: total / 100, diff: (sum - total) / 100 };
    if (p.boq.gst != null) {
      res.gstOk = Math.abs(Math.round(total * 0.18) - paise(p.boq.gst)) <= 1;
      res.netOk = paise(p.boq.net) === total + paise(p.boq.gst);
    }
    return res;
  }

  function verifyAll() {
    let all = true;
    S.projects.forEach((p) => {
      const r = check(p);
      const ok = r.ok && r.gstOk !== false && r.netOk !== false;
      all = all && ok;
      if (!ok) console.error(`[BOQ check] ${p.name}: trades ${inrExact(r.sum)} vs summary ${inrExact(r.total)}`, r);
    });
    if (all) console.info(`[BOQ check] ${S.projects.length} projects: every trade list adds up to its summary total.`);
    return all;
  }

  const tradeCount = (p) => p.trades.length;
  const portfolioTotal = () => S.projects.reduce((a, p) => a + p.boq.total, 0);

  /* ---------- chart: trade-wise breakdown ---------- */

  // One series, so one hue (sky); sorted by value; the long tail folds into
  // "Other" in the compact version. Excluded trades are listed, unbarred.
  function chart(p, { limit = Infinity, compact = false } = {}) {
    const total = p.boq.total;
    let rows = priced(p).slice().sort((a, b) => b[1] - a[1]);
    let other = null;
    if (rows.length > limit) {
      const rest = rows.slice(limit - 1);
      rows = rows.slice(0, limit - 1);
      other = [`Other ${rest.length} trades`, rest.reduce((a, t) => a + t[1], 0), "other"];
    }
    const max = Math.max(...rows.map((t) => t[1]), other ? other[1] : 0);
    const row = (t, cls = "") => {
      const pct = (t[1] / max) * 100;
      const share = (t[1] / total) * 100;
      return `
      <li class="chart__row ${cls}${t[3] ? " chart__row--note" : ""}" data-tip="${esc(t[0])}|${esc(inrExact(t[1]))}|${share.toFixed(1)}% of BOQ${t[3] ? " · " + esc(t[3]) : ""}">
        <span class="chart__label">${esc(t[0])}${t[3] && !compact ? `<em class="chart__note">${esc(t[3])}</em>` : ""}</span>
        <svg class="chart__bar" width="100%" height="${compact ? 8 : 10}" aria-hidden="true" focusable="false">
          <rect class="chart__track" x="0" y="0" width="100%" height="100%"/>
          <rect class="chart__fill" x="0" y="0" width="${pct.toFixed(2)}%" height="100%" rx="${compact ? 2 : 3}"/>
          <rect class="chart__fill chart__fill--base" x="0" y="0" width="${Math.min(pct, 1).toFixed(2)}%" height="100%"/>
        </svg>
        <span class="chart__val">${compact ? esc(short(t[1])) : esc(short(t[1]))}<span class="chart__pct">${share.toFixed(1)}%</span></span>
      </li>`;
    };
    const excluded = compact ? "" : p.trades.filter((t) => t[1] == null).map((t) => `
      <li class="chart__row chart__row--excluded">
        <span class="chart__label">${esc(t[0])}</span>
        <span class="chart__excl mono">${esc(t[3] || "Excluded")}</span>
        <span class="chart__val">—</span>
      </li>`).join("");
    return `<ol class="chart${compact ? " chart--compact" : ""}" aria-label="${esc(p.short)} trade-wise breakdown, largest first">
      ${rows.map((t) => row(t)).join("")}${other ? row(other, "chart__row--other") : ""}${excluded}
    </ol>`;
  }

  // Floating tooltip for chart rows (mouse, touch and keyboard focus on the panel).
  function initChartTips() {
    const tip = document.createElement("div");
    tip.className = "chart-tip mono";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.append(tip);
    let host = null;
    const show = (rowEl, x, y) => {
      const [name, val, share] = rowEl.dataset.tip.split("|");
      tip.innerHTML = `<strong>${name}</strong><span>${val}</span><span>${share}</span>`;
      const dlg = rowEl.closest("dialog");
      const parent = dlg || document.body;
      if (host !== parent) { parent.append(tip); host = parent; }
      tip.hidden = false;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      const left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 14));
      const top = y - h - 12 < 8 ? y + 18 : y - h - 12;
      tip.style.transform = `translate(${left}px, ${top}px)`;
    };
    document.addEventListener("pointermove", (e) => {
      const r = e.target.closest && e.target.closest(".chart__row[data-tip]");
      if (!r || r.closest(".layer__plate")) { tip.hidden = true; return; }
      show(r, e.clientX, e.clientY);
    }, { passive: true });
    document.addEventListener("scroll", () => { tip.hidden = true; }, { passive: true });
  }

  /* ---------- BOM ---------- */

  function bomRows(p) {
    return p.trades.map((t, i) => {
      const lib = S.bomLibrary[t[2]] || { material: "", unit: "" };
      return {
        ref: `M-${pad2(i + 1)}`,
        trade: t[0],
        material: (p.bomOverrides && p.bomOverrides[t[2]]) || lib.material,
        fromDrawing: !!(p.bomOverrides && p.bomOverrides[t[2]]),
        unit: lib.unit,
        value: t[1],
        note: t[3]
      };
    });
  }

  function bomTable(p, { compact = false, limit = Infinity } = {}) {
    const rows = bomRows(p).slice(0, limit);
    const more = p.trades.length - rows.length;
    return `
      <table class="bom${compact ? " bom--compact" : ""}">
        <thead><tr>
          <th scope="col">Ref.</th><th scope="col">BOQ trade</th><th scope="col">Material category</th>
          <th scope="col">Unit</th>${compact ? "" : '<th scope="col" class="num">Trade value</th>'}
        </tr></thead>
        <tbody>${rows.map((r) => `
          <tr${r.value == null ? ' class="is-excluded"' : ""}>
            <td class="mono">${r.ref}</td>
            <td>${esc(r.trade)}</td>
            <td>${esc(r.material)}${r.fromDrawing && !compact ? ' <span class="bom__src mono">per drawing</span>' : ""}</td>
            <td class="mono">${esc(r.unit)}</td>
            ${compact ? "" : `<td class="num">${r.value == null ? esc(r.note || "Excluded") : esc(inrExact(r.value))}</td>`}
          </tr>`).join("")}
          ${more > 0 ? `<tr class="bom__more"><td></td><td colspan="${compact ? 3 : 4}">+ ${more} more trades</td></tr>` : ""}
        </tbody>
        ${compact ? "" : `<tfoot><tr><td></td><th scope="row" colspan="3">Total, excl. GST</th><td class="num">${esc(inrExact(p.boq.total))}</td></tr></tfoot>`}
      </table>`;
  }

  /* ---------- the three layers ---------- */

  const KINDS = ["drawing", "bom", "boq"];
  const KIND_NAMES = { drawing: "Drawing", bom: "BOM", boq: "BOQ" };

  const img = (src, alt, opts = {}) =>
    `<img src="${esc(asset(src))}" alt="${esc(alt)}" data-label="${esc(opts.label || alt)}" loading="${opts.eager ? "eager" : "lazy"}" decoding="async"` +
    `${opts.w ? ` width="${opts.w}" height="${opts.h}"` : ""}${opts.cls ? ` class="${opts.cls}"` : ""} onerror="DK.imgFallback(this)">`;

  // What sits on each plate of the exploded stack.
  function plate(p, kind) {
    if (kind === "drawing") return img(p.images.plate, `${p.short}, drawing`, { w: 1600, h: 1000 });
    if (kind === "bom") return `
      <div class="mini mini--bom">
        <div class="mini__head mono"><span>BOM · Material summary</span><span>${tradeCount(p)} trades</span></div>
        ${bomTable(p, { compact: true, limit: 8 })}
      </div>`;
    const s = shortParts(p.boq.total);
    return `
      <div class="mini mini--boq">
        <div class="mini__shot">${img(p.images.boq, `${p.short}, BOQ summary`)}</div>
        <div class="mini__chart">
          <div class="mini__head mono"><span>BOQ · Trade-wise</span><span>₹${s.num} ${s.unit}</span></div>
          ${chart(p, { limit: 7, compact: true })}
        </div>
      </div>`;
  }

  function drawingsFigures(p, { cls = "lb-fig", start = 1, numPrefix = "" } = {}) {
    return p.images.drawings.map((d, i) => `
      <figure class="${cls}">
        ${img(d.src, `${p.short}: ${d.caption}`, { w: d.w, h: d.h })}
        <figcaption class="figcap mono"><span>${numPrefix}${esc(d.caption)}</span><span>Client and consultant details removed</span></figcaption>
      </figure>`).join("");
  }

  function checkLine(p) {
    const r = check(p);
    return `<p class="boq-check mono${r.ok ? "" : " is-bad"}">
      <span class="boq-check__mark" aria-hidden="true">${r.ok ? "✓" : "✕"}</span>
      Σ ${priced(p).length} priced trades = ${esc(inrExact(r.sum))} ${r.ok ? "· matches the BOQ summary" : `· differs from summary by ${esc(inrExact(r.diff))}`}
    </p>`;
  }

  function boqTotals(p) {
    const b = p.boq;
    return `<dl class="boq-totals">
      <div><dt class="label">Total, excl. GST</dt><dd>${esc(inrExact(b.total))}</dd></div>
      ${b.gst != null ? `<div><dt class="label">GST 18%</dt><dd>${esc(inrExact(b.gst))}</dd></div>
      <div><dt class="label">Net total</dt><dd>${esc(inrExact(b.net))}</dd></div>` : ""}
    </dl>`;
  }

  // Full-size content for the lightbox tabs.
  function panel(p, kind) {
    if (kind === "drawing") return `<div class="lb-sheet">${drawingsFigures(p)}</div>`;
    if (kind === "bom") return `
      <div class="lb-sheet lb-sheet--pad">
        <p class="lb-note">Material categories for each BOQ trade, with the unit each is measured in. Items marked <em>per drawing</em> come from the drawing legends.</p>
        <div class="table-scroll">${bomTable(p)}</div>
      </div>`;
    return `
      <div class="lb-sheet lb-sheet--pad lb-boq">
        <figure class="lb-boq__shot">
          ${img(p.images.boq, `${p.short}, BOQ summary sheet`)}
          <figcaption class="figcap mono"><span>BOQ summary sheet</span><span>Logo and client name blurred</span></figcaption>
        </figure>
        <div class="lb-boq__chart">
          <h3 class="label">Trade-wise breakdown · largest first</h3>
          ${chart(p)}
          ${boqTotals(p)}
          ${checkLine(p)}
        </div>
      </div>`;
  }

  /* ---------- revision timeline (hero project) ---------- */

  function timeline(p, { compact = false } = {}) {
    if (!p.timeline) return "";
    const items = p.timeline;
    if (compact) {
      const first = items[0], last = items[items.length - 1];
      return `<p class="revline mono"><span class="revline__tag">${rich(first.rev)}</span><span class="revline__track" aria-hidden="true"><i></i></span><span class="revline__tag is-current">${rich(last.rev)}</span><span class="revline__lbl">Continuous client revisions</span></p>`;
    }
    return `
      <ol class="revs">
        ${items.map((r, i) => `
          <li class="rev${r.current ? " is-current" : ""}">
            <span class="rev__node" aria-hidden="true"></span>
            <span class="mono rev__no">${rich(r.rev)}</span>
            <p class="rev__label">${rich(r.label)}</p>
            ${typeof r.value === "number" ? `<dl class="rev__meta"><div><dt class="label">BOQ value</dt><dd>${esc(short(r.value))} excl. GST</dd></div></dl>` : ""}
          </li>`).join("")}
      </ol>`;
  }

  DK.est = {
    paise, inr, inrExact, short, shortParts, priced, check, verifyAll, tradeCount, portfolioTotal,
    chart, initChartTips, bomRows, bomTable, KINDS, KIND_NAMES, plate, panel, drawingsFigures,
    checkLine, boqTotals, timeline, img
  };
})();
