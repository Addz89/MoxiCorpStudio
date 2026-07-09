(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const consolePanel = document.getElementById("processConsole");
  const codeTarget = document.getElementById("processCode");
  const progressFill = document.getElementById("buildStatusFill");
  const progressText = document.getElementById("buildStatusText");
  const processSections = [...document.querySelectorAll(".process-step")];
  const processLinks = [...document.querySelectorAll(".process-nav a")];

  const buildLines = [
    '<span class="code-comment">// Moxi Corp website build system</span>',
    '<span class="code-key">const</span> project = <span class="code-function">createWebsite</span>({',
    '  discovery: <span class="code-value">true</span>,',
    '  structure: <span class="code-string">"planned"</span>,',
    '  design: <span class="code-string">"custom"</span>,',
    '  development: <span class="code-string">"responsive"</span>,',
    '  animations: <span class="code-value">true</span>,',
    '  testing: <span class="code-string">"complete"</span>,',
    '  launch: <span class="code-string">"ready"</span>',
    '});',
    '',
    '<span class="code-function">deploy</span>(project);<span class="console-cursor"></span>'
  ];

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  // Animated code and progress sequence.
  async function animateBuildConsole() {
    if (!codeTarget) return;

    if (reduceMotion) {
      codeTarget.innerHTML = buildLines.join("\n");
      if (progressFill) progressFill.style.width = "100%";
      if (progressText) progressText.textContent = "Launch ready";
      return;
    }

    while (true) {
      codeTarget.innerHTML = "";
      if (progressFill) progressFill.style.width = "0%";
      if (progressText) progressText.textContent = "Starting build";

      const statuses = [
        { at: 2, width: 18, text: "Discovery complete" },
        { at: 4, width: 38, text: "Structure mapped" },
        { at: 6, width: 58, text: "Design approved" },
        { at: 8, width: 78, text: "Development complete" },
        { at: 11, width: 100, text: "Launch ready" }
      ];

      for (let index = 0; index < buildLines.length; index += 1) {
        codeTarget.innerHTML += `${buildLines[index]}\n`;

        const status = statuses.find((item) => item.at === index);
        if (status) {
          if (progressFill) progressFill.style.width = `${status.width}%`;
          if (progressText) progressText.textContent = status.text;
        }

        await sleep(135);
      }

      await sleep(2200);

      codeTarget.style.opacity = "0";
      await sleep(350);
      codeTarget.style.opacity = "1";
    }
  }

  // 3D console movement.
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

  // Timeline spotlight tracking.
  document.querySelectorAll(".step-panel").forEach((panel) => {
    panel.addEventListener("pointermove", (event) => {
      const rect = panel.getBoundingClientRect();

      panel.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      panel.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });

  // Active process navigation while scrolling.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        processLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-100px 0px -52% 0px"
    }
  );

  processSections.forEach((section) => sectionObserver.observe(section));

  // Brief pulse when jumping to a build stage.
  processLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target || reduceMotion) return;

      window.setTimeout(() => {
        target.animate(
          [
            { filter: "drop-shadow(0 0 0 rgba(47,231,255,0))" },
            { filter: "drop-shadow(0 0 24px rgba(47,231,255,.22))" },
            { filter: "drop-shadow(0 0 0 rgba(47,231,255,0))" }
          ],
          {
            duration: 950,
            easing: "ease-out"
          }
        );
      }, 420);
    });
  });

  // Step-badge click feedback.
  document.querySelectorAll(".step-badge").forEach((badge) => {
    badge.addEventListener("click", () => {
      if (reduceMotion) return;

      badge.animate(
        [
          { transform: "scale(1) rotate(0)" },
          { transform: "scale(1.15) rotate(-8deg)" },
          { transform: "scale(1) rotate(0)" }
        ],
        {
          duration: 480,
          easing: "cubic-bezier(.16,1,.3,1)"
        }
      );
    });
  });

  document.addEventListener("DOMContentLoaded", animateBuildConsole);
})();
