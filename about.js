(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const consolePanel = document.getElementById("aboutConsole");
  const codeTarget = document.getElementById("aboutCode");
  const statusFill = document.getElementById("aboutStatusFill");
  const statusText = document.getElementById("aboutStatusText");

  const aboutSections = [
    ...document.querySelectorAll(".about-story-card")
  ];

  const aboutLinks = [
    ...document.querySelectorAll(".about-nav a")
  ];

  const sleep = (ms) =>
    new Promise((resolve) => window.setTimeout(resolve, ms));

  const codeLines = [
    '<span class="about-code-comment">// Moxi Corp business profile</span>',
    '<span class="about-code-key">const</span> moxiCorp = <span class="about-code-function">buildBusiness</span>({',
    '  location: <span class="about-code-string">"Australia"</span>,',
    '  development: <span class="about-code-string">"custom"</span>,',
    '  responsive: <span class="about-code-value">true</span>,',
    '  communication: <span class="about-code-string">"direct"</span>,',
    '  animations: <span class="about-code-value">true</span>,',
    '  conversionFocus: <span class="about-code-value">true</span>',
    '});',
    '',
    '<span class="about-code-function">launch</span>(moxiCorp);<span class="about-console-cursor"></span>'
  ];

  async function animateAboutConsole() {
    if (!codeTarget) return;

    if (reduceMotion) {
      codeTarget.innerHTML = codeLines.join("\n");
      if (statusFill) statusFill.style.width = "100%";
      if (statusText) statusText.textContent = "Profile ready";
      return;
    }

    while (true) {
      codeTarget.innerHTML = "";
      if (statusFill) statusFill.style.width = "0%";
      if (statusText) statusText.textContent = "Loading profile";

      const stages = [
        { at: 2, width: 22, text: "Australian business" },
        { at: 4, width: 45, text: "Custom development" },
        { at: 6, width: 68, text: "Direct communication" },
        { at: 8, width: 86, text: "Conversion focused" },
        { at: 10, width: 100, text: "Profile ready" }
      ];

      for (let index = 0; index < codeLines.length; index += 1) {
        codeTarget.innerHTML += `${codeLines[index]}\n`;

        const stage = stages.find((item) => item.at === index);

        if (stage) {
          if (statusFill) statusFill.style.width = `${stage.width}%`;
          if (statusText) statusText.textContent = stage.text;
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

  document
    .querySelectorAll(".about-story-card, .about-work-card")
    .forEach((card) => {
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

  const aboutObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        aboutLinks.forEach((link) => {
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

  aboutSections.forEach((section) =>
    aboutObserver.observe(section)
  );

  aboutLinks.forEach((link) => {
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
    animateAboutConsole
  );
})();
