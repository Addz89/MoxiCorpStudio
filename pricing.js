(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const consolePanel = document.getElementById("priceConsole");
  const codeTarget = document.getElementById("pricingCode");
  const progressFill = document.getElementById("pricingStatusFill");
  const progressText = document.getElementById("pricingStatusText");

  const pricingSections = [
    ...document.querySelectorAll(".pricing-page-grid .price-card")
  ];

  const pricingLinks = [
    ...document.querySelectorAll(".pricing-nav a")
  ];

  const sleep = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const codeLines = [
    '<span class="pricing-code-comment">// Moxi Corp package selector</span>',
    '<span class="pricing-code-key">const</span> packageMatch = <span class="pricing-code-function">selectPackage</span>({',
    '  starter: <span class="pricing-code-string">"$409"</span>,',
    '  growth: <span class="pricing-code-string">"$650"</span>,',
    '  elite: <span class="pricing-code-string">"$900"</span>,',
    '  responsive: <span class="pricing-code-value">true</span>,',
    '  customBuild: <span class="pricing-code-value">true</span>,',
    '  stripeCheckout: <span class="pricing-code-value">true</span>',
    '});',
    '',
    '<span class="pricing-code-function">launchCheckout</span>(packageMatch);<span class="pricing-console-cursor"></span>'
  ];

  async function animatePricingConsole() {
    if (!codeTarget) return;

    if (reduceMotion) {
      codeTarget.innerHTML = codeLines.join("\n");
      if (progressFill) progressFill.style.width = "100%";
      if (progressText) progressText.textContent = "Package ready";
      return;
    }

    while (true) {
      codeTarget.innerHTML = "";
      if (progressFill) progressFill.style.width = "0%";
      if (progressText) progressText.textContent = "Reviewing needs";

      const statuses = [
        { at: 2, width: 26, text: "Starter available" },
        { at: 3, width: 52, text: "Growth available" },
        { at: 4, width: 76, text: "Elite available" },
        { at: 10, width: 100, text: "Package ready" }
      ];

      for (let index = 0; index < codeLines.length; index += 1) {
        codeTarget.innerHTML += `${codeLines[index]}\n`;

        const status = statuses.find((item) => item.at === index);

        if (status) {
          if (progressFill) progressFill.style.width = `${status.width}%`;
          if (progressText) progressText.textContent = status.text;
        }

        await sleep(145);
      }

      await sleep(2200);
      codeTarget.style.opacity = "0";
      await sleep(350);
      codeTarget.style.opacity = "1";
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

  document.querySelectorAll(".price-card").forEach((card) => {
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

  const pricingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        pricingLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-100px 0px -50% 0px"
    }
  );

  pricingSections.forEach((section) =>
    pricingObserver.observe(section)
  );

  pricingLinks.forEach((link) => {
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
    animatePricingConsole
  );
})();
