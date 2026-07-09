(() => {
  "use strict";

  const canvas = document.getElementById("codeVortexCanvas");
  const stage = document.getElementById("codeVortexStage");
  const boostButton = document.getElementById("vortexBoost");
  const statusElement = document.getElementById("vortexStatus");

  if (!canvas || !stage) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const codeSnippets = [
    "<section class='hero'>",
    "const website = build();",
    "display: grid;",
    "transform: perspective(1200px);",
    "@media (max-width: 650px)",
    "function convertVisitors()",
    "SEO_READY = true;",
    "animation: vortex 8s linear;",
    "fetch('/api/enquiry')",
    "stripe.checkout();",
    "<meta name='description'>",
    "grid-template-columns: 1fr 1fr;",
    "requestAnimationFrame(render);",
    "document.querySelector('.cta')",
    "background: radial-gradient(...);",
    "position: relative;",
    "const mobileFirst = true;",
    "await launchWebsite();",
    "<form action='/quote'>",
    "button.addEventListener('click')",
    "opacity: clamp(0, 1, depth);",
    "box-shadow: 0 0 40px cyan;",
    "content: 'REAL RESULTS';",
    "performance.optimize();",
    "analytics.track('lead');",
    "schema.org/LocalBusiness",
    "HTML • CSS • JAVASCRIPT",
    "</website>"
  ];

  const rings = [];
  const glyphs = [];
  const streaks = [];

  let width = 0;
  let height = 0;
  let dpr = 1;
  let centerX = 0;
  let centerY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let time = 0;
  let speed = reduceMotion ? 0.08 : 0.42;
  let targetSpeed = speed;
  let warpTimer = 0;
  let lastTime = performance.now();

  const tunnelDepth = 1700;
  const focalLength = 520;
  const baseRadius = 260;

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    centerX = width * 0.5;
    centerY = height * 0.5;

    buildScene();
  }

  function buildScene() {
    rings.length = 0;
    glyphs.length = 0;
    streaks.length = 0;

    const ringCount = coarsePointer ? 18 : 26;
    const glyphCount = coarsePointer ? 58 : 96;
    const streakCount = coarsePointer ? 26 : 44;

    for (let index = 0; index < ringCount; index += 1) {
      rings.push({
        z: (index / ringCount) * tunnelDepth,
        rotation: Math.random() * Math.PI * 2,
        wobble: Math.random() * Math.PI * 2
      });
    }

    for (let index = 0; index < glyphCount; index += 1) {
      glyphs.push(createGlyph(Math.random() * tunnelDepth));
    }

    for (let index = 0; index < streakCount; index += 1) {
      streaks.push({
        angle: Math.random() * Math.PI * 2,
        z: Math.random() * tunnelDepth,
        length: 25 + Math.random() * 85,
        radius: baseRadius * (0.75 + Math.random() * 0.42),
        alpha: 0.12 + Math.random() * 0.28
      });
    }
  }

  function createGlyph(z = tunnelDepth) {
    return {
      text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
      angle: Math.random() * Math.PI * 2,
      z,
      radius: baseRadius * (0.7 + Math.random() * 0.5),
      offset: (Math.random() - 0.5) * 65,
      spin: (Math.random() - 0.5) * 0.008,
      brightness: 0.45 + Math.random() * 0.55,
      cyan: Math.random() > 0.28,
      size: 9 + Math.random() * 5
    };
  }

  function project(angle, radius, z, offset = 0) {
    const cameraZ = Math.max(1, z);
    const scale = focalLength / cameraZ;
    const twist = time * 0.00046 + z * 0.0031;
    const tunnelWaveX = Math.sin(time * 0.00055 + z * 0.004) * 28;
    const tunnelWaveY = Math.cos(time * 0.00043 + z * 0.0033) * 22;

    return {
      x:
        centerX +
        mouseX * (1 - Math.min(z / tunnelDepth, 1)) * 52 +
        tunnelWaveX +
        Math.cos(angle + twist) * (radius + offset) * scale,
      y:
        centerY +
        mouseY * (1 - Math.min(z / tunnelDepth, 1)) * 42 +
        tunnelWaveY +
        Math.sin(angle + twist) * (radius + offset) * scale,
      scale,
      twist
    };
  }

  function updateDepth(object, delta, multiplier = 1) {
    object.z -= speed * delta * multiplier;

    if (object.z < 55) {
      object.z += tunnelDepth;
      if ("text" in object) {
        Object.assign(object, createGlyph(object.z));
      }
      if ("angle" in object) {
        object.angle = Math.random() * Math.PI * 2;
      }
    }
  }

  function drawBackground() {
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.58
    );

    glow.addColorStop(0, "rgba(47,231,255,0.09)");
    glow.addColorStop(0.24, "rgba(8,124,255,0.06)");
    glow.addColorStop(0.62, "rgba(1,8,18,0.18)");
    glow.addColorStop(1, "rgba(1,5,12,0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  function drawRings(delta) {
    rings.forEach((ring, ringIndex) => {
      updateDepth(ring, delta, 1.08);

      const pointCount = coarsePointer ? 22 : 34;
      const alpha = Math.max(0, Math.min(1, 1 - ring.z / tunnelDepth));
      const depthScale = focalLength / Math.max(ring.z, 1);

      ctx.beginPath();

      for (let pointIndex = 0; pointIndex <= pointCount; pointIndex += 1) {
        const angle = (pointIndex / pointCount) * Math.PI * 2 + ring.rotation;
        const pulse =
          Math.sin(angle * 3 + time * 0.0015 + ring.wobble) *
          (8 + 18 * alpha);

        const point = project(
          angle,
          baseRadius + pulse + ringIndex * 0.9,
          ring.z
        );

        if (pointIndex === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.closePath();
      ctx.lineWidth = Math.max(0.35, depthScale * 1.35);
      ctx.strokeStyle = `rgba(47,231,255,${0.025 + alpha * 0.22})`;
      ctx.shadowBlur = 10 + alpha * 18;
      ctx.shadowColor = "rgba(47,231,255,.45)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawStreaks(delta) {
    streaks.forEach((streak) => {
      updateDepth(streak, delta, 1.55);

      const head = project(streak.angle, streak.radius, streak.z);
      const tail = project(
        streak.angle,
        streak.radius,
        Math.min(tunnelDepth, streak.z + streak.length)
      );

      const alpha = Math.max(0, Math.min(1, 1 - streak.z / tunnelDepth));
      const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);

      gradient.addColorStop(0, "rgba(47,231,255,0)");
      gradient.addColorStop(
        1,
        `rgba(255,255,255,${Math.min(.7, streak.alpha + alpha * .45)})`
      );

      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.lineWidth = Math.max(0.45, head.scale * 1.8);
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(47,231,255,.55)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
  }

  function drawGlyphs(delta) {
    glyphs.sort((a, b) => b.z - a.z);

    glyphs.forEach((glyph) => {
      updateDepth(glyph, delta, 0.95);
      glyph.angle += glyph.spin * delta;

      const projected = project(
        glyph.angle,
        glyph.radius,
        glyph.z,
        glyph.offset
      );

      const alpha = Math.max(0, Math.min(1, 1 - glyph.z / tunnelDepth));
      const fontSize = Math.max(6, Math.min(24, glyph.size * projected.scale * 3.1));

      if (
        projected.x < -220 ||
        projected.x > width + 220 ||
        projected.y < -50 ||
        projected.y > height + 50
      ) {
        return;
      }

      ctx.save();
      ctx.translate(projected.x, projected.y);
      ctx.rotate(glyph.angle + projected.twist + Math.PI * 0.5);

      ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = Math.min(0.96, 0.08 + alpha * glyph.brightness);

      const mainColor = glyph.cyan
        ? `rgba(47,231,255,${0.4 + alpha * 0.6})`
        : `rgba(255,255,255,${0.35 + alpha * 0.62})`;

      ctx.fillStyle = mainColor;
      ctx.shadowBlur = 7 + alpha * 18;
      ctx.shadowColor = glyph.cyan
        ? "rgba(47,231,255,.75)"
        : "rgba(255,255,255,.45)";

      ctx.fillText(glyph.text, 0, 0);
      ctx.restore();
    });
  }

  function drawCoreGlow() {
    const radius = 45 + Math.sin(time * 0.002) * 5;
    const glow = ctx.createRadialGradient(
      centerX + mouseX * 8,
      centerY + mouseY * 7,
      0,
      centerX + mouseX * 8,
      centerY + mouseY * 7,
      radius * 3.7
    );

    glow.addColorStop(0, "rgba(255,255,255,.26)");
    glow.addColorStop(0.15, "rgba(47,231,255,.24)");
    glow.addColorStop(0.48, "rgba(8,124,255,.11)");
    glow.addColorStop(1, "rgba(8,124,255,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(
      centerX + mouseX * 8,
      centerY + mouseY * 7,
      radius * 3.7,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function render(now) {
    const delta = Math.min(36, now - lastTime);
    lastTime = now;
    time = now;

    mouseX += (targetMouseX - mouseX) * 0.045;
    mouseY += (targetMouseY - mouseY) * 0.045;

    if (warpTimer > 0) {
      warpTimer -= delta;
      targetSpeed = 2.65;
    } else {
      targetSpeed = reduceMotion ? 0.08 : 0.42;
    }

    speed += (targetSpeed - speed) * 0.055;

    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawRings(delta);
    drawStreaks(delta);
    drawGlyphs(delta);
    drawCoreGlow();

    requestAnimationFrame(render);
  }

  function activateWarp() {
    if (reduceMotion) return;

    warpTimer = 1800;
    stage.classList.remove("warping");
    void stage.offsetWidth;
    stage.classList.add("warping");

    if (statusElement) {
      statusElement.textContent = "WARP SPEED";
    }

    window.setTimeout(() => {
      stage.classList.remove("warping");
      if (statusElement) statusElement.textContent = "BUILDING";
    }, 1850);
  }

  if (!coarsePointer) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      targetMouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    stage.addEventListener("pointerleave", () => {
      targetMouseX = 0;
      targetMouseY = 0;
    });
  }

  stage.addEventListener("dblclick", activateWarp);
  boostButton?.addEventListener("click", activateWarp);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  resize();

  requestAnimationFrame(render);
})();
