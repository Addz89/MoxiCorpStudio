(() => {
  "use strict";

  if (window.__moxiMotionBudgetLoaded) return;
  window.__moxiMotionBudgetLoaded = true;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animatedSections = document.querySelectorAll(
    ".hero, .urgent-strip, .benefits-strip, .standards-section, .work-section, .quote-section"
  );

  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("animation-paused", !entry.isIntersecting);
    });
  }, { rootMargin: "250px 0px" });

  animatedSections.forEach((section) => observer.observe(section));
})();
