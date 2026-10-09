/* AURELIS progressive enhancements: navigation, discovery and reader comfort. */
(function () {
  "use strict";
  var body = document.body;
  var main = document.querySelector("main");
  var header = document.querySelector("header");
  var links = header ? header.querySelector(".links") : null;

  if (main && !main.id) main.id = "main-content";

  if (!document.querySelector(".skip-link")) {
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#" + (main ? main.id : "main-content");
    skip.textContent = "Skip to content";
    body.insertBefore(skip, body.firstChild);
  }

  if (links) {
    links.id = links.id || "aurelis-primary-links";
    var anchors = Array.prototype.slice.call(links.querySelectorAll("a[href]"));
    var hasLibraryCta = anchors.some(function (a) { return a.classList.contains("nav-cta"); });
    var hasScribe = anchors.some(function (a) { return a.href.indexOf("the-quiet-scribe.pages.dev") !== -1; });

    if (!hasLibraryCta) {
      var cta = document.createElement("a");
      cta.className = "nav-cta";
      cta.href = "library.html";
      cta.textContent = "Enter Aurelis ↗";
      links.appendChild(cta);
    }
    if (!hasScribe) {
      var scribe = document.createElement("a");
      scribe.href = "https://the-quiet-scribe.pages.dev/";
      scribe.target = "_blank";
      scribe.rel = "noopener noreferrer";
      scribe.textContent = "The Quiet Scribe ↗";
      links.appendChild(scribe);
    }

    var file = location.pathname.split("/").pop() || "index.html";
    var currentSection = file;
    if (["fiction.html", "poetry.html", "ideas.html", "archive.html", "the-closest-stranger.html"].indexOf(file) !== -1) currentSection = "library.html";
    if (["author-raushan.html", "author-anushka.html"].indexOf(file) !== -1) currentSection = "authors.html";
    Array.prototype.slice.call(links.querySelectorAll("a[href]")).forEach(function (a) {
      try {
        var target = new URL(a.href, location.href);
        var targetFile = target.pathname.split("/").pop() || "index.html";
        if (target.origin === location.origin && targetFile === currentSection) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        }
      } catch (e) {}
    });

    var toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-controls", links.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.innerHTML = '<span class="menu-toggle-icon" aria-hidden="true"><i></i><i></i></span><span class="menu-toggle-text">Menu</span>';
    links.parentElement.insertBefore(toggle, links);

    function closeMenu() {
      links.classList.remove("is-open");
      body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation menu");
      toggle.querySelector(".menu-toggle-text").textContent = "Menu";
    }
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      links.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      toggle.querySelector(".menu-toggle-text").textContent = open ? "Close" : "Menu";
    });
    links.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  var libraryGrid = document.querySelector("main .grid");
  var libraryBack = document.querySelector("main .back");
  if (libraryGrid && libraryBack && /(^|\/)library\.html$/.test(location.pathname)) {
    var searchWrap = document.createElement("div");
    searchWrap.className = "catalogue-search";
    searchWrap.innerHTML = '<label for="aurelis-search">Find something to read</label><input id="aurelis-search" type="search" autocomplete="off" placeholder="Search titles, rooms, or writers…" aria-describedby="aurelis-search-count"><span class="search-count" id="aurelis-search-count" aria-live="polite"></span>';
    libraryBack.insertAdjacentElement("afterend", searchWrap);

    var searchInput = searchWrap.querySelector("input");
    var count = searchWrap.querySelector(".search-count");
    var candidates = Array.prototype.slice.call(document.querySelectorAll("main .grid .card, main .list .item"));
    var empty = document.createElement("p");
    empty.className = "search-empty";
    empty.hidden = true;
    empty.textContent = "No matching shelves yet. Try a title, room, or author.";
    var list = document.querySelector("main .list");
    if (list) list.insertAdjacentElement("afterend", empty);

    function filterCatalogue() {
      var query = searchInput.value.trim().toLocaleLowerCase();
      var visible = 0;
      candidates.forEach(function (item) {
        var matches = !query || item.textContent.toLocaleLowerCase().indexOf(query) !== -1;
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      count.textContent = visible + (visible === 1 ? " result" : " results");
      empty.hidden = visible !== 0;
    }
    searchInput.addEventListener("input", filterCatalogue);
    filterCatalogue();
  }

  var storyReader = document.getElementById("bookReader");
  var readerSection = document.querySelector(".reader-section");
  if (storyReader && readerSection) {
    body.classList.add("aurelis-story");
    var readerShell = readerSection.querySelector(".reader-shell");
    var readerTop = readerSection.querySelector(".reader-top");
    var tools = document.createElement("div");
    tools.className = "reader-tools";
    tools.innerHTML = '<span class="reader-tools-label">Reading comfort</span><button class="reader-tool" type="button" data-reader-size="down" aria-label="Decrease text size">A−</button><button class="reader-tool" type="button" data-reader-size="up" aria-label="Increase text size">A+</button><button class="reader-tool" type="button" data-reader-theme aria-pressed="false">Night reading</button>';
    var singleReader = readerSection.querySelector(".single-reader");
    if (readerShell && singleReader) {
      if (readerTop) readerTop.insertAdjacentElement("afterend", tools);
      else readerShell.insertBefore(tools, singleReader);
    }

    var size = 1;
    function applySize() {
      storyReader.style.setProperty("--reader-font-size", size.toFixed(2) + "rem");
    }
    tools.querySelector('[data-reader-size="down"]').addEventListener("click", function () {
      size = Math.max(.9, Math.round((size - .05) * 100) / 100);
      applySize();
    });
    tools.querySelector('[data-reader-size="up"]').addEventListener("click", function () {
      size = Math.min(1.25, Math.round((size + .05) * 100) / 100);
      applySize();
    });
    tools.querySelector("[data-reader-theme]").addEventListener("click", function (event) {
      var enabled = body.classList.toggle("reading-night");
      event.currentTarget.setAttribute("aria-pressed", String(enabled));
      event.currentTarget.textContent = enabled ? "Day reading" : "Night reading";
    });

    if (readerShell && singleReader) {
      var progress = document.createElement("div");
      progress.className = "reader-progress";
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-label", "Story page progress");
      progress.setAttribute("aria-valuemin", "1");
      progress.setAttribute("aria-valuemax", "1");
      progress.setAttribute("aria-valuenow", "1");
      progress.innerHTML = '<div class="reader-progress-fill"></div>';
      readerShell.insertBefore(progress, singleReader);
      var fill = progress.querySelector(".reader-progress-fill");
      var indicator = document.getElementById("pageIndicator");
      function syncProgress() {
        var match = indicator && indicator.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        var current = match ? Number(match[1]) : 1;
        var total = match ? Number(match[2]) : 1;
        var value = total ? Math.min(100, current / total * 100) : 0;
        fill.style.width = value + "%";
        progress.setAttribute("aria-valuemax", String(Math.max(total, 1)));
        progress.setAttribute("aria-valuenow", String(Math.max(current, 1)));
      }
      syncProgress();
      if (indicator && window.MutationObserver) {
        new MutationObserver(syncProgress).observe(indicator, { childList: true, characterData: true, subtree: true });
      }
    }
    applySize();
  }

  var revealTargets = document.querySelectorAll(".hero-card, .room, .person, main .card, main .note, .closing-box");
  if (window.IntersectionObserver && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("aurelis-motion-ready");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.slice.call(revealTargets).forEach(function (element, index) {
      element.classList.add("aurelis-reveal");
      element.style.transitionDelay = (index % 3) * 65 + "ms";
      observer.observe(element);
    });
  }
})();