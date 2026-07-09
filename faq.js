(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const items = [...document.querySelectorAll(".faq-item")];
  const groups = [...document.querySelectorAll(".faq-group")];
  const search = document.getElementById("faqSearch");
  const noResults = document.getElementById("noResults");
  const consolePanel = document.getElementById("faqConsole");

  // Accordion
  items.forEach((item) => {
    const button = item.querySelector(".faq-question");

    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      items.forEach((otherItem) => {
        otherItem.classList.remove("active");
        otherItem
          .querySelector(".faq-question")
          ?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Search filter
  if (search) {
    search.addEventListener("input", () => {
      const term = search.value.trim().toLowerCase();
      let visibleCount = 0;

      groups.forEach((group) => {
        let groupHasMatch = false;

        group.querySelectorAll(".faq-item").forEach((item) => {
          const text = item.textContent.toLowerCase();
          const match = !term || text.includes(term);

          item.hidden = !match;

          if (match) {
            visibleCount += 1;
            groupHasMatch = true;
          }
        });

        group.hidden = !groupHasMatch;
      });

      noResults?.classList.toggle("show", visibleCount === 0);
    });
  }

  // Spotlight hover for FAQ cards
  items.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();

      item.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      item.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });

  // 3D console tilt
  if (consolePanel && !coarsePointer && !reduceMotion) {
    consolePanel.addEventListener("pointermove", (event) => {
      const rect = consolePanel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      consolePanel.style.transform =
        `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });

    consolePanel.addEventListener("pointerleave", () => {
      consolePanel.style.transform = "";
    });
  }

  // Active sidebar category while scrolling
  const categoryLinks = [...document.querySelectorAll(".faq-category-list a")];

  const categoryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        categoryLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      threshold: 0.25,
      rootMargin: "-100px 0px -55% 0px"
    }
  );

  groups.forEach((group) => categoryObserver.observe(group));

  // Smooth category navigation with brief highlight
  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      window.setTimeout(() => {
        target.animate(
          [
            { filter: "drop-shadow(0 0 0 rgba(47,231,255,0))" },
            { filter: "drop-shadow(0 0 22px rgba(47,231,255,.20))" },
            { filter: "drop-shadow(0 0 0 rgba(47,231,255,0))" }
          ],
          {
            duration: 950,
            easing: "ease-out"
          }
        );
      }, 450);
    });
  });
})();
