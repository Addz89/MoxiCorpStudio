(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const consolePanel = document.getElementById("servicesConsole");
  const statusFill = document.getElementById("servicesStatusFill");
  const statusText = document.getElementById("servicesStatusText");

  const serviceSections = [...document.querySelectorAll(".service-card")];
  const serviceLinks = [...document.querySelectorAll(".services-nav a")];

  const sleep = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  async function animateServicesStatus() {
    if (!statusFill || !statusText) return;

    if (reduceMotion) {
      statusFill.style.width = "100%";
      statusText.textContent = "6 services ready";
      return;
    }

    while (true) {
      const stages = [
        { width: 18, text: "Loading custom design" },
        { width: 35, text: "Loading mobile layouts" },
        { width: 52, text: "Loading SEO structure" },
        { width: 69, text: "Loading Stripe flow" },
        { width: 84, text: "Loading content system" },
        { width: 100, text: "6 services ready" }
      ];

      statusFill.style.width = "0%";
      statusText.textContent = "Loading services...";

      for (const stage of stages) {
        await sleep(560);
        statusFill.style.width = `${stage.width}%`;
        statusText.textContent = stage.text;
      }

      await sleep(1900);
    }
  }

  if (consolePanel && !coarsePointer && !reduceMotion) {
    consolePanel.addEventListener("pointermove", (event) => {
      const rect = consolePanel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      consolePanel.style.transform =
        `perspective(1050px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });

    consolePanel.addEventListener("pointerleave", () => {
      consolePanel.style.transform = "";
    });
  }

  serviceSections.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      card.style.setProperty(
        "--mouse-x",
        `${event.clientX - rect.left}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${event.clientY - rect.top}px`
      );
    });
  });

  const serviceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        serviceLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.32,
      rootMargin: "-100px 0px -52% 0px"
    }
  );

  serviceSections.forEach((section) =>
    serviceObserver.observe(section)
  );

  serviceLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(
        link.getAttribute("href")
      );

      if (!target || reduceMotion) return;

      window.setTimeout(() => {
        target.animate(
          [
            {
              filter:
                "drop-shadow(0 0 0 rgba(47,231,255,0))"
            },
            {
              filter:
                "drop-shadow(0 0 26px rgba(47,231,255,.24))"
            },
            {
              filter:
                "drop-shadow(0 0 0 rgba(47,231,255,0))"
            }
          ],
          {
            duration: 950,
            easing: "ease-out"
          }
        );
      }, 420);
    });
  });

  document.addEventListener(
    "DOMContentLoaded",
    animateServicesStatus
  );
})();
