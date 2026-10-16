/* Case-study pages: one template, filled from data.js by body[data-project]. */
(function () {
  "use strict";

  const { S, esc, rich, stripTodo, pad2, icons, motion, est: E } = DK;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const slug = document.body.dataset.project;
  const index = S.projects.findIndex((p) => p.slug === slug);
  const p = S.projects[index];
  const next = S.projects[(index + 1) % S.projects.length];
  const total = S.projects.length;
  const v = E.shortParts(p.boq.total);

  // Paragraphs: keep TODO chips (or drop them), skip anything left empty.
  const paras = (list) => list.filter((t) => stripTodo(t) || S.showTodos).map((t) => `<p>${rich(t)}</p>`).join("");

  const section = (no, id, title, inner, cls = "") => `
    <section class="cs-sec ${cls}" id="${id}" aria-labelledby="${id}-h">
      <div class="wrap grid">
        <header class="cs-sec__head">
          <span class="mono cs-sec__no">${no}</span>
          <h2 class="cs-sec__title" id="${id}-h">${esc(title)}</h2>
        </header>
        ${inner}
      </div>
    </section>`;

  const metaRow = [
    ["Type", p.type],
    ["Location", p.location],
    ["Role", p.role],
    ["Duration", p.duration],
    ["Revisions", p.revisions],
    ["Status", p.status]
  ].filter(([, val]) => stripTodo(val) || S.showTodos)
    .map(([k, val]) => `<div class="cs-meta__item"><dt class="label">${k}</dt><dd>${rich(val)}</dd></div>`).join("");

  const counts = [
    { value: v.num, prefix: "₹", suffix: " " + v.unit, label: "BOQ value, excl. GST" },
    { value: String(E.tradeCount(p)), prefix: "", suffix: "", label: "Trades in the BOQ" },
    p.boq.net != null
      ? { value: E.shortParts(p.boq.net).num, prefix: "₹", suffix: " " + E.shortParts(p.boq.net).unit, label: "Net total, incl. 18% GST" }
      : { value: String(E.priced(p).length), prefix: "", suffix: "", label: `Priced trades · ${E.tradeCount(p) - E.priced(p).length} excluded` }
  ];
  const results = counts.map((r) => {
    const dec = (r.value.split(".")[1] || "").length;
    return `<li class="cs-result"><span class="cs-result__num" data-count="${r.value}" data-decimals="${dec}" data-prefix="${esc(r.prefix)}" data-suffix="${esc(r.suffix)}">${esc(r.prefix)}${r.value}${esc(r.suffix)}</span><span class="mono cs-result__label">${esc(r.label)}</span></li>`;
  }).join("");

  const n = (k) => pad2(k);
  let s = 0;
  const no = () => n(++s);

  $("#main").innerHTML = `
    <section class="cs-cover" id="top" aria-labelledby="cs-title">
      <div class="wrap">
        <div class="sheet__meta">
          <span class="mono sheet__no"><i class="sheet__tick" aria-hidden="true"></i>Case study ${pad2(index + 1)} / ${pad2(total)}</span>
          <span class="label">${esc(p.client)}</span>
          <span class="label">Sheet C-${pad2(index + 1)}</span>
        </div>
        <div class="grid cs-cover__grid">
          <div class="cs-cover__text">
            <p class="label">${esc(p.type)}${p.hero ? " · ★ Featured" : ""}</p>
            <h1 class="display cs-title" id="cs-title">${esc(p.name)}</h1>
            <p class="lead cs-summary">${rich(p.challenge[0])}</p>
            <div class="cs-cover__metric">
              <span class="cs-cover__num">₹${v.num} ${v.unit}</span>
              <span class="label">BOQ value, excl. GST · ${E.tradeCount(p)} trades</span>
            </div>
            <div class="cs-cover__actions">
              <button class="btn" type="button" data-open="drawing">View drawings</button>
            </div>
          </div>
        </div>
        <div class="cs-cover__stage">
          <div class="cs-cover__img">${E.img(p.images.plate, `${p.short}, drawing`, { eager: true, w: 1600, h: 1000 })}</div>
        </div>
        ${metaRow ? `<dl class="cs-meta">${metaRow}</dl>` : ""}
      </div>
    </section>

    ${section(no(), "overview", "Overview", `<div class="cs-sec__body lead"><p>${esc(p.scope)}</p>
      <ul class="cs-points">
        <li>Client: ${esc(p.client)}</li>
        <li>Location: ${rich(p.location)}</li>
        <li>Role: ${rich(p.role)}</li>
        <li>${E.tradeCount(p)} BOQ trades, ${E.short(p.boq.total)} excluding GST</li>
      </ul></div>`)}

    ${section(no(), "challenge", "The challenge", `<div class="cs-sec__body">${paras(p.challenge)}</div>`)}

    ${section(no(), "drawing", "Layer 01 · Drawing", `
      <div class="cs-sec__body"><p>The drawings the take-off was measured from. Title blocks, logos, and client and consultant names have been removed.</p></div>
      <div class="cs-drawings">${E.drawingsFigures(p, { cls: "cs-wide cs-drawing", numPrefix: "" })}</div>`)}

    ${section(no(), "bom", "Layer 02 · BOM", `
      <div class="cs-sec__body"><p>Material categories for each BOQ trade. Items marked <span class="mono">per drawing</span> come from the drawing legends; quantities come from the take-off.</p></div>
      <div class="cs-wide table-scroll">${E.bomTable(p)}</div>`)}

    ${section(no(), "boq", "Layer 03 · BOQ", `
      <div class="cs-boq">
        <figure class="cs-boq__shot">
          <div class="cs-flow__sticky">
            ${E.img(p.images.boq, `${p.short}, BOQ summary sheet`)}
            <figcaption class="figcap mono"><span>Fig. ${pad2(index + 1)}.3 — BOQ summary sheet</span><button class="text-link cs-zoom" type="button" data-open="boq">Open full size</button></figcaption>
          </div>
        </figure>
        <div class="cs-boq__chart">
          <h3 class="label">Trade-wise breakdown · largest first · hover for value and share</h3>
          ${E.chart(p)}
          ${E.boqTotals(p)}
          ${E.checkLine(p)}
        </div>
      </div>`, "cs-sec--flow")}

    ${p.timeline ? section(no(), "revisions", "Revisions", `
      <div class="cs-sec__body"><p>The design kept moving while the estimate was being built. Each issue of the BOQ is logged here, from the first tender pricing to the current summary.</p></div>
      ${E.timeline(p)}`) : ""}

    ${section(no(), "result", "Result", `<div class="cs-sec__body lead">${paras(p.result)}</div>
      <ul class="cs-results">${results}</ul>`)}

    <nav class="cs-next" aria-label="More work">
      <div class="wrap">
        <a class="cs-next__link" href="${next.slug}.html">
          <span class="label">Next project · ${pad2(((index + 1) % total) + 1)} / ${pad2(total)}</span>
          <span class="display cs-next__name">${esc(next.short)} ${icons.arrow}</span>
          <span class="label">${esc(next.type)} · ${esc(E.short(next.boq.total))}</span>
          <span class="cs-next__preview" aria-hidden="true">${E.img(next.images.plate, "")}</span>
        </a>
        <div class="cs-next__back">
          <a class="text-link" href="../index.html#work">← Back to all projects</a>
          <a class="text-link" href="../index.html#contact">Get in touch</a>
        </div>
      </div>
    </nav>`;

  DK.renderFooter();
  E.verifyAll();
  E.initChartTips();

  /* ---------- full-size viewer for drawings / BOQ sheet ---------- */

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-labelledby", "cs-lb-title");
  dlg.innerHTML = `
    <div class="lightbox__bar">
      <h2 class="lightbox__title" id="cs-lb-title"></h2>
      <button class="lightbox__close" type="button" aria-label="Close" style="margin-left:auto">${icons.close}</button>
    </div>
    <div class="lightbox__panel" tabindex="0"></div>
    <div class="lightbox__foot mono"><span class="label">Esc closes</span></div>`;
  document.body.append(dlg);
  let opener = null;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (!b) return;
    opener = b;
    const kind = b.dataset.open;
    $("#cs-lb-title", dlg).textContent = `${p.short} · ${E.KIND_NAMES[kind]}`;
    $(".lightbox__panel", dlg).innerHTML = E.panel(p, kind);
    dlg.showModal();
    DK.lenis && DK.lenis.stop();
    $(".lightbox__close", dlg).focus();
  });
  $(".lightbox__close", dlg).addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", (e) => DK.trapFocus(dlg, e));
  dlg.addEventListener("close", () => { DK.lenis && DK.lenis.start(); opener && opener.focus(); });

  /* ---------- next-project hover preview ---------- */

  const nextLink = $(".cs-next__link");
  nextLink.addEventListener("pointermove", (e) => {
    const b = nextLink.getBoundingClientRect();
    nextLink.style.setProperty("--mx", ((e.clientX - b.left) / b.width).toFixed(3));
    nextLink.style.setProperty("--my", ((e.clientY - b.top) / b.height).toFixed(3));
  });

  /* ---------- counters & motion ---------- */

  $$("[data-count]").forEach((el) =>
    DK.countUp(el, +el.dataset.count, { prefix: el.dataset.prefix, suffix: el.dataset.suffix, decimals: +el.dataset.decimals || 0 }));

  if (motion) {
    gsap.fromTo(".cs-cover__img",
      { rotateX: 32, rotateZ: -7, scale: 0.9, y: 40, transformPerspective: 1600 },
      {
        rotateX: 0, rotateZ: 0, scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: ".cs-cover__stage", start: "top 95%", end: "center 55%", scrub: 0.6 }
      });
    gsap.from(".cs-cover__text > *", { y: 32, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, delay: 0.1 });
    $$(".cs-sec__head, .cs-sec__body, .cs-wide, .cs-results, .revs").forEach((el) => el.classList.add("reveal"));
    DK.initReveals();

    // Images without fixed boxes change height when they load.
    let t;
    $$("main img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 150); }, { once: true });
    });
  }

  DK.scrollToHash();
})();
