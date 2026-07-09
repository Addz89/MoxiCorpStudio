(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const consolePanel = document.getElementById("portfolioConsole");
  const statusFill = document.getElementById("portfolioStatusFill");
  const statusText = document.getElementById("portfolioStatusText");

  const projectSections = [...document.querySelectorAll(".case-study")];
  const projectLinks = [...document.querySelectorAll(".portfolio-nav a")];

  const sleep = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  async function animatePortfolioStatus() {
    if (!statusFill || !statusText) return;

    if (reduceMotion) {
      statusFill.style.width = "100%";
      statusText.textContent = "5 projects ready";
      return;
    }

    while (true) {
      const stages = [
        { width: 18, text: "Loading Ashar Music" },
        { width: 38, text: "Loading Cleaning Co" },
        { width: 58, text: "Loading Clothing Brand" },
        { width: 78, text: "Loading Real Estate" },
        { width: 100, text: "5 projects ready" }
      ];

      statusFill.style.width = "0%";
      statusText.textContent = "Loading projects...";

      for (const stage of stages) {
        await sleep(650);
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

  document.querySelectorAll(".case-study").forEach((card) => {
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

  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        projectLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.28,
      rootMargin: "-100px 0px -52% 0px"
    }
  );

  projectSections.forEach((section) =>
    projectObserver.observe(section)
  );

  projectLinks.forEach((link) => {
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
    animatePortfolioStatus
  );
})();
