document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && navMenu) {
  const setMenuState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    navMenu.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

const pageName = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-menu a").forEach((link) => {
  const linkName = link.getAttribute("href")?.split("#")[0];
  const isCurrent = linkName === pageName;
  link.classList.toggle("active", isCurrent);
  if (isCurrent) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  if (!question || !answer) return;

  const itemIndex = [...document.querySelectorAll(".faq-item")].indexOf(item) + 1;
  const questionId = question.id || `faq-question-${itemIndex}`;
  const answerId = answer.id || `faq-answer-${itemIndex}`;

  question.id = questionId;
  question.setAttribute("aria-controls", answerId);
  answer.id = answerId;
  answer.setAttribute("role", "region");
  answer.setAttribute("aria-labelledby", questionId);

  const setItemState = (targetItem, isOpen) => {
    targetItem.classList.toggle("open", isOpen);
    targetItem.querySelector(".faq-question")?.setAttribute("aria-expanded", String(isOpen));
    targetItem.querySelector(".faq-answer")?.setAttribute("aria-hidden", String(!isOpen));
  };

  setItemState(item, item.classList.contains("open"));

  question.addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    const group = item.closest(".faq-list");

    group?.querySelectorAll(".faq-item.open").forEach((openItem) => {
      setItemState(openItem, false);
    });

    if (!wasOpen) setItemState(item, true);
  });
});

const faqGroups = [...document.querySelectorAll(".faq-group[id]")];
const faqTopicLinks = [...document.querySelectorAll(".faq-nav a[href^='#']")];

if (faqGroups.length && faqTopicLinks.length && "IntersectionObserver" in window) {
  const setActiveFaqTopic = (groupId) => {
    faqTopicLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${groupId}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const faqTopicObserver = new IntersectionObserver(
    (entries) => {
      const visibleGroup = entries.find((entry) => entry.isIntersecting);
      if (visibleGroup?.target.id) setActiveFaqTopic(visibleGroup.target.id);
    },
    { rootMargin: "-24% 0px -62%", threshold: 0 }
  );

  faqGroups.forEach((group) => faqTopicObserver.observe(group));
  faqTopicLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const groupId = link.getAttribute("href")?.slice(1);
      if (groupId) setActiveFaqTopic(groupId);
    });
  });

  setActiveFaqTopic(faqGroups[0].id);
}

const projectForm = document.getElementById("projectForm");
if (projectForm) {
  const requiredFields = [...projectForm.querySelectorAll("[required]")];
  const progressFill = document.getElementById("formProgressFill");
  const progressText = document.getElementById("formProgressText");
  const formStatus = document.getElementById("formStatus");
  const packageSelect = document.getElementById("package");
  const selectedPackage = new URLSearchParams(window.location.search).get("package");

  if (selectedPackage && packageSelect) {
    const matchingOption = [...packageSelect.options].find((option) => option.value === selectedPackage);
    if (matchingOption) packageSelect.value = selectedPackage;
  }

  const updateProgress = () => {
    const completed = requiredFields.filter((field) => field.value.trim()).length;
    const progress = requiredFields.length ? Math.round((completed / requiredFields.length) * 100) : 0;

    requiredFields.forEach((field) => {
      const isComplete = Boolean(field.value.trim()) && field.checkValidity();
      field.closest(".field")?.classList.toggle("field-valid", isComplete);
    });

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
    formStatus?.classList.toggle("show", progress === 100);
  };

  projectForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", updateProgress);
    field.addEventListener("change", updateProgress);
  });

  projectForm.addEventListener("submit", () => {
    const button = projectForm.querySelector("button[type='submit']");
    if (button) {
      button.disabled = true;
      button.textContent = "Sending enquiry…";
    }
  });

  updateProgress();
}

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});
