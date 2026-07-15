/* ECDC site scripts — vanilla JS, progressive enhancement.
   All interactive features degrade gracefully when JS is disabled. */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var backdrop = document.querySelector(".nav-backdrop");
  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      if (backdrop) backdrop.classList.toggle("open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Portfolio filter ---------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var items = document.querySelectorAll(".gallery-item");
  if (filterBtns.length && items.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        items.forEach(function (it) {
          var cats = (it.getAttribute("data-cat") || "").split(" ");
          var show = cat === "all" || cats.indexOf(cat) !== -1;
          it.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-caption");
    var triggers = [];
    var current = -1;

    function refreshTriggers() {
      triggers = Array.prototype.filter.call(
        document.querySelectorAll("[data-lightbox]"),
        function (el) { return !el.classList.contains("is-hidden"); }
      );
    }
    function show(i) {
      refreshTriggers();
      if (i < 0) i = triggers.length - 1;
      if (i >= triggers.length) i = 0;
      current = i;
      var el = triggers[i];
      var full = el.getAttribute("data-lightbox");
      var alt = el.getAttribute("data-caption") || (el.querySelector("img") ? el.querySelector("img").alt : "");
      lbImg.setAttribute("src", full);
      lbImg.setAttribute("alt", alt);
      if (lbCap) lbCap.textContent = alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    document.querySelectorAll("[data-lightbox]").forEach(function (el, idx) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        refreshTriggers();
        show(triggers.indexOf(el));
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", close);
    var nextBtn = lightbox.querySelector(".lb-next");
    var prevBtn = lightbox.querySelector(".lb-prev");
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc-item");
      var panel = item.querySelector(".acc-panel");
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      item.classList.toggle("open", !expanded);
      if (expanded) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + 40 + "px";
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var form = document.querySelector("#quote-form");
  if (form) {
    var status = document.querySelector("#form-status");
    function setError(field, on) {
      field.classList.toggle("invalid", on);
    }
    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function validate() {
      var ok = true;
      form.querySelectorAll("[data-required]").forEach(function (input) {
        var field = input.closest(".field");
        var val = (input.value || "").trim();
        var bad = !val;
        if (!bad && input.type === "email") bad = !validEmail(val);
        if (!bad && input.name === "phone") bad = val.replace(/[^0-9]/g, "").length < 10;
        setError(field, bad);
        if (bad) ok = false;
      });
      return ok;
    }
    var submitBtn = form.querySelector("[type=submit]");
    // AJAX submit: post to Formspree, then redirect to our own thank-you page.
    // This keeps the custom thank-you redirect working on Formspree's free plan
    // (their _next redirect is a paid feature). Falls back to a normal POST if
    // fetch is unavailable.
    form.addEventListener("submit", function (e) {
      if (!validate()) {
        e.preventDefault();
        if (status) {
          status.className = "form-status bad show";
          status.textContent = "Please correct the highlighted fields and try again.";
        }
        return;
      }
      if (!window.fetch || !window.FormData) return; // no-JS/old-browser fallback: normal POST
      e.preventDefault();
      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.className = "form-status show";
        status.textContent = "Sending your request…";
      }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (res) {
        if (res.ok) {
          window.location.href = "thank-you.html";
        } else {
          return res.json().then(function (data) {
            var msg = (data && data.errors && data.errors.map(function (x) { return x.message; }).join(", ")) || "";
            throw new Error(msg);
          });
        }
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (status) {
          status.className = "form-status bad show";
          status.textContent = "Sorry — your request couldn't be sent. Please call (850) 914-0050 or try again.";
        }
      });
    });
    form.querySelectorAll("[data-required]").forEach(function (input) {
      input.addEventListener("blur", function () {
        var field = input.closest(".field");
        var val = (input.value || "").trim();
        var bad = !val;
        if (!bad && input.type === "email") bad = !validEmail(val);
        if (!bad && input.name === "phone") bad = val.replace(/[^0-9]/g, "").length < 10;
        setError(field, bad);
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
