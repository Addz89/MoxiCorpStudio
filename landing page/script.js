(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  function initScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.prepend(progressBar);

    let frame = 0;
    const update = () => {
      const root = document.documentElement;
      const distance = Math.max(root.scrollHeight - root.clientHeight, 1);
      const percentage = Math.min(100, Math.max(0, (root.scrollTop / distance) * 100));
      progressBar.style.width = `${percentage}%`;
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
  }

  function initNavigation() {
    const menuButton = document.getElementById("menuButton");
    const navLinks = document.getElementById("navLinks");
    if (!menuButton || !navLinks) return;

    const closeMenu = ({ returnFocus = false } = {}) => {
      navLinks.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menuButton.textContent = "☰";
      if (returnFocus) menuButton.focus();
    };

    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("active")) {
        closeMenu({ returnFocus: true });
      }
    });

    document.addEventListener("pointerdown", (event) => {
      if (!navLinks.classList.contains("active")) return;
      if (!navLinks.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    }, { passive: true });
  }

  function initReveals() {
    const elements = [...document.querySelectorAll(".reveal")];
    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });

    elements.forEach((element) => observer.observe(element));
  }

  function initMarquee() {
    const marquee = document.querySelector(".marquee");
    if (!marquee || reduceMotion || marquee.dataset.cloned === "true") return;
    const originalItems = [...marquee.children];
    originalItems.forEach((item) => marquee.appendChild(item.cloneNode(true)));
    marquee.dataset.cloned = "true";
  }

  async function initTypewriter() {
    const title = document.querySelector(".typewriter-title");
    const lines = title ? [...title.querySelectorAll(".type-line")] : [];
    if (!lines.length) return;

    const lineText = lines.map((line) => line.dataset.text || line.textContent);

    if (reduceMotion) {
      lines.forEach((line, index) => { line.textContent = lineText[index]; });
      return;
    }

    lines.forEach((line) => { line.textContent = ""; });
    await sleep(350);
    for (const [index, line] of lines.entries()) {
      const text = lineText[index];
      line.classList.add("typing");

      for (const character of text) {
        line.textContent += character;
        const pause = character === " " ? 20 : 36;
        await sleep(pause);
      }

      line.classList.remove("typing");
      await sleep(90);
    }
  }

  function initHeroSparks() {
    const hero = document.querySelector(".hero");
    if (!hero || reduceMotion || hero.querySelector(".type-spark")) return;

    const count = window.matchMedia("(max-width: 700px)").matches ? 4 : 9;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const spark = document.createElement("span");
      spark.className = "type-spark";
      spark.setAttribute("aria-hidden", "true");
      spark.style.setProperty("--spark-x", `${Math.random() * 96 + 2}%`);
      spark.style.setProperty("--spark-y", `${Math.random() * 76 + 12}%`);
      spark.style.setProperty("--spark-size", `${Math.random() * 2.2 + 1.5}px`);
      spark.style.setProperty("--spark-speed", `${Math.random() * 4 + 7}s`);
      spark.style.setProperty("--spark-delay", `${-Math.random() * 8}s`);
      fragment.appendChild(spark);
    }
    hero.appendChild(fragment);
  }

  function initPackageSelection() {
    const packageSelect = document.getElementById("package");
    if (!packageSelect) return;

    document.querySelectorAll("[data-package]").forEach((link) => {
      link.addEventListener("click", () => {
        const value = link.dataset.package;
        const matchingOption = [...packageSelect.options].find((option) => option.textContent.trim() === value);
        if (matchingOption) packageSelect.value = matchingOption.value;
      });
    });
  }

  function initQrFallback() {
    const image = document.querySelector("[data-qr-image]");
    const container = image?.closest(".quote-qr");
    if (!image || !container) return;

    const showFallback = () => container.classList.add("is-missing");
    const showImage = () => container.classList.remove("is-missing");
    image.addEventListener("error", showFallback);
    image.addEventListener("load", showImage);
    if (image.complete) image.naturalWidth > 0 ? showImage() : showFallback();
  }

  function initFormFeedback() {
    const form = document.querySelector(".quote-form");
    const button = form?.querySelector("button[type='submit']");
    if (!form || !button) return;

    form.addEventListener("submit", () => {
      button.textContent = "Sending your enquiry…";
      button.setAttribute("aria-busy", "true");
    });
  }

  function initPageDetails() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());

    document.addEventListener("visibilitychange", () => {
      document.body.classList.toggle("animation-paused", document.hidden);
    });
  }

  function init() {
    initScrollProgress();
    initNavigation();
    initReveals();
    initMarquee();
    initHeroSparks();
    initPackageSelection();
    initQrFallback();
    initFormFeedback();
    initPageDetails();
    initTypewriter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
