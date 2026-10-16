/* Shared by every page: header, menus, smooth scroll, footer, helpers. */
(function () {
  "use strict";

  const S = window.SITE;
  const doc = document.documentElement;
  const body = document.body;
  const ROOT = body.dataset.root || "";
  const IS_HOME = body.dataset.page === "home";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasLibs = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduced && hasLibs;

  doc.classList.toggle("motion", motion);
  doc.classList.toggle("static", !motion);

  if (hasLibs) {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile address bars resize the viewport while scrolling; don't re-measure for that.
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------- helpers ---------- */

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const stripTodo = (s) => String(s == null ? "" : s).trim();
  const rich = (s) => esc(stripTodo(s));

  const asset = (p) => (/^(https?:)?\/\//.test(p) || p.startsWith("data:") ? p : ROOT + p);

  const pad2 = (n) => String(n).padStart(2, "0");

  const ext = 'target="_blank" rel="noopener"';

  // DK mark: the box morphs into a beating heart and back, on a loop (SVG/SMIL,
  // so it runs in every browser). Paused for reduced-motion users.
  const DK_MARK = '<svg class="dk-mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><g transform="translate(20 20)"><g><animateTransform attributeName="transform" type="scale" dur="5s" repeatCount="indefinite" calcMode="spline" values="1;1;1;1.16;1;1.09;1;1.16;1;1.09;1;1;1" keyTimes="0;0.4;0.43;0.46;0.49;0.51;0.54;0.57;0.6;0.62;0.645;0.7;1" keySplines="0 0 1 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;.3 0 .7 1;0 0 1 1;0 0 1 1"/><g transform="translate(-20 -20)"><rect x="0.5" y="0.5" width="39" height="39" rx="2" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"><animate attributeName="opacity" dur="5s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.3;0.76" values="1;0;1"/></rect><path class="dk-mark__shape" d="M20,39.5 C0.5,39.5 0.5,39.5 0.5,20 C0.5,0.5 0.5,0.5 10,0.5 C15,0.5 18,0.5 20,0.5 C22,0.5 25,0.5 30,0.5 C39.5,0.5 39.5,0.5 39.5,20 C39.5,39.5 39.5,39.5 20,39.5 Z" fill="#E5484D" fill-opacity="0" stroke-opacity="0" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"><animate attributeName="d" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.3;0.4;0.66;0.76;1" keySplines="0 0 1 1;.45 0 .2 1;0 0 1 1;.45 0 .2 1;0 0 1 1" values="M20,39.5 C0.5,39.5 0.5,39.5 0.5,20 C0.5,0.5 0.5,0.5 10,0.5 C15,0.5 18,0.5 20,0.5 C22,0.5 25,0.5 30,0.5 C39.5,0.5 39.5,0.5 39.5,20 C39.5,39.5 39.5,39.5 20,39.5 Z;M20,39.5 C0.5,39.5 0.5,39.5 0.5,20 C0.5,0.5 0.5,0.5 10,0.5 C15,0.5 18,0.5 20,0.5 C22,0.5 25,0.5 30,0.5 C39.5,0.5 39.5,0.5 39.5,20 C39.5,39.5 39.5,39.5 20,39.5 Z;M20,35 C8,27 3,20 3,13 C3,7 7,4 11.5,4 C15,4 18,6 20,9 C22,6 25,4 28.5,4 C33,4 37,7 37,13 C37,20 32,27 20,35 Z;M20,35 C8,27 3,20 3,13 C3,7 7,4 11.5,4 C15,4 18,6 20,9 C22,6 25,4 28.5,4 C33,4 37,7 37,13 C37,20 32,27 20,35 Z;M20,39.5 C0.5,39.5 0.5,39.5 0.5,20 C0.5,0.5 0.5,0.5 10,0.5 C15,0.5 18,0.5 20,0.5 C22,0.5 25,0.5 30,0.5 C39.5,0.5 39.5,0.5 39.5,20 C39.5,39.5 39.5,39.5 20,39.5 Z;M20,39.5 C0.5,39.5 0.5,39.5 0.5,20 C0.5,0.5 0.5,0.5 10,0.5 C15,0.5 18,0.5 20,0.5 C22,0.5 25,0.5 30,0.5 C39.5,0.5 39.5,0.5 39.5,20 C39.5,39.5 39.5,39.5 20,39.5 Z"/><animate attributeName="fill-opacity" dur="5s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.3;0.4;0.66;0.76;1" keySplines="0 0 1 1;.45 0 .2 1;0 0 1 1;.45 0 .2 1;0 0 1 1" values="0;0;1;1;0;0"/><animate attributeName="stroke-opacity" dur="5s" repeatCount="indefinite" keyTimes="0;0.3;0.301;0.4;0.66;0.759;0.76;1" values="0;0;1;0;0;1;0;0"/></path><text class="dk-mark__text" x="20" y="20.5" text-anchor="middle" dominant-baseline="central" fill="currentColor">DK<animate attributeName="opacity" dur="5s" repeatCount="indefinite" keyTimes="0;0.3;0.36;0.7;0.76;1" values="1;1;0;0;1;1"/></text></g></g></g></svg>';

  const icons = {
    arrow: '<svg class="icon arrow" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M3 10h13M11 5l5 5-5 5"/></svg>',
    arrowUpRight: '<svg class="contact__arrow" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M8 20 20 8M10 8h10v10"/></svg>',
    chevron: '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="m1.5 3.5 3.5 3.5 3.5-3.5"/></svg>',
    close: '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="m4 4 12 12M16 4 4 16"/></svg>',
    mail: '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx=".5"/><path d="m3 5 7 6 7-6"/></svg>',
    phone: '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M6.5 2.5h-2a1 1 0 0 0-1 1.1C4 10.6 9.4 16 16.4 16.5a1 1 0 0 0 1.1-1v-2l-3.6-1.4-1.8 1.8A9.5 9.5 0 0 1 6.1 7.9L7.9 6.1Z"/></svg>',
    whatsapp: '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M3.2 16.8 4.3 13A7.3 7.3 0 1 1 7 15.7Z"/><path d="M7.6 6.6c.3-.4.8-.4 1 0l.6 1.3c.1.3 0 .6-.2.8l-.4.4c.4.9 1.2 1.7 2.1 2.1l.4-.4c.2-.2.5-.3.8-.2l1.3.6c.4.2.4.7 0 1-.6.6-1.5.9-2.4.5a7 7 0 0 1-3.6-3.6c-.4-.9-.1-1.8.4-2.5Z"/></svg>',
    doc: '<svg class="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true"><path d="M5 2.5h6.5L15 6v11.5H5Z"/><path d="M11.5 2.5V6H15M7.5 10h5M7.5 13h5"/></svg>'
  };

  // Neutral labelled placeholder used when a project image fails to load.
  function placeholderSrc(label) {
    const t = esc(label || "Image unavailable");
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">` +
      `<rect width="1600" height="1000" fill="#C9C6C0"/>` +
      `<g stroke="#14191D" stroke-opacity=".12" stroke-width="1">` +
      Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 100}" y1="0" x2="${(i + 1) * 100}" y2="1000"/>`).join("") +
      Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${(i + 1) * 100}" x2="1600" y2="${(i + 1) * 100}"/>`).join("") +
      `</g><g stroke="#14191D" stroke-opacity=".35" fill="none"><rect x="560" y="390" width="480" height="220"/><line x1="560" y1="390" x2="1040" y2="610"/><line x1="1040" y1="390" x2="560" y2="610"/></g>` +
      `<text x="800" y="680" text-anchor="middle" font-family="Geist Mono, Menlo, monospace" font-size="30" letter-spacing="3" fill="#14191D">${t.toUpperCase()}</text>` +
      `<text x="800" y="726" text-anchor="middle" font-family="Geist Mono, Menlo, monospace" font-size="22" letter-spacing="2" fill="#3F4950">IMAGE NOT AVAILABLE</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // Called from onerror="DK.imgFallback(this)"
  function imgFallback(img) {
    img.onerror = null;
    img.removeAttribute("srcset");
    img.src = placeholderSrc(img.dataset.label || img.alt);
    img.classList.add("is-placeholder");
  }


  /* ---------- focus trap ---------- */

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    if (e.key !== "Tab") return;
    const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- header ---------- */

  function navHref(hash) { return IS_HOME ? hash : `${ROOT}index.html${hash}`; }

  function renderHeader() {
    const cases = S.projects.map((p, i) =>
      `<li><a href="${ROOT}case-studies/${p.slug}.html"><span class="mono">${pad2(i + 1)}</span><span>${esc(p.short)}</span><span class="mono">${esc(p.category)}</span></a></li>`
    ).join("");

    const header = document.createElement("div");
    header.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="page-progress" aria-hidden="true"><span></span></div>
      <header class="site-header" data-state="${IS_HOME ? "over" : "solid"}">
        <div class="wrap site-header__inner">
          <a class="monogram" href="#top" aria-label="${esc(S.person.name)}, back to top">${DK_MARK}</a>
          <nav class="nav" aria-label="Primary">
            <ul>
              <li><a href="${navHref("#work")}">Work</a></li>
              <li class="nav__cases">
                <button class="nav__cases-btn" type="button" aria-expanded="false" aria-controls="cases-menu">Case studies ${icons.chevron}</button>
                <ul class="nav__cases-menu" id="cases-menu" hidden>${cases}</ul>
              </li>
              <li><a href="${navHref("#about")}">About</a></li>
              <li><a href="${navHref("#experience")}">Experience</a></li>
              <li><a href="${navHref("#contact")}">Contact</a></li>
            </ul>
          </nav>
          <a class="btn btn--solid btn--sm btn--resume" href="${esc(asset(S.links.resume))}" download>Resume</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
            <span>Menu</span><span class="menu-toggle__bars" aria-hidden="true"></span>
          </button>
        </div>
      </header>
      <div class="mobile-menu on-dark" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
        <div class="mobile-menu__top">
          <a class="monogram" href="#top" aria-label="${esc(S.person.name)}, back to top">${DK_MARK}</a>
          <button class="mobile-menu__close" type="button">Close ${icons.close}</button>
        </div>
        <ul class="mobile-menu__list">
          <li><a href="${navHref("#work")}"><span class="mono">01</span>Work</a></li>
          <li>
            <a href="${navHref("#work")}" aria-describedby="mm-cases"><span class="mono">02</span>Case studies</a>
            <ul class="mobile-menu__sub" id="mm-cases">
              ${S.projects.map((p) => `<li><a href="${ROOT}case-studies/${p.slug}.html">${esc(p.short)}</a></li>`).join("")}
            </ul>
          </li>
          <li><a href="${navHref("#about")}"><span class="mono">03</span>About</a></li>
          <li><a href="${navHref("#experience")}"><span class="mono">04</span>Experience</a></li>
          <li><a href="${navHref("#contact")}"><span class="mono">05</span>Contact</a></li>
        </ul>
        <div class="mobile-menu__foot">
          <a class="btn btn--solid" href="${esc(asset(S.links.resume))}" download>Resume</a>
          <a class="btn" href="mailto:${esc(S.links.email)}">Email</a>
        </div>
      </div>`;
    body.prepend(...header.childNodes);
    initMenus();
  }

  function initMenus() {
    // Case studies dropdown (desktop)
    const btn = document.querySelector(".nav__cases-btn");
    const menu = document.getElementById("cases-menu");
    const setOpen = (open) => {
      btn.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    };
    btn.addEventListener("click", () => setOpen(menu.hidden));
    document.addEventListener("click", (e) => { if (!e.target.closest(".nav__cases")) setOpen(false); });
    document.querySelector(".nav__cases").addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    document.querySelector(".nav__cases").addEventListener("focusout", (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
    });

    // Full-screen mobile menu
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.getElementById("mobile-menu");
    const close = panel.querySelector(".mobile-menu__close");
    const open = () => {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      DK.lenis && DK.lenis.stop();
      body.style.overflow = "hidden";
      close.focus();
    };
    const shut = (restore = true) => {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      DK.lenis && DK.lenis.start();
      body.style.overflow = "";
      if (restore) toggle.focus();
    };
    toggle.addEventListener("click", open);
    close.addEventListener("click", () => shut());
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") shut();
      trapFocus(panel, e);
    });
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) shut(false); });
    window.addEventListener("resize", () => { if (!panel.hidden && window.innerWidth >= 960) shut(false); });
  }

  /* ---------- footer ---------- */

  function renderFooter() {
    const L = S.links;
    const f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML = `
      <div class="wrap">
        <dl class="titleblock">
          <span class="titleblock__draw" aria-hidden="true">
            <i class="tb tb--top"></i><i class="tb tb--right"></i><i class="tb tb--bottom"></i><i class="tb tb--left"></i>
            <i class="tb tb--v tb--v1"></i><i class="tb tb--v tb--v2"></i><i class="tb tb--v tb--v3"></i>
          </span>
          <div class="titleblock__cell"><dt class="label">Drawn by</dt><dd>${esc(S.person.name)}</dd></div>
          <div class="titleblock__cell"><dt class="label">Discipline</dt><dd>Estimation &amp; Quantity Surveying</dd></div>
          <div class="titleblock__cell"><dt class="label">Location</dt><dd>${esc(S.person.location)}</dd></div>
          <div class="titleblock__cell"><dt class="label">Revision</dt><dd>Rev. 2026</dd></div>
        </dl>
        <ul class="footer__links">
          <li><a class="text-link" href="mailto:${esc(L.email)}">Email</a></li>
          <li><a class="text-link" href="${esc(L.phoneHref)}">Phone</a></li>
          <li><a class="text-link" href="${esc(L.whatsapp)}" ${ext}>WhatsApp<span class="sr-only"> (opens in a new tab)</span></a></li>
          <li><a class="text-link" href="${esc(asset(L.resume))}" download>Resume</a></li>
        </ul>
        <div class="footer__base">
          <span class="label">© 2026 ${esc(S.person.name)}</span>
          <span class="label">${esc(S.person.coords)}</span>
        </div>
      </div>`;
    body.append(f);
    initTitleblockDraw(f.querySelector(".titleblock"));
    // Page scripts call renderFooter last, so every button now exists.
    initMagnetic();
  }

  // Title block lines draw themselves (like a pencil on a drawing sheet) when
  // the footer scrolls into view; the cell text follows.
  function initTitleblockDraw(tb) {
    if (!motion) return;
    tb.classList.add("is-drawable");
    ScrollTrigger.create({ trigger: tb, start: "top 92%", once: true, onEnter: () => tb.classList.add("is-drawn") });
  }

  /* ---------- magnetic buttons ---------- */

  // Buttons drift a few pixels toward the pointer and spring back on leave.
  // Mouse and trackpad only; never on touch or with reduced motion.
  function initMagnetic() {
    if (!motion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll(".btn:not([data-magnetic])").forEach((el) => {
      el.dataset.magnetic = "";
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        xTo(dx * 8);
        yTo(dy * 5);
      });
      el.addEventListener("pointerleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: true });
      });
    });
  }

  /* ---------- page transition ---------- */

  // Moving between pages: a slate panel slides up like a concrete wall, the next
  // page loads behind it, then the panel slides away. The label travels with it
  // through sessionStorage so both halves read the same.
  const PT_KEY = "dk-pt";
  function initPageTransition() {
    const clear = () => { try { sessionStorage.removeItem(PT_KEY); } catch (_) {} };
    if (reduced) { clear(); doc.classList.remove("pt-in"); return; }

    const el = document.createElement("div");
    el.className = "pt";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<span class="mono pt__kicker"></span><span class="pt__title"></span>';
    body.append(el);
    const label = (k, t) => {
      el.querySelector(".pt__kicker").textContent = k;
      el.querySelector(".pt__title").textContent = t;
    };
    const reset = () => { el.className = "pt"; };

    // Arriving: the panel is already covering the page; slide it away.
    let incoming = null;
    try { incoming = JSON.parse(sessionStorage.getItem(PT_KEY) || "null"); } catch (_) {}
    clear();
    if (incoming) {
      label(incoming.k, incoming.t);
      el.className = "pt is-on is-up";
      doc.classList.remove("pt-in");
      void el.offsetWidth;
      requestAnimationFrame(() => {
        el.classList.add("is-anim", "is-out");
        setTimeout(reset, 900);
      });
    }
    doc.classList.remove("pt-in");

    // Leaving: intercept same-site links to another page.
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      let url;
      try { url = new URL(a.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname) return; // same page: in-page scroll handles it
      e.preventDefault();

      const m = url.pathname.match(/case-studies\/([a-z0-9-]+)\.html$/);
      const i = m ? S.projects.findIndex((p) => p.slug === m[1]) : -1;
      const k = i >= 0 ? `Case study ${pad2(i + 1)} / ${pad2(S.projects.length)}` : "Portfolio";
      const t = i >= 0 ? S.projects[i].short : S.person.name;
      label(k, t);
      try { sessionStorage.setItem(PT_KEY, JSON.stringify({ k, t })); } catch (_) {}

      el.className = "pt is-on";
      void el.offsetWidth;
      el.classList.add("is-anim", "is-up");
      setTimeout(() => { location.href = url.href; }, 720);
    });

    // Back/forward cache: never come back to a covered page.
    window.addEventListener("pageshow", (e) => { if (e.persisted) { reset(); doc.classList.remove("pt-in"); } });
  }

  /* ---------- smooth scroll ---------- */

  function initScroll() {
    if (motion && window.Lenis) {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      DK.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // In-page anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = id === "#top" ? document.getElementById("top") : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToEl(target, id === "#top");
      history.replaceState(null, "", id === "#top" ? location.pathname : id);
    });


    // Progress hairline + scrolled flag
    const bar = document.querySelector(".page-progress span");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      doc.classList.toggle("has-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Pages call this once their layout is final (after the loader on home).
  function scrollToHash() {
    if (!location.hash || location.hash.length < 2) return;
    let target = null;
    try { target = document.querySelector(location.hash); } catch (_) { return; }
    if (target) requestAnimationFrame(() => scrollToEl(target, false, true));
  }

  function scrollToEl(target, top, immediate) {
    const offset = top ? 0 : -(document.querySelector(".site-header")?.offsetHeight || 0) + 1;
    const focusTarget = () => {
      if (top) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    if (DK.lenis) {
      DK.lenis.scrollTo(top ? 0 : target, { offset, immediate: !!immediate, duration: 1.4, onComplete: focusTarget });
    } else {
      const y = top ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "auto" });
      focusTarget();
    }
  }

  /* ---------- small shared animation ---------- */

  // Fade-up for elements marked .reveal (once). No-op without motion.
  function initReveals(scope = document) {
    if (!motion) return;
    scope.querySelectorAll(".reveal").forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 28 }, {
        autoAlpha: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  // Animate a number from 0 to its final value once it scrolls into view.
  function countUp(el, value, { prefix = "", suffix = "", decimals = 0 } = {}) {
    const f = (v) => prefix + (decimals ? v.toFixed(decimals) : Math.round(v)) + suffix;
    el.textContent = f(value);
    if (!motion) return;
    const o = { v: 0 };
    el.textContent = f(0);
    gsap.to(o, {
      v: value, duration: 1.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => { el.textContent = f(o.v); }
    });
  }

  /* ---------- export ---------- */

  window.DK = {
    S, ROOT, IS_HOME, motion, reduced, hasLibs,
    esc, rich, stripTodo, asset, pad2, icons, ext,
    placeholderSrc, imgFallback,
    trapFocus, scrollToEl, scrollToHash, initReveals, countUp,
    lenis: null
  };

  renderHeader();
  initScroll();
  initPageTransition();
  // Hold the DK mark still (as the box) for reduced-motion users.
  if (reduced) {
    document.querySelectorAll("svg.dk-mark").forEach((svg) => {
      if (svg.pauseAnimations) { svg.setCurrentTime(0); svg.pauseAnimations(); }
    });
  }
  // Footer goes after <main>, so render it once the page script has filled main.
  DK.renderFooter = renderFooter;
})();
