(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function createParticles() {
    const field = document.getElementById("particleField");

    if (!field || reduceMotion) return;

    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const count = mobile ? 6 : 12;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.setProperty("--x", `${Math.random() * 96 + 2}%`);
      particle.style.setProperty("--y", `${Math.random() * 86 + 8}%`);
      particle.style.setProperty("--size", `${Math.random() * 3.8 + 2}px`);
      particle.style.setProperty("--speed", `${Math.random() * 5 + 5}s`);
      particle.style.setProperty("--delay", `${-Math.random() * 10}s`);
      fragment.appendChild(particle);
    }

    field.appendChild(fragment);
  }

  async function typeThankYou() {
    const element = document.querySelector(".typed-thanks");

    if (!element) return;

    const text = element.dataset.text || "THANK YOU";

    if (reduceMotion) {
      element.textContent = text;
      element.classList.add("complete");
      return;
    }

    element.textContent = "";
    element.classList.add("typing");

    await sleep(520);

    for (const character of text) {
      element.textContent += character;

      await sleep(character === " " ? 22 : 55);
    }

    await sleep(240);
    element.classList.remove("typing");
    element.classList.add("complete");
  }

  document.addEventListener("DOMContentLoaded", () => {
    createParticles();
    typeThankYou();
  });
})();
