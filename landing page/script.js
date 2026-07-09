(() => {
  "use strict";

  const menuButton = document.getElementById("menuButton");
  const navLinks = document.getElementById("navLinks");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });
  }

  const title = document.querySelector(".typewriter-title");
  const lines = title ? [...title.querySelectorAll(".type-line")] : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function getTiming() {
    const mobile = window.matchMedia("(max-width: 640px)").matches;

    return {
      typeSpeed: mobile ? 52 : 64,
      eraseSpeed: mobile ? 24 : 28,
      linePause: mobile ? 135 : 175,
      finishedPause: mobile ? 1900 : 2300,
      restartPause: 420
    };
  }

  async function typeLine(line, speed) {
    const text = line.dataset.text || "";
    line.textContent = "";
    line.classList.add("typing");

    for (const character of text) {
      line.textContent += character;

      const naturalVariation = Math.floor(Math.random() * 28) - 8;
      const punctuationPause = /[.,!?]/.test(character) ? 120 : 0;

      await sleep(Math.max(22, speed + naturalVariation + punctuationPause));
    }

    line.classList.remove("typing");
  }

  async function eraseLine(line, speed) {
    line.classList.add("typing");

    while (line.textContent.length > 0) {
      line.textContent = line.textContent.slice(0, -1);
      await sleep(speed);
    }

    line.classList.remove("typing");
  }

  async function runTypewriter() {
    if (!title || lines.length === 0) return;

    if (reduceMotion) {
      lines.forEach((line) => {
        line.textContent = line.dataset.text || "";
      });
      return;
    }

    const shouldLoop = title.dataset.typewriterLoop !== "false";

    do {
      const timing = getTiming();

      title.classList.remove("is-erasing", "is-complete");

      for (const line of lines) {
        await typeLine(line, timing.typeSpeed);
        await sleep(timing.linePause);
      }

      title.classList.add("is-complete");
      lines[lines.length - 1]?.classList.add("typing");

      await sleep(timing.finishedPause);

      lines[lines.length - 1]?.classList.remove("typing");
      title.classList.remove("is-complete");

      if (!shouldLoop) break;

      title.classList.add("is-erasing");

      for (const line of [...lines].reverse()) {
        await eraseLine(line, timing.eraseSpeed);
        await sleep(75);
      }

      title.classList.remove("is-erasing");
      await sleep(timing.restartPause);
    } while (shouldLoop);
  }

  function createHeroSparks() {
    const hero = document.querySelector(".hero");

    if (!hero || reduceMotion || hero.querySelector(".type-spark")) return;

    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const sparkCount = mobile ? 14 : 22;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < sparkCount; index += 1) {
      const spark = document.createElement("span");
      spark.className = "type-spark";
      spark.setAttribute("aria-hidden", "true");

      spark.style.setProperty("--spark-x", `${Math.random() * 96 + 2}%`);
      spark.style.setProperty("--spark-y", `${Math.random() * 78 + 12}%`);
      spark.style.setProperty("--spark-size", `${Math.random() * 3.5 + 2}px`);
      spark.style.setProperty("--spark-speed", `${Math.random() * 5 + 5}s`);
      spark.style.setProperty("--spark-delay", `${-Math.random() * 9}s`);

      fragment.appendChild(spark);
    }

    hero.appendChild(fragment);
  }

  document.addEventListener("DOMContentLoaded", () => {
    createHeroSparks();
    runTypewriter();
  });
})();
