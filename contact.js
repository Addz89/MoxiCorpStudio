(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const form = document.getElementById("projectForm");
  const submitButton = document.getElementById("submitButton");
  const progressFill = document.getElementById("formProgressFill");
  const progressText = document.getElementById("formProgressText");
  const successMessage = document.getElementById("successMessage");
  const statusBoard = document.getElementById("contactStatusBoard");

  // Form completion progress and valid-field indicators.
  if (form) {
    const fields = [
      ...form.querySelectorAll(
        'input:not([type="hidden"]):not([name="_gotcha"]), select, textarea'
      )
    ];

    const requiredFields = fields.filter((field) => field.required);

    const fieldHasValue = (field) => {
      if (!field.value.trim()) return false;
      return field.checkValidity();
    };

    const updateProgress = () => {
      const completed = fields.filter(fieldHasValue).length;
      const percentage = Math.round((completed / fields.length) * 100);

      if (progressFill) progressFill.style.width = `${percentage}%`;
      if (progressText) progressText.textContent = `${percentage}%`;

      fields.forEach((field) => {
        field.closest(".field")?.classList.toggle("field-valid", fieldHasValue(field));
      });

      const requiredComplete = requiredFields.every(fieldHasValue);
      successMessage?.classList.toggle("show", requiredComplete);
    };

    fields.forEach((field) => {
      field.addEventListener("input", updateProgress);
      field.addEventListener("change", updateProgress);
      field.addEventListener("blur", updateProgress);
    });

    updateProgress();

    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      submitButton?.classList.add("loading");
      submitButton?.setAttribute("aria-busy", "true");
    });
  }

  // 3D contact-process board.
  if (statusBoard && !coarsePointer && !reduceMotion) {
    statusBoard.addEventListener("pointermove", (event) => {
      const rect = statusBoard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      statusBoard.style.transform =
        `perspective(1050px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });

    statusBoard.addEventListener("pointerleave", () => {
      statusBoard.style.transform = "";
    });
  }

  // Click feedback on the status steps.
  document.querySelectorAll(".status-step").forEach((step) => {
    step.addEventListener("click", () => {
      if (reduceMotion) return;

      step.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.025)" },
          { transform: "scale(1)" }
        ],
        {
          duration: 420,
          easing: "cubic-bezier(.16,1,.3,1)"
        }
      );
    });
  });

  // Spotlight movement for contact cards.
  document
    .querySelectorAll(".contact-panel, .contact-stat")
    .forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
      });
    });
})();
