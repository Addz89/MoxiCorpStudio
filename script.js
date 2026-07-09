(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  // Navigation
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const siteNav = document.querySelector(".site-nav");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("active");
      menuBtn.classList.toggle("active", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll progress + nav state
  const scrollProgress = document.getElementById("scrollProgress");

  const updateScrollUI = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${percentage}%`;
    if (siteNav) siteNav.classList.toggle("scrolled", window.scrollY > 35);
  };

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // Cursor glow
  const cursorLight = document.getElementById("cursorLight");

  if (cursorLight && !coarsePointer && !reduceMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      cursorLight.style.left = `${currentX}px`;
      cursorLight.style.top = `${currentY}px`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }

  // Reveal animations
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    if (reduceMotion) {
      element.classList.add("visible");
    } else {
      revealObserver.observe(element);
    }
  });

  // Counters
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count || 0);
        const prefix = element.dataset.prefix || "";
        const suffix = element.dataset.suffix || "";
        const duration = 1300;
        const start = performance.now();

        const update = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          element.textContent = `${prefix}${value}${suffix}`;

          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        counterObserver.unobserve(element);
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach((element) => counterObserver.observe(element));

  // Spotlight cards
  document.querySelectorAll(".spotlight-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });

  // Tilt cards
  if (!coarsePointer && !reduceMotion) {
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(950px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-8px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Magnetic buttons
  if (!coarsePointer && !reduceMotion) {
    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        element.style.transform = `translate(${x * 0.1}px, ${y * 0.14}px)`;
      });

      element.addEventListener("pointerleave", () => {
        element.style.transform = "";
      });
    });
  }

  // Device parallax
  const deviceStage = document.getElementById("deviceStage");

  if (deviceStage && !coarsePointer && !reduceMotion) {
    deviceStage.addEventListener("pointermove", (event) => {
      const rect = deviceStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      deviceStage.style.transform =
        `perspective(1200px) rotateX(${y * -2.5}deg) rotateY(${x * 3.5}deg)`;
    });

    deviceStage.addEventListener("pointerleave", () => {
      deviceStage.style.transform = "";
    });
  }

  // Animated code typing
  const codeTarget = document.getElementById("animatedCode");
  const codeLines = [
    '<span class="code-comment">// A website built to convert</span>',
    '<span class="code-tag">&lt;section</span> class=<span class="code-string">"business-site"</span><span class="code-tag">&gt;</span>',
    '  <span class="code-tag">&lt;h1&gt;</span>Grow your business<span class="code-tag">&lt;/h1&gt;</span>',
    '  <span class="code-tag">&lt;button&gt;</span>Get a quote<span class="code-tag">&lt;/button&gt;</span>',
    '<span class="code-tag">&lt;/section&gt;</span>',
    '',
    '<span class="code-key">const</span> website = build({',
    '  design: <span class="code-string">"custom"</span>,',
    '  mobile: <span class="code-value">true</span>,',
    '  speed: <span class="code-string">"fast"</span>,',
    '  payments: <span class="code-value">true</span>,',
    '  leads: <span class="code-string">"ready"</span>',
    '});'
  ];

  async function typeCode() {
    if (!codeTarget) return;

    if (reduceMotion) {
      codeTarget.innerHTML = codeLines.join("\n");
      return;
    }

    while (true) {
      codeTarget.innerHTML = "";

      for (const line of codeLines) {
        codeTarget.innerHTML += `${line}\n`;
        await new Promise((resolve) => setTimeout(resolve, 110));
      }

      await new Promise((resolve) => setTimeout(resolve, 1800));
      codeTarget.style.opacity = "0";
      await new Promise((resolve) => setTimeout(resolve, 350));
      codeTarget.style.opacity = "1";
    }
  }

  // Particle canvas
  function startParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    const particles = [];
    const mouse = { x: null, y: null, radius: 120 };
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = -(Math.random() * 0.35 + 0.15);
        this.alpha = Math.random() * 0.35 + 0.08;
        this.cyan = Math.random() > 0.45;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius && distance > 0) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 1.2;
            this.y += (dy / distance) * force * 1.2;
          }
        }

        if (this.y < -20 || this.x < -30 || this.x > width + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.cyan
          ? `rgba(47,231,255,${this.alpha})`
          : `rgba(8,124,255,${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.cyan
          ? "rgba(47,231,255,.5)"
          : "rgba(8,124,255,.5)";
        ctx.fill();
      }
    }

    const build = () => {
      particles.length = 0;
      const amount = Math.min(
        Math.floor((width * height) / (coarsePointer ? 26000 : 19000)),
        coarsePointer ? 32 : 62
      );

      for (let i = 0; i < amount; i += 1) particles.push(new Particle());
    };

    const connect = () => {
      if (coarsePointer) return;

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(47,231,255,${(1 - distance / 100) * 0.07})`;
            ctx.lineWidth = 0.7;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connect();
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", () => {
      resize();
      build();
    });

    if (!coarsePointer) {
      window.addEventListener("pointermove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
      });

      window.addEventListener("pointerleave", () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    resize();
    build();
    animate();
  }

  // Stripe checkout
  let selectedPackage = { name: "", price: 0 };

  const purchaseModal = document.getElementById("purchaseModal");
  const packageName = document.getElementById("checkoutPackageName");
  const packagePrice = document.getElementById("checkoutPrice");
  const closeCheckoutButton = document.getElementById("closeCheckoutButton");
  const secureCheckoutButton = document.getElementById("secureCheckoutButton");

  const stripeLinks = {
    "Starter Pack": "https://buy.stripe.com/cNiaEX2E1gg59cRdQ4eAg00",
    "Growth Pack": "https://buy.stripe.com/14A3cvfqN8NDagVdQ4eAg01",
    "Elite Pack": "https://buy.stripe.com/fZu5kD6Uh4xn60Fh2geAg02"
  };

  window.openCheckout = (name, price) => {
    selectedPackage = { name, price };

    if (packageName) packageName.textContent = name;
    if (packagePrice) packagePrice.textContent = price;

    purchaseModal?.classList.add("active");
    purchaseModal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeCheckout = () => {
    purchaseModal?.classList.remove("active");
    purchaseModal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  closeCheckoutButton?.addEventListener("click", closeCheckout);

  purchaseModal?.addEventListener("click", (event) => {
    if (event.target === purchaseModal) closeCheckout();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCheckout();
  });

  secureCheckoutButton?.addEventListener("click", () => {
    const url = stripeLinks[selectedPackage.name];
    if (url) window.location.href = url;
  });

  document.addEventListener("DOMContentLoaded", () => {
    startParticles();
    typeCode();
  });
})();
