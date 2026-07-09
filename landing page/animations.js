(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealSelectors = [
    ".section-title",
    ".package-card",
    ".benefits-strip",
    ".work-card",
    ".human-card",
    ".human-points > div",
    ".process-grid article",
    ".quote-panel",
    ".promo-bar-inner"
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(","));

  revealElements.forEach((element) => {
    element.classList.add("animate-on-scroll");
  });

  if (reduceMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));

  const heroMedia = document.querySelector(".hero-media");

  if (heroMedia && window.matchMedia("(pointer: fine)").matches) {
    heroMedia.classList.add("parallax-active");

    heroMedia.addEventListener("pointermove", (event) => {
      const rect = heroMedia.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      heroMedia.style.transform =
        `perspective(1000px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
    });

    heroMedia.addEventListener("pointerleave", () => {
      heroMedia.style.transform = "";
    });
  }

  document.querySelectorAll(".package-card, .work-card, .process-grid article").forEach((card) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-9px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
})();
