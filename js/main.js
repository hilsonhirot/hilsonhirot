(function () {
  const main = document.querySelector("#main");
  const header = document.querySelector("#header");
  const dock = document.querySelector("#dock");
  const loader = document.querySelector("#loader");
  const loaderPct = document.querySelector("#loader-pct");

  const galleryPlan = [
    { c: 10, s: 5, r: 1 },
    { c: 5, s: 5, r: 4 },
    { c: 1, s: 4, r: 8 },
    { c: 8, s: 4, r: 11 },
    { c: 3, s: 6, r: 15 },
    { c: 9, s: 5, r: 19 },
    { c: 1, s: 5, r: 23 },
    { c: 6, s: 4, r: 27 }
  ];

  function projectBySlug(slug) {
    return SITE.projects.find((project) => project.slug === slug) || null;
  }

  function route() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [head, slug] = raw.split("/");
    if (head === "gallery") return { page: "home", mode: "gallery" };
    if (head === "profile") return { page: "profile", mode: "grid" };
    if (head === "privacy") return { page: "privacy", mode: "grid" };
    if (head === "work" && projectBySlug(slug)) return { page: "project", mode: "grid", slug };
    return { page: "home", mode: "grid" };
  }

  function list(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
  }

  function tile(project, src, index, caseView) {
    const label = index === 0 ? project.title : "";
    return `<a class="tile${caseView ? " is-case" : ""}" data-project="${project.slug}" href="#/work/${project.slug}">
      <span class="tile-label"><span>${label}</span><span class="tile-index">${index + 1}</span></span>
      <span class="frame"><img src="${src}" alt="${project.title}, image ${index + 1}"></span>
    </a>`;
  }

  function footer() {
    const year = new Date().getFullYear();
    const socials = SITE.socials;
    const mid = Math.ceil(socials.length / 2);
    const col = (links) => links.map((link) => {
      const external = link.href.startsWith("http");
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<li><a href="${link.href}"${attrs}>${link.label}</a></li>`;
    }).join("");

    return `<footer class="cols footer">
      <div class="foot-copy">
        <p>©${year}</p>
        <p><a href="#/privacy">Privacy Policy</a></p>
      </div>
      <ul class="foot-social">${col(socials.slice(0, mid))}</ul>
      <ul class="foot-social">${col(socials.slice(mid))}</ul>
      <div class="foot-end"><a href="mailto:${SITE.email}">Email</a></div>
    </footer>`;
  }

  function renderHeader() {
    const services = [`<p>Services</p>`, `<ul>${list(SITE.services)}</ul>`].join("");
    const recognition = [`<p>Softskills</p>`, `<ul>${list(SITE.recognition)}</ul>`].join("");
    header.innerHTML = `<div class="cols header-row">
      <a class="name" href="#/">${SITE.name}</a>
      <p class="avail">${SITE.availability}</p>
      <div class="services">${services}</div>
      <div class="recognition">${recognition}</div>
      <a class="desk-profile" href="#/profile">Profile</a>
      <a class="desk-email" href="mailto:${SITE.email}">Email me</a>
      <p class="mobile-links"><a href="#/profile">Profile</a>, <a href="mailto:${SITE.email}">Email me</a></p>
    </div>`;
  }

  function renderHome(mode) {
    if (mode === "gallery") {
      const items = SITE.projects.map((project, index) => {
        const plan = galleryPlan[index % galleryPlan.length];
        const cycle = Math.floor(index / galleryPlan.length);
        const row = plan.r + cycle * 32;
        return `<article class="gallery-item" style="--c:${plan.c};--s:${plan.s};--r:${row};z-index:${index + 1}">
          <a href="#/work/${project.slug}"><img src="${project.images[0]}" alt="${project.title}"></a>
        </article>`;
      }).join("");
      return `<section class="cols gallery">${items}</section>${footer()}`;
    }

    const tiles = SITE.projects.map((project) => {
      return project.images.map((src, index) => tile(project, src, index, false)).join("");
    }).join("");
    return `<section class="stage"><div class="cols work-grid">${tiles}</div></section>${footer()}`;
  }

  function renderProject(slug) {
    const project = projectBySlug(slug);
    const tiles = project.images.map((src, index) => tile(project, src, index, true)).join("");
    return `<section class="stage">
      <p class="case-note">${project.summary}</p>
      <div class="cols work-grid">${tiles}</div>
    </section>${footer()}`;
  }

  function renderProfile() {
    const sections = SITE.profile.map((block) => `<section class="cols profile-section">
      <h2 class="kicker">${block.kicker}</h2>
      <p class="display">${block.text}</p>
      ${block.image ? `<img class="profile-shot" src="${block.image}" alt="">` : ""}
    </section>`).join("");

    const columns = SITE.info.columns.map((col) => {
      const body = col.items ? `<ul>${list(col.items)}</ul>` : `<p>${col.text}</p>`;
      return `<div class="info-col"><h3>${col.title}</h3>${body}</div>`;
    }).join("");

    return `${sections}<section class="cols info"><h2 class="kicker">${SITE.info.kicker}</h2>${columns}</section>${footer()}`;
  }

  function renderPrivacy() {
    const copy = SITE.privacy.map((paragraph) => `<p>${paragraph}</p>`).join("");
    return `<article class="cols legal"><div class="legal-copy"><h1>Privacy Policy</h1>${copy}</div></article>${footer()}`;
  }

  function renderDock(state) {
    const onHome = state.page === "home";
    dock.innerHTML = `<nav class="pill" aria-label="View">
        <a href="#/" class="${onHome && state.mode === "grid" ? "is-active" : ""}">Grid</a>
        <a href="#/gallery" class="${onHome && state.mode === "gallery" ? "is-active" : ""}">Gallery</a>
      </nav>
      <button type="button" class="theme-toggle" role="switch">
        <span class="theme-toggle-thumb">
          <svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.4 3.1a.8.8 0 0 1 .3 1.1A6.6 6.6 0 0 0 19.8 15a.8.8 0 0 1 1.1 1A8.2 8.2 0 1 1 13.3 2.8a.8.8 0 0 1 1.1.3z"/></svg>
          <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="12" r="4.3"/><rect x="10.9" y="1.2" width="2.2" height="4.4" rx="1.1"/><rect x="10.9" y="18.4" width="2.2" height="4.4" rx="1.1"/><rect x="1.2" y="10.9" width="4.4" height="2.2" rx="1.1"/><rect x="18.4" y="10.9" width="4.4" height="2.2" rx="1.1"/></g></svg>
        </span>
      </button>`;
    syncThemeButtons();
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function syncThemeButtons() {
    const toggle = dock.querySelector(".theme-toggle");
    if (!toggle) return;
    const light = currentTheme() === "light";
    toggle.setAttribute("aria-checked", light ? "true" : "false");
    toggle.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (error) {}
    syncThemeButtons();
  }

  function revealImages() {
    main.querySelectorAll("img").forEach((img) => {
      const show = () => img.classList.add("is-ready");
      if (img.complete && img.naturalWidth > 0) show();
      else img.addEventListener("load", show, { once: true });
    });
  }

  function render() {
    const state = route();
    document.title = state.page === "project"
      ? `${projectBySlug(state.slug).title} — ${SITE.name}`
      : `${SITE.name} — ${SITE.role}`;

    if (state.page === "profile") main.innerHTML = renderProfile();
    else if (state.page === "privacy") main.innerHTML = renderPrivacy();
    else if (state.page === "project") main.innerHTML = renderProject(state.slug);
    else main.innerHTML = renderHome(state.mode);

    renderDock(state);
    revealImages();
    window.scrollTo(0, 0);
  }

  function bootLoader() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      loader.classList.add("is-done");
      return;
    }
    const start = performance.now();
    const duration = 700;
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      loaderPct.textContent = `${Math.round(progress * 100)}%`;
      if (progress < 1) requestAnimationFrame(tick);
      else loader.classList.add("is-done");
    }
    requestAnimationFrame(tick);
  }

  main.addEventListener("pointerover", (event) => {
    const grid = event.target.closest(".work-grid");
    if (!grid || grid.querySelector(".is-case")) return;
    const tile = event.target.closest(".tile");
    if (!tile || !grid.contains(tile)) return;
    const project = tile.dataset.project;
    grid.querySelectorAll(".tile").forEach((item) => {
      item.classList.toggle("is-dim", item.dataset.project !== project);
    });
  });

  main.addEventListener("pointerout", (event) => {
    const grid = event.target.closest(".work-grid");
    if (!grid) return;
    const next = event.relatedTarget;
    if (next && grid.contains(next)) return;
    grid.querySelectorAll(".tile.is-dim").forEach((item) => item.classList.remove("is-dim"));
  });

  dock.addEventListener("click", (event) => {
    if (event.target.closest(".theme-toggle")) {
      setTheme(currentTheme() === "light" ? "dark" : "light");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && location.hash && location.hash !== "#/" && location.hash !== "#") {
      location.hash = "#/";
    }
  });

  window.addEventListener("hashchange", render);
  renderHeader();
  render();
  bootLoader();
})();
