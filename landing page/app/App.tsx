import { useEffect, useRef, useState } from "react";
import socialGif from "@/imports/social.gif";
import vcardQr from "@/imports/vcard-qr.png";
import imgWeb1 from "@/imports/Web1.png";
import imgWeb5 from "@/imports/web5.png";
import imgWeb7 from "@/imports/web7.png";
import imgAsharMusic from "@/imports/ashar-music.png";

/* ─────────────────────────────────────────────────────
   INJECTED STYLES  (original design + new animations)
───────────────────────────────────────────────────── */
const CSS = `
:root {
  --ink: #07142b;
  --ink-soft: #102343;
  --blue: #0b77ff;
  --blue-bright: #24a7ff;
  --purple: #7137ff;
  --orange: #ff5a1f;
  --orange-dark: #e8440a;
  --paper: #ffffff;
  --cloud: #f3f6fa;
  --cloud-blue: #eaf3ff;
  --text: #172033;
  --muted: #5d687b;
  --line: #dce3ed;
  --font: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --display: "Anton", Impact, sans-serif;
  --mono: "JetBrains Mono", monospace;
  --shadow-sm: 0 12px 30px rgba(12,31,64,.08);
  --shadow-md: 0 24px 60px rgba(12,31,64,.14);
}

html { scroll-behavior: smooth; scroll-padding-top: 84px; }
body {
  min-width: 320px;
  overflow-x: hidden;
  background: var(--paper);
  color: var(--text);
  font-family: var(--font);
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { color: inherit; font: inherit; }
button, summary { -webkit-tap-highlight-color: transparent; }
.wrap { width: min(1220px, calc(100% - 40px)); margin-inline: auto; }

.skip-link {
  position: fixed; top: 12px; left: 12px; z-index: 1000;
  padding: 11px 15px; border-radius: 8px;
  background: #fff; color: var(--ink); font-weight: 800;
  transform: translateY(-150%); transition: transform .2s linear;
}
.skip-link:focus { transform: translateY(0); }
.sr-only {
  position: absolute !important; width: 1px !important; height: 1px !important;
  padding: 0 !important; margin: -1px !important; overflow: hidden !important;
  clip: rect(0,0,0,0) !important; white-space: nowrap !important; border: 0 !important;
}
:focus-visible { outline: 3px solid #ffb18e; outline-offset: 4px; }

/* ── SCROLL PROGRESS ── */
.scroll-progress {
  position: fixed; inset: 0 auto auto 0; z-index: 999;
  height: 3px;
  background: linear-gradient(90deg, var(--orange), #ffb21c, var(--blue-bright));
  box-shadow: 0 0 15px rgba(255,90,31,.55);
  pointer-events: none;
  transition: width 0.1s linear;
}

/* ── REVEAL ── */
.reveal { opacity: 1; transform: none; }
.js .reveal {
  opacity: 0; transform: translate3d(0,22px,0);
  transition: opacity .65s linear, transform .8s linear;
  transition-delay: var(--reveal-delay,0s);
}
.js .reveal.fade-down { transform: translate3d(0,-16px,0); }
.js .reveal.fade-right { transform: translate3d(-18px,0,0); }
.js .reveal.scale-in { transform: scale(.975); }
.js .reveal.active { opacity: 1; transform: none; }
.stagger-1 { --reveal-delay:.05s; }
.stagger-2 { --reveal-delay:.1s; }
.stagger-3 { --reveal-delay:.15s; }
.stagger-4 { --reveal-delay:.2s; }
.stagger-5 { --reveal-delay:.25s; }
.stagger-6 { --reveal-delay:.3s; }
.animation-paused, .animation-paused * { animation-play-state: paused !important; }

/* ═══════════════════════════════════════
   ANIMATION KEYFRAMES
═══════════════════════════════════════ */

/* 1 · SEGMENT FLASH — short bars blink at different heights */
@keyframes segFlash {
  0%,14%,16%,100% { opacity: 0; top: 18%; width: 38%; left: 12%; }
  15%             { opacity: 1; }
  30%,32%         { opacity: 0; top: 44%; width: 55%; left: 32%; }
  31%             { opacity: 1; }
  55%,57%         { opacity: 0; top: 72%; width: 28%; left: 58%; }
  56%             { opacity: 1; }
  78%,80%         { opacity: 0; top: 30%; width: 44%; left: 22%; }
  79%             { opacity: 1; }
}

/* 2 · TITLE LETTER-SPACE BREATHE */
@keyframes titleBreathe {
  0%,78%,100% { letter-spacing: .005em; }
  80%         { letter-spacing: .055em; filter: brightness(1.3); }
  82%         { letter-spacing: -.005em; }
  84%         { letter-spacing: .005em; filter: brightness(1); }
}

/* 3 · CHARS — drift left like ticker tape */
@keyframes charTicker {
  from { transform: translateX(0);    opacity: .04; }
  to   { transform: translateX(-28px); opacity: .11; }
}

/* 4 · PACKAGE CARD — bottom-fill rise on hover */
@keyframes cardRise {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0%   0 0 0); }
}

/* 5 · CTA — strobe brightness */
@keyframes ctaStrobe {
  0%,100% { filter: brightness(1); }
  50%     { filter: brightness(1.22); }
}

/* 6 · GRID — vertical drift only */
@keyframes gridDrift {
  0%   { background-position: 0 0; }
  100% { background-position: 0 74px; }
}

/* 7 · AMBIENT ORB — scale pulse, no translate */
@keyframes orbScale {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.18); }
}

/* 8 · SPARKS — drift horizontally */
@keyframes sparkDrift {
  from { transform: translate3d(0,    0, 0); opacity: .65; }
  to   { transform: translate3d(28px, 0, 0); opacity: .08; }
}

/* 9 · MARQUEE */
@keyframes marqueeMove { to { transform: translateX(-50%); } }

/* 10 · CURSOR BLINK */
@keyframes cursorBlink { 50% { opacity: 0; } }

/* 11 · EYEBROW LINE — grows from right to left */
@keyframes lineDrawRL {
  from { width: 0; margin-left: auto; }
  to   { width: 26px; }
}

/* 12 · PROCESS CONNECTOR — wipes right to left */
@keyframes connectorWipe {
  from { clip-path: inset(0 0 0 100%); }
  to   { clip-path: inset(0 0 0 0%); }
}

/* 13 · STANDARD CARD — left accent bar grows in height */
@keyframes accentGrow {
  from { transform: scaleY(0); transform-origin: top; }
  to   { transform: scaleY(1); transform-origin: top; }
}

/* 14 · PACKAGE NUMBER — brief dropout */
@keyframes numDropout {
  0%,80%,100% { opacity: .7; transform: none; }
  82%         { opacity: 0; transform: translateY(-5px); }
  85%         { opacity: 0; transform: translateY(5px); }
  88%         { opacity: 1; transform: none; }
}

/* 15 · BENEFITS — scale up from 0.8 */
.js .benefits-strip > div {
  opacity: 0; transform: scale(.8);
  transition: opacity .38s linear, transform .38s linear;
}
.js .benefits-strip.active > div { opacity: 1; transform: none; }
.js .benefits-strip.active > div:nth-child(1) { transition-delay: .04s; }
.js .benefits-strip.active > div:nth-child(2) { transition-delay: .12s; }
.js .benefits-strip.active > div:nth-child(3) { transition-delay: .20s; }
.js .benefits-strip.active > div:nth-child(4) { transition-delay: .28s; }
.js .benefits-strip.active > div:nth-child(5) { transition-delay: .36s; }

/* 16 · QUOTE STEPS — slide up from below */
.js .quote-steps > div {
  opacity: 0; transform: translateY(18px);
  transition: opacity .42s linear, transform .42s linear;
}
.js .quote-steps.reveal.active > div { opacity: 1; transform: none; }
.js .quote-steps.reveal.active > div:nth-child(1) { transition-delay: .06s; }
.js .quote-steps.reveal.active > div:nth-child(2) { transition-delay: .18s; }
.js .quote-steps.reveal.active > div:nth-child(3) { transition-delay: .30s; }

/* ═══════════════════════════════════════
   ELEMENTS USING ANIMATIONS
═══════════════════════════════════════ */

/* Segment flash — fixed-position bar that jumps around */
.hero-scan-line {
  position: absolute; height: 1px; pointer-events: none; z-index: 3;
  background: linear-gradient(90deg, transparent 0%, rgba(74,188,255,.6) 20%, rgba(255,255,255,.95) 50%, rgba(74,188,255,.6) 80%, transparent 100%);
  box-shadow: 0 0 10px rgba(74,188,255,.8), 0 0 28px rgba(74,188,255,.3);
  animation: segFlash 7s steps(1) infinite;
}

/* Floating chars — leftward ticker */
.float-char {
  position: absolute; pointer-events: none; user-select: none; z-index: 1;
  color: rgba(255,255,255,.06); font-family: var(--mono);
  font-size: .62rem; font-weight: 700; white-space: nowrap;
  animation: charTicker var(--fc-speed) linear var(--fc-delay) infinite alternate;
}

/* Title breathe */
.typewriter-title {
  animation: titleBreathe 11s linear 5s infinite;
}

/* Package card bottom-fill on hover */
.package-card::after {
  content: "";
  position: absolute; inset: 0; z-index: 2;
  background: rgba(255,255,255,.1);
  clip-path: inset(100% 0 0 0);
  pointer-events: none;
}
.package-card:hover::after { animation: cardRise .4s linear forwards; }

/* CTA bounce — straight translateY, no spring */
@keyframes btnBounce {
  0%   { transform: translateY(0); }
  6%   { transform: translateY(3px); }
  13%  { transform: translateY(-6px); }
  19%  { transform: translateY(2px); }
  24%  { transform: translateY(-3px); }
  29%  { transform: translateY(1px); }
  33%  { transform: translateY(0); }
  100% { transform: translateY(0); }
}

/* CTA strobe */
.nav-cta, .button.primary {
  background: linear-gradient(135deg, #ff6a2f, var(--orange));
  animation: ctaStrobe 2.8s linear infinite, btnBounce 5s linear infinite;
}
.nav-cta { animation-delay: 0s, 0s; }
.button.primary { animation-delay: 0s, -1.4s; }
.nav-cta:hover, .button.primary:hover {
  animation: none;
  filter: brightness(1.1);
  box-shadow: 0 15px 36px rgba(255,90,31,.38);
}

/* Standard card — left accent bar */
.standard-card { overflow: hidden; }
.standard-card::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; z-index: 1;
  background: rgba(94,190,255,.7);
  transform: scaleY(0); transform-origin: top;
  pointer-events: none;
  transition: transform .35s linear;
}
.standard-card:hover::before { transform: scaleY(1); }
.standard-card > * { position: relative; z-index: 2; }

/* Package number dropout */
.package-number { animation: numDropout 8s linear infinite; }

/* Process connector — wipes right to left */
.js .process-grid::before {
  clip-path: inset(0 0 0 100%);
  transition: none;
}
.js .process-grid.line-visible::before {
  animation: connectorWipe 1.6s linear forwards;
}

/* Eyebrow line */
.eyebrow span { width: 0; animation: lineDraw .75s linear .6s forwards; }
@keyframes lineDraw {
  from { width: 0; }
  to   { width: 26px; }
}

/* ── HERO ── */
.hero {
  position: relative; isolation: isolate;
  min-height: 760px; overflow: hidden; color: #fff;
  background:
    radial-gradient(circle at 78% 12%, rgba(75,83,255,.2), transparent 28%),
    linear-gradient(135deg, #061126 0%, #08172f 52%, #10183d 100%);
}
.hero::after {
  content: ""; position: absolute; inset: auto 0 0; z-index: -1;
  height: 170px;
  background: linear-gradient(180deg, transparent, rgba(2,8,20,.42));
  pointer-events: none;
}
.ambient-orbs { position: absolute; inset: 0; z-index: -2; pointer-events: none; }
.orb { position: absolute; border-radius: 50%; filter: blur(4px); opacity: .72; }
.orb-1 {
  top: 9%; right: 3%; width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(0,151,255,.29), transparent 68%);
  animation: orbScale 14s linear infinite alternate;
}
.orb-2 {
  bottom: -18%; left: 23%; width: 520px; height: 520px;
  background: radial-gradient(circle, rgba(113,55,255,.23), transparent 68%);
  animation: orbScale 20s linear -7s infinite alternate-reverse;
}
.grid-glow {
  position: absolute; inset: 0; opacity: .15;
  background-image:
    linear-gradient(rgba(255,255,255,.11) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.11) 1px, transparent 1px);
  background-size: 74px 74px;
  mask-image: linear-gradient(to bottom, #000, transparent 82%);
  animation: gridDrift 18s linear infinite;
}

/* ── NAV ── */
.site-nav {
  position: relative; z-index: 50;
  width: min(1220px, calc(100% - 40px)); min-height: 82px; margin-inline: auto;
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 30px;
  border-bottom: 1px solid rgba(255,255,255,.11);
}
.brand { font-size: 1.35rem; font-weight: 900; letter-spacing: -.045em; }
.brand b { color: var(--blue-bright); }
.nav-links { justify-self: center; display: flex; align-items: center; gap: 27px; }
.nav-links a {
  position: relative; padding-block: 28px;
  color: #cbd6e8; font-size: .78rem; font-weight: 700;
}
.nav-links a::after {
  content: ""; position: absolute;
  left: 0; right: 0; bottom: 18px; height: 2px;
  background: var(--orange); transform: scaleX(0);
  transform-origin: left; transition: transform .25s linear;
}
.nav-links a:hover { color: #fff; }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-cta,
.button.primary,
.promo-bar-inner > a,
.standards-intro > a {
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6a2f, var(--orange));
  color: #fff; font-weight: 900;
  box-shadow: 0 12px 28px rgba(255,90,31,.25);
  transition: filter .25s linear, box-shadow .25s linear;
}
.promo-bar-inner > a { animation: btnBounce 5s linear infinite; animation-delay: -2.5s; }
.standards-intro > a { animation: btnBounce 5s linear infinite; animation-delay: -3.8s; }
.promo-bar-inner > a:hover, .standards-intro > a:hover { animation: none; filter: brightness(1.1); }
.nav-cta { padding: 11px 16px; font-size: .75rem; }
.menu-button {
  display: none; justify-self: end;
  width: 44px; height: 44px;
  border: 1px solid rgba(255,255,255,.18); border-radius: 9px;
  background: rgba(255,255,255,.06); color: #fff; cursor: pointer;
  transition: background .2s linear;
}
.menu-button:hover { background: rgba(255,255,255,.12); }

/* ── HERO GRID ── */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0,1.02fr) minmax(420px,.98fr);
  align-items: center; gap: clamp(42px,6vw,88px);
  min-height: 670px; padding: 66px 0 88px;
}
.eyebrow {
  display: flex; align-items: center; gap: 9px;
  color: #a9c5e9; font-family: var(--mono);
  font-size: .68rem; font-weight: 700;
  letter-spacing: .08em; text-transform: uppercase;
}
.typewriter-title {
  display: flex; flex-direction: column; min-height: 2.72em;
  margin-top: 19px; font-family: var(--display);
  font-size: clamp(3.2rem,4.6vw,5.1rem); font-weight: 400;
  line-height: .87; letter-spacing: .005em; text-transform: uppercase;
}
.type-line { display: block; width: fit-content; min-height: .88em; white-space: nowrap; }
.type-line.typing::after {
  content: ""; display: inline-block; width: .06em; height: .75em;
  margin-left: .05em; background: var(--orange); vertical-align: -.03em;
  animation: cursorBlink .8s steps(1) infinite;
}
.gradient-line {
  color: transparent;
  background: linear-gradient(90deg, #48bcff 0%, #7194ff 48%, #a66cff 100%);
  -webkit-background-clip: text; background-clip: text;
}
.not-ai {
  width: fit-content; margin-top: 16px; padding: 7px 11px;
  border: 1px solid rgba(255,255,255,.14); border-radius: 6px;
  background: rgba(255,255,255,.06); color: #d6e4f8;
  font-size: .72rem; font-weight: 700;
}
.hero-lead { max-width: 620px; margin-top: 18px; color: #b9c7dc; font-size: clamp(.98rem,1.35vw,1.08rem); line-height: 1.75; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.button {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 50px; padding: 0 21px; border: 1px solid transparent;
  font-size: .82rem; font-weight: 900;
}
.button.secondary {
  border-color: rgba(255,255,255,.2); border-radius: 8px;
  background: rgba(255,255,255,.055); color: #fff;
  transition: border-color .25s linear, background-color .25s linear;
}
.button.secondary:hover { border-color: rgba(255,255,255,.5); background: rgba(255,255,255,.1); }
.mini-proof { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 25px; color: #b8c6da; }
.mini-proof span { display: flex; align-items: center; gap: 7px; font-size: .67rem; font-weight: 700; }
.mini-proof b { color: var(--blue-bright); font-family: var(--mono); font-size: .62rem; }

.hero-media {
  position: relative; min-height: 525px;
  border: 1px solid rgba(255,255,255,.16); border-radius: 24px;
  background: #0a1730; box-shadow: 0 34px 90px rgba(0,0,0,.38);
}
.hero-media::before {
  content: ""; position: absolute; inset: -13px; z-index: -1;
  border: 1px solid rgba(74,180,255,.13); border-radius: 30px;
}
.hero-media > img { width: 100%; height: 525px; border-radius: 23px; object-fit: cover; }
.media-shade {
  position: absolute; inset: 0; border-radius: 23px;
  background: linear-gradient(180deg, rgba(5,13,29,.06), rgba(5,13,29,.18) 45%, rgba(5,13,29,.78));
  pointer-events: none;
}
.media-label {
  position: absolute; top: 18px; left: 18px;
  display: flex; align-items: center; gap: 7px;
  padding: 8px 10px; border: 1px solid rgba(255,255,255,.2);
  border-radius: 7px; background: rgba(5,13,29,.68);
  backdrop-filter: blur(12px); color: #fff;
  font-size: .62rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em;
}
.media-label span {
  width: 6px; height: 6px; border-radius: 50%;
  background: #51e695; box-shadow: 0 0 10px #51e695;
}
.feature-stack { position: absolute; right: -24px; bottom: 24px; display: grid; gap: 9px; width: min(310px,76%); }
.glass-card {
  display: grid; grid-template-columns: 34px 1fr; gap: 10px; align-items: center;
  padding: 11px 13px; border: 1px solid rgba(255,255,255,.15); border-radius: 10px;
  background: rgba(5,14,32,.82); box-shadow: 0 14px 30px rgba(0,0,0,.22);
  backdrop-filter: blur(14px);
}
.glass-card > span {
  display: grid; place-items: center; width: 30px; height: 30px;
  border-radius: 7px; background: linear-gradient(135deg, var(--blue), var(--purple));
  font-family: var(--mono); font-size: .56rem; font-weight: 800;
}
.glass-card strong, .glass-card small { display: block; }
.glass-card strong { font-size: .71rem; }
.glass-card small { margin-top: 2px; color: #aebed4; font-size: .58rem; line-height: 1.35; }

.type-spark {
  position: absolute;
  left: var(--spark-x); top: var(--spark-y);
  width: var(--spark-size); height: var(--spark-size);
  border-radius: 50%;
  background: rgba(79,185,255,.7); box-shadow: 0 0 12px rgba(79,185,255,.7);
  pointer-events: none;
  animation: sparkDrift var(--spark-speed) linear var(--spark-delay) infinite alternate;
}

/* ── MARQUEE ── */
.urgent-strip { overflow: hidden; background: linear-gradient(90deg, #ff4d12, #ff732e); color: #fff; }
.urgent-strip--dark { overflow: hidden; background: #050d1c; color: #fff; border-top: 1px solid #1a2740; border-bottom: 1px solid #1a2740; }
.urgent-strip--blue { overflow: hidden; background: linear-gradient(90deg, #0a3a7a, #0f52b2); color: #fff; }
.urgent-strip--ink { overflow: hidden; background: var(--ink); color: #fff; }
.marquee {
  display: flex; width: max-content; align-items: center;
  gap: 24px; padding: 10px 0;
  animation: marqueeMove 26s linear infinite;
}
.marquee--rev { animation-direction: reverse; animation-duration: 22s; }
.marquee span { font-family: var(--mono); font-size: .63rem; font-weight: 800; letter-spacing: .07em; white-space: nowrap; }
.marquee i { color: #ffd0be; font-size: .55rem; font-style: normal; }
.urgent-strip--dark .marquee i { color: #3a5a8a; }
.urgent-strip--blue .marquee i { color: #6ba3e8; }
.urgent-strip--ink .marquee i { color: #ff7347; }

/* ── PROMO BAR ── */
.promo-bar { padding: 20px 0 0; background: var(--paper); }
.promo-bar-inner {
  display: grid; grid-template-columns: auto 1fr auto;
  align-items: center; gap: 18px; padding: 16px 18px;
  border: 1px solid var(--line); border-radius: 12px; background: var(--cloud);
}
.promo-kicker { padding: 7px 9px; border-radius: 6px; background: var(--ink); color: #fff; font-family: var(--mono); font-size: .58rem; font-weight: 800; }
.promo-bar-inner strong, .promo-bar-inner span { display: block; }
.promo-bar-inner strong { color: var(--ink); font-size: .86rem; }
.promo-bar-inner div > span { margin-top: 2px; color: var(--muted); font-size: .7rem; }
.promo-bar-inner > a { padding: 10px 13px; font-size: .7rem; }
.promo-bar-inner > a span { display: inline; }

/* ── SECTION HEADINGS ── */
.packages-section, .work-section, .process-section, .faq-section { padding: 84px 0; }
.section-title { max-width: 760px; margin: 0 auto 36px; text-align: center; }
.section-title > span,
.standards-intro > span,
.human-copy > span,
.faq-intro > span {
  color: var(--blue); font-family: var(--mono);
  font-size: .64rem; font-weight: 800; letter-spacing: .09em;
}
.section-title h2,
.standards-intro h2,
.faq-intro h2 {
  margin-top: 9px; color: var(--ink);
  font-size: clamp(2rem,4vw,3.25rem); line-height: 1.04; letter-spacing: -.055em;
}
.section-title p { max-width: 640px; margin: 12px auto 0; color: var(--muted); font-size: .92rem; }

/* ── PACKAGES ── */
.packages-section { padding-top: 68px; background: var(--paper); }
.package-grid { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 10px; align-items: stretch; }
.package-card {
  --card: #0c8cd4; --card-dark: #09699f;
  position: relative; display: flex; min-width: 0;
  flex-direction: column; overflow: hidden;
  padding: 16px 13px 13px;
  border: 1px solid rgba(0,0,0,.08); border-radius: 10px;
  background: linear-gradient(150deg, var(--card), var(--card-dark));
  color: #fff; box-shadow: 0 14px 28px rgba(14,34,67,.12);
  transition: border-color .25s linear, box-shadow .25s linear, filter .25s linear;
}
.package-card::before {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(125deg, rgba(255,255,255,.2), transparent 34%);
  pointer-events: none;
}
.package-card:hover { border-color: rgba(255,255,255,.6); box-shadow: 0 22px 44px rgba(14,34,67,.22); filter: saturate(1.06); }
.package-blue  { --card:#09a9e2; --card-dark:#0878bf; }
.package-bronze{ --card:#c87543; --card-dark:#8d422b; }
.package-silver{ --card:#818a98; --card-dark:#4e5866; }
.package-gold  { --card:#f2bd37; --card-dark:#d87b14; }
.package-purple{ --card:#9b43b7; --card-dark:#682a8d; }
.package-bronze { box-shadow: 0 0 0 3px rgba(255,90,31,.12), 0 18px 42px rgba(155,74,37,.25); }
.popular {
  position: absolute; top: 0; right: 0; z-index: 2;
  padding: 5px 8px; border-radius: 0 9px 0 8px;
  background: var(--orange); font-size: .52rem; font-weight: 900;
  letter-spacing: .05em; text-transform: uppercase;
}
.package-number { position: absolute; top: 10px; left: 12px; z-index: 1; color: rgba(255,255,255,.7); font-family: var(--mono); font-size: .55rem; font-weight: 800; }
.package-icon { position: relative; z-index: 1; display: grid; place-items: center; width: 42px; height: 42px; margin: 10px auto 10px; border: 1px solid rgba(255,255,255,.32); border-radius: 50%; background: rgba(255,255,255,.14); font-size: 1.35rem; }
.package-name { position: relative; z-index: 1; min-height: 2.2em; color: #fff; font-size: .95rem; font-weight: 900; line-height: 1.08; text-align: center; }
.package-card > small { position: relative; z-index: 1; min-height: 3.8em; margin-top: 5px; color: rgba(255,255,255,.82); font-size: .61rem; line-height: 1.4; text-align: center; }
.was-price { position: relative; z-index: 1; margin-top: 12px; color: rgba(255,255,255,.76); font-size: .55rem; font-weight: 800; text-align: center; text-transform: uppercase; letter-spacing: .06em; }
.package-price { position: relative; z-index: 1; margin-top: 1px; font-family: var(--display); font-size: clamp(2rem,2.8vw,2.8rem); line-height: 1; text-align: center; white-space: nowrap; }
.package-price em { font-family: var(--font); font-size: .5rem; font-style: normal; font-weight: 900; }
.save-chip { position: relative; z-index: 1; width: fit-content; margin: 8px auto 11px; padding: 5px 8px; border: 1px solid rgba(255,255,255,.35); border-radius: 999px; background: rgba(255,255,255,.14); font-size: .52rem; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; }
.package-card ul { position: relative; z-index: 1; display: grid; align-content: start; gap: 7px; flex: 1; margin: 0; padding: 12px 10px; border-radius: 8px; background: rgba(255,255,255,.94); color: var(--ink); list-style: none; }
.package-card li { position: relative; padding-left: 13px; font-size: .59rem; font-weight: 700; line-height: 1.35; }
.package-card li::before { content: "✓"; position: absolute; left: 0; color: var(--blue); font-weight: 900; }
.package-button {
  position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
  min-height: 38px; margin-top: 10px; padding: 7px;
  border: 1px solid rgba(255,255,255,.36); border-radius: 6px;
  background: linear-gradient(90deg, #ff6a2f, #ff4d13); color: #fff;
  font-size: .58rem; font-weight: 900; text-align: center; text-transform: uppercase;
  transition: filter .25s linear, box-shadow .25s linear;
}
.package-button { animation: btnBounce 5s linear infinite; }
.package-card:nth-child(1) .package-button { animation-delay:  0s; }
.package-card:nth-child(2) .package-button { animation-delay: -1s; }
.package-card:nth-child(3) .package-button { animation-delay: -2s; }
.package-card:nth-child(4) .package-button { animation-delay: -3s; }
.package-card:nth-child(5) .package-button { animation-delay: -4s; }
.package-button:hover { animation: none; filter: brightness(1.1); box-shadow: 0 9px 20px rgba(91,31,8,.25); }
.package-gold .package-button { background: var(--ink); }
.package-note {
  display: grid; grid-template-columns: auto 1fr auto;
  gap: 18px; align-items: center; margin-top: 18px; padding: 18px 20px;
  border: 1px solid #cfe2f8; border-radius: 10px; background: var(--cloud-blue);
}
.package-note > span { color: var(--ink); font-size: .78rem; font-weight: 900; }
.package-note p { color: var(--muted); font-size: .7rem; }
.package-note a { color: var(--blue); font-size: .68rem; font-weight: 900; }
.package-note a:hover { text-decoration: underline; }
.benefits-strip {
  display: grid; grid-template-columns: repeat(5,1fr);
  margin-top: 18px; padding: 18px 8px;
  border: 1px solid var(--line); border-radius: 10px;
  background: #fff; box-shadow: var(--shadow-sm);
}
.benefits-strip > div { display: grid; grid-template-columns: auto 1fr; gap: 1px 9px; align-items: center; padding: 0 13px; border-right: 1px solid var(--line); }
.benefits-strip > div:last-child { border-right: 0; }
.benefits-strip span { grid-row: 1/span 2; color: var(--blue); font-size: 1.08rem; font-weight: 900; }
.benefits-strip strong { color: var(--ink); font-size: .62rem; text-transform: uppercase; }
.benefits-strip small { color: var(--muted); font-size: .56rem; }

/* ── STANDARDS ── */
.standards-section { padding: 88px 0 52px; background: var(--ink); color: #fff; }
.standards-layout { display: grid; grid-template-columns: .7fr 1.3fr; gap: clamp(42px,7vw,92px); align-items: start; }
.standards-intro { position: sticky; top: 110px; }
.standards-intro > span { color: #63bfff; }
.standards-intro h2 { color: #fff; }
.standards-intro p { margin-top: 15px; color: #aebdd3; font-size: .86rem; line-height: 1.7; }
.standards-intro > a { display: inline-flex; margin-top: 22px; padding: 12px 15px; font-size: .72rem; }
.standards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.standard-card {
  position: relative; min-height: 235px; padding: 20px;
  border: 1px solid rgba(255,255,255,.11); border-radius: 12px;
  background: linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025));
  transition: border-color .25s linear, background-color .25s linear, box-shadow .25s linear;
}
.standard-card:hover { border-color: rgba(94,190,255,.6); background: rgba(255,255,255,.085); box-shadow: 0 22px 45px rgba(0,0,0,.22); }
.standard-card b { position: absolute; top: 16px; right: 17px; color: rgba(255,255,255,.24); font-family: var(--mono); font-size: .7rem; }
.standard-card > span { color: #63bfff; font-family: var(--mono); font-size: .55rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.standard-card strong { display: block; margin-top: 36px; font-size: 1rem; }
.standard-card p { margin-top: 9px; color: #aebdd3; font-size: .72rem; line-height: 1.62; }
.standard-card small { position: absolute; left: 20px; bottom: 18px; color: #fff; font-size: .61rem; font-weight: 800; }
.standards-note { margin-top: 28px; color: #788aa4; font-size: .58rem; text-align: right; }

/* ── WORK ── */
.work-section { background: var(--cloud); }
.work-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; align-items: end; }

.work-card {
  display: flex; flex-direction: column; gap: 12px;
  background: transparent; border: none; box-shadow: none; border-radius: 0;
  overflow: visible;
  transition: none;
}

/* Laptop shell */
.laptop-shell {
  position: relative;
  transform: translateY(0);
  transition: transform .32s linear;
  filter: drop-shadow(0 18px 32px rgba(5,14,40,.38));
}
.work-card:hover .laptop-shell { transform: translateY(-6px); }

/* Screen lid */
.laptop-lid {
  position: relative;
  background: linear-gradient(160deg, #1c2e4a 0%, #0f1e33 100%);
  border-radius: 10px 10px 4px 4px;
  padding: 7px 7px 5px;
  border: 1.5px solid #243650;
  border-bottom-color: #0a1624;
}

/* Camera dot */
.laptop-cam {
  width: 5px; height: 5px; border-radius: 50%;
  background: #0d1c30; border: 1px solid #1a2e48;
  margin: 0 auto 5px;
  position: relative;
}
.laptop-cam::after {
  content: ""; position: absolute; inset: 1px;
  border-radius: 50%; background: #1a3a5c;
  animation: camPulse 4s linear infinite;
}
@keyframes camPulse {
  0%,90%,100% { opacity: .3; }
  92%          { opacity: 1; background: #4af; }
  94%          { opacity: .3; }
}

/* Browser toolbar inside screen */
.laptop-toolbar {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 7px; background: #1a2b42; border-radius: 3px 3px 0 0;
  border-bottom: 1px solid #0d1a2c;
}
.laptop-dots { display: flex; gap: 4px; }
.laptop-dots span {
  width: 7px; height: 7px; border-radius: 50%;
}
.laptop-dots span:nth-child(1) { background: #ff5f57; }
.laptop-dots span:nth-child(2) { background: #ffbd2e; }
.laptop-dots span:nth-child(3) { background: #28c940; }
.laptop-url {
  flex: 1; margin-left: 6px; padding: 2px 8px;
  background: #0f1e33; border-radius: 3px;
  color: #5a8fbf; font-family: var(--mono); font-size: .52rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Screen viewport */
.laptop-viewport {
  overflow: hidden; border-radius: 0 0 3px 3px;
  background: #000; line-height: 0;
}

/* Thumb pan animation */
@keyframes thumbPanUp {
  0%   { background-position: center 5%; }
  100% { background-position: center 95%; }
}
.work-thumb {
  position: relative; height: 150px;
  background-size: cover; background-color: #0a1624;
  overflow: hidden;
  filter: saturate(.6) brightness(.88);
  transition: filter .35s linear;
  animation: thumbPanUp 9s linear infinite alternate;
}
.work-card:nth-child(1) .work-thumb { animation-delay:    0s; }
.work-card:nth-child(2) .work-thumb { animation-delay: -2.5s; }
.work-card:nth-child(3) .work-thumb { animation-delay: -5.0s; }
.work-card:nth-child(4) .work-thumb { animation-delay: -7.5s; }
.work-card:hover .work-thumb {
  filter: saturate(1.1) brightness(1.05);
  animation-play-state: paused;
}

/* Screen-on entrance flash */
@keyframes screenBoot {
  0%   { opacity: 0; }
  55%  { opacity: 0; }
  58%  { opacity: .5; }
  61%  { opacity: .15; }
  64%  { opacity: .9; }
  67%  { opacity: .6; }
  70%  { opacity: 1; }
  100% { opacity: 1; }
}
.js .work-card.reveal .laptop-viewport { opacity: 0; }
.js .work-card.reveal.active .laptop-viewport {
  animation: screenBoot .9s linear var(--reveal-delay,.05s) forwards;
}

/* Scan sweep on hover */
.work-thumb::before {
  content: ""; position: absolute; top: 0; bottom: 0; left: 0;
  width: 55%; z-index: 3;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.16) 50%, transparent);
  transform: translateX(-160%); pointer-events: none;
}
.work-card:hover .work-thumb::before { animation: workScan .5s linear forwards; }
@keyframes workScan {
  from { transform: translateX(-160%); }
  to   { transform: translateX(320%); }
}

/* Screen glow on hover */
.laptop-viewport { transition: box-shadow .3s linear; }
.work-card:hover .laptop-viewport {
  box-shadow: 0 0 18px rgba(80,160,255,.35) inset;
}

/* Laptop base / hinge */
.laptop-base {
  height: 6px;
  background: linear-gradient(180deg, #1a2e4a, #0d1c30);
  border-radius: 0 0 3px 3px;
  border: 1.5px solid #0d1c30;
  border-top: none;
  width: calc(100% + 6px); margin-left: -3px;
}
.laptop-foot {
  height: 5px;
  background: linear-gradient(180deg, #0d1824, #070f1c);
  border-radius: 0 0 6px 6px;
  width: calc(100% + 14px); margin-left: -7px;
  position: relative;
}
.laptop-foot::after {
  content: "";
  position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  width: 35%; height: 2px;
  background: #050d18; border-radius: 0 0 4px 4px;
}

/* Card info row */
.work-info {
  display: flex; justify-content: space-between; align-items: center;
  gap: 8px; padding: 0 2px;
  transform: translateY(0); transition: transform .28s linear;
}
.work-card:hover .work-info { transform: translateY(-2px); }
.work-info strong { color: var(--ink); font-size: .77rem; }
.work-info small { color: var(--blue); font-size: .61rem; font-weight: 800; }


/* ── HUMAN ── */
.human-section { padding: 0 0 74px; background: var(--cloud); }
.human-card {
  display: grid; grid-template-columns: auto 1fr 1.5fr; align-items: center;
  gap: 27px; padding: 28px; border-radius: 15px;
  background: linear-gradient(125deg,#08172f,#11234a); color: #fff;
  box-shadow: 0 30px 70px rgba(8,23,47,.24);
}
.human-avatar {
  display: grid; place-items: center; width: 90px; height: 90px;
  border: 2px solid rgba(255,255,255,.24); border-radius: 50%;
  background: linear-gradient(135deg,var(--blue),var(--purple));
  font-family: var(--display); font-size: 2rem;
  box-shadow: 0 0 0 8px rgba(47,135,255,.08);
}
.human-copy > span { color: #63bfff; }
.human-copy h2 { margin-top: 6px; font-size: clamp(1.45rem,2.5vw,2rem); line-height: 1.08; letter-spacing: -.04em; }
.human-copy p { margin-top: 10px; color: #adbed5; font-size: .74rem; line-height: 1.65; }
.human-points { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.human-points > div { min-height: 92px; padding: 13px; border: 1px solid rgba(255,255,255,.1); border-radius: 9px; background: rgba(255,255,255,.05); }
.human-points span { color: #62bfff; font-size: 1rem; }
.human-points strong, .human-points small { display: block; }
.human-points strong { margin-top: 4px; font-size: .66rem; }
.human-points small { margin-top: 3px; color: #aebed3; font-size: .56rem; line-height: 1.4; }

/* ── PROCESS ── */
.process-section { background: #fff; }
.process-grid { position: relative; display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.process-grid::before {
  content: ""; position: absolute; top: 31px; left: 8%; right: 8%; height: 1px;
  background: linear-gradient(90deg,transparent,#a8cff8 15%,#a8cff8 85%,transparent);
}
.process-grid article { position: relative; min-height: 220px; padding: 22px; border: 1px solid var(--line); border-radius: 11px; background: #fff; box-shadow: var(--shadow-sm); transition: border-color .25s linear, box-shadow .25s linear; }
.process-grid article:hover { border-color: #a5d0ff; box-shadow: var(--shadow-md); }
.process-grid article > span { position: relative; z-index: 1; display: grid; place-items: center; width: 42px; height: 42px; border: 6px solid #fff; border-radius: 50%; background: var(--blue); color: #fff; font-family: var(--mono); font-size: .58rem; font-weight: 900; box-shadow: 0 0 0 1px #b8d8fb; }
.process-grid strong { display: block; margin-top: 30px; color: var(--ink); font-size: .88rem; }
.process-grid p { margin-top: 9px; color: var(--muted); font-size: .7rem; line-height: 1.65; }

/* ── FAQ ── */
.faq-section { background: var(--cloud); }
.faq-layout { display: grid; grid-template-columns: .72fr 1.28fr; gap: clamp(40px,7vw,90px); align-items: start; }
.faq-intro { position: sticky; top: 110px; }
.faq-intro h2 { margin-top: 9px; }
.faq-intro p { margin-top: 14px; color: var(--muted); font-size: .84rem; line-height: 1.65; }
.faq-intro a { display: inline-block; margin-top: 16px; color: var(--blue); font-size: .72rem; font-weight: 800; }
.faq-list { display: grid; gap: 9px; }
.faq-list details { border: 1px solid var(--line); border-radius: 9px; background: #fff; box-shadow: 0 7px 20px rgba(15,37,72,.04); transition: border-color .2s linear; }
.faq-list details[open] { border-color: #acd2fb; box-shadow: 0 14px 30px rgba(15,70,130,.08); }
.faq-list summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 16px 18px; color: var(--ink); font-size: .78rem; font-weight: 800; cursor: pointer; list-style: none; }
.faq-list summary::-webkit-details-marker { display: none; }
.faq-list summary span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--cloud-blue); color: var(--blue); font-size: 1rem; transition: transform .25s linear, background-color .25s linear; }
.faq-list details[open] summary span { transform: rotate(45deg); background: var(--blue); color: #fff; }
.faq-list details p { padding: 0 52px 18px 18px; color: var(--muted); font-size: .7rem; line-height: 1.7; }

/* ── QUOTE ── */
.quote-section { padding: 34px 0 74px; background: var(--cloud); }
.quote-wrap { display: grid; gap: 14px; }
.quote-panel {
  display: grid; grid-template-columns: 138px minmax(245px,.72fr) minmax(470px,1.38fr);
  align-items: center; gap: 28px; padding: 28px;
  border: 1px solid rgba(255,255,255,.19); border-radius: 16px;
  background:
    radial-gradient(circle at 8% 30%, rgba(74,188,255,.25), transparent 28%),
    linear-gradient(120deg,#0864ed,#7040f4);
  color: #fff; box-shadow: 0 28px 70px rgba(38,79,198,.28);
}
.quote-icon {
  position: relative; display: grid; place-items: center;
  width: 132px; height: 132px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.38); border-radius: 13px;
  background: #fff; box-shadow: 0 14px 32px rgba(15,31,89,.22);
}
.quote-qr img { position: relative; z-index: 1; width: 108px; height: 108px; object-fit: contain; }
.qr-fallback { display: none; place-items: center; width: 108px; height: 108px; border: 2px dashed #9cb3d1; border-radius: 8px; color: #607a9d; font-family: var(--mono); font-size: .72rem; font-weight: 900; line-height: 1.25; text-align: center; }
.quote-qr.is-missing img { display: none; }
.quote-qr.is-missing .qr-fallback { display: grid; }
.quote-copy > span { color: #bde4ff; font-family: var(--mono); font-size: .6rem; font-weight: 800; letter-spacing: .07em; }
.quote-copy h2 { margin-top: 7px; font-size: clamp(1.8rem,3vw,2.6rem); line-height: 1.02; letter-spacing: -.05em; }
.quote-copy p { margin-top: 9px; color: #dbeaff; font-size: .76rem; line-height: 1.55; }
.quote-form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 17px; border: 1px solid rgba(255,255,255,.22); border-radius: 12px; background: rgba(255,255,255,.12); backdrop-filter: blur(12px); }
.quote-form input,
.quote-form select,
.quote-form textarea {
  width: 100%; min-width: 0; border: 2px solid transparent; border-radius: 7px;
  background: #fff; color: var(--ink); outline: 0; padding: 12px; font-size: .82rem;
  transition: border-color .25s linear, box-shadow .25s linear;
}
.quote-form input:focus,
.quote-form select:focus,
.quote-form textarea:focus { border-color: #8acaff; box-shadow: 0 0 0 4px rgba(138,202,255,.2); }
.quote-form textarea { grid-column: 1/-1; min-height: 92px; resize: vertical; }
.quote-form button {
  grid-column: 1/-1; min-height: 48px; border: 0; border-radius: 7px;
  background: linear-gradient(90deg,#ff6b2f,#ff4b12); color: #fff;
  font-size: .84rem; font-weight: 900; cursor: pointer;
  box-shadow: 0 12px 25px rgba(83,29,9,.2);
  transition: filter .25s linear, box-shadow .25s linear;
}
.quote-form button { animation: btnBounce 5s linear -0.8s infinite; }
.quote-form button:hover { animation: none; filter: brightness(1.09); box-shadow: 0 15px 32px rgba(83,29,9,.28); }
.form-note { grid-column: 1/-1; color: rgba(255,255,255,.78); font-size: .53rem; text-align: center; }
.honeypot { display: none !important; }
.quote-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.quote-steps > div { display: grid; grid-template-columns: auto 1fr; gap: 11px; align-items: center; padding: 15px 17px; border: 1px solid var(--line); border-radius: 9px; background: #fff; }
.quote-steps b { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 7px; background: var(--cloud-blue); color: var(--blue); font-family: var(--mono); font-size: .56rem; }
.quote-steps span, .quote-steps strong, .quote-steps small { display: block; }
.quote-steps strong { color: var(--ink); font-size: .66rem; }
.quote-steps small { margin-top: 2px; color: var(--muted); font-size: .55rem; }

/* ── FOOTER ── */
footer { padding: 52px 0 22px; background: #050d1c; color: #fff; }
.footer-grid { display: grid; grid-template-columns: 1.2fr 1fr 1.2fr; gap: 35px; align-items: start; }
.footer-brand, .footer-contact { display: grid; gap: 6px; }
.footer-brand strong { font-size: 1.15rem; letter-spacing: -.04em; }
.footer-brand span, .footer-contact span { color: #8494aa; font-size: .65rem; }
.footer-links { display: flex; flex-wrap: wrap; gap: 14px; }
.footer-links a, .footer-contact a { color: #c5d1e2; font-size: .66rem; font-weight: 700; }
.footer-links a:hover, .footer-contact a:hover { color: #fff; text-decoration: underline; }
.footer-contact { text-align: right; }
.footer-bottom { display: flex; justify-content: space-between; gap: 20px; margin-top: 36px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.09); color: #677890; font-size: .58rem; }
.footer-bottom a:hover { color: #fff; }

/* ── RESPONSIVE ── */
@media (max-width:1120px) {
  .hero-grid { grid-template-columns: minmax(0,1fr) minmax(380px,.82fr); gap: 45px; }
  .typewriter-title { font-size: clamp(2.9rem,5.2vw,4.3rem); }
  .package-grid { grid-template-columns: repeat(6,1fr); }
  .package-card { grid-column: span 2; }
  .package-card:nth-child(4) { grid-column: 2/span 2; }
  .package-card:nth-child(5) { grid-column: 4/span 2; }
  .package-price { font-size: 2.65rem; }
  .quote-panel { grid-template-columns: 120px 1fr; }
  .quote-icon { width: 118px; height: 118px; }
  .quote-form { grid-column: 1/-1; }
}
@media (max-width:900px) {
  .site-nav { grid-template-columns: auto 1fr auto; }
  .menu-button { display: block; grid-column: 3; }
  .nav-cta { display: none; }
  .nav-links {
    position: absolute; top: 74px; left: 0; right: 0;
    display: grid; justify-self: stretch; gap: 0; padding: 9px;
    border: 1px solid rgba(255,255,255,.14); border-radius: 11px;
    background: rgba(5,13,28,.96); box-shadow: 0 25px 55px rgba(0,0,0,.38);
    backdrop-filter: blur(16px); opacity: 0; visibility: hidden;
    transform: translateY(-8px);
    transition: opacity .25s linear, transform .25s linear, visibility .25s;
  }
  .nav-links.active { opacity: 1; visibility: visible; transform: none; }
  .nav-links a { padding: 13px 14px; border-bottom: 1px solid rgba(255,255,255,.08); text-align: center; }
  .nav-links a:last-child { border-bottom: 0; }
  .nav-links a::after { display: none; }
  .hero-grid { grid-template-columns: 1fr; padding-top: 58px; text-align: center; }
  .hero-copy { display: flex; flex-direction: column; align-items: center; }
  .hero-lead { max-width: 680px; }
  .type-line { margin-inline: auto; }
  .hero-media { width: min(660px,100%); min-height: 480px; margin: 5px auto 0; text-align: left; }
  .hero-media > img { height: 480px; }
  .feature-stack { right: 18px; }
  .work-grid { grid-template-columns: 1fr 1fr; }
  .human-card { grid-template-columns: auto 1fr; }
  .human-points { grid-column: 1/-1; }
  .process-grid { grid-template-columns: 1fr 1fr; }
  .process-grid::before { display: none; }
  .standards-layout, .faq-layout { grid-template-columns: 1fr; }
  .standards-intro, .faq-intro { position: static; }
  .standards-intro { max-width: 680px; }
  .benefits-strip { grid-template-columns: repeat(3,1fr); row-gap: 18px; }
  .benefits-strip > div:nth-child(3) { border-right: 0; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-contact { text-align: left; }
}
@media (max-width:700px) {
  .wrap, .site-nav { width: min(100% - 24px, 1220px); }
  .site-nav { min-height: 72px; }
  .nav-links { top: 66px; }
  .hero { min-height: auto; }
  .hero-grid { min-height: 0; gap: 28px; padding: 28px 0 40px; }
  .eyebrow { font-size: .56rem; }
  .typewriter-title { min-height: 3em; font-size: clamp(2.3rem,12.8vw,3.6rem); line-height: .91; }
  .hero-lead { font-size: .82rem; margin-top: 12px; }
  .not-ai { font-size: .72rem; }
  .hero-actions { display: grid; width: 100%; }
  .button { width: 100%; }
  .mini-proof { justify-content: center; }
  .hero-media { min-height: 390px; border-radius: 18px; }
  .hero-media::before { inset: -7px; border-radius: 22px; }
  .hero-media > img { height: 390px; border-radius: 17px; }
  .media-shade { border-radius: 17px; }
  .feature-stack { right: 10px; bottom: -34px; width: calc(100% - 20px); }
  .glass-card:nth-child(2), .glass-card:nth-child(3) { display: none; }
  .promo-bar-inner { grid-template-columns: 1fr; text-align: center; }
  .promo-kicker { width: fit-content; margin-inline: auto; }
  .promo-bar-inner > a { justify-self: stretch; }
  .packages-section, .work-section, .process-section, .faq-section { padding: 64px 0; }
  .section-title { margin-bottom: 28px; }
  .package-grid { grid-template-columns: 1fr; gap: 12px; }
  .package-card, .package-card:nth-child(4), .package-card:nth-child(5) { grid-column: auto; }
  .package-card { padding: 18px 16px 15px; }
  .package-card > small { min-height: 0; }
  .package-card ul { min-height: 0; grid-template-columns: 1fr 1fr; gap: 9px 14px; }
  .package-card li { font-size: .64rem; }
  .package-button { min-height: 43px; font-size: .62rem; }
  .package-note { grid-template-columns: 1fr; gap: 8px; text-align: center; }
  .benefits-strip { grid-template-columns: 1fr; padding: 18px; }
  .benefits-strip > div { border-right: 0; }
  .standards-section { padding: 68px 0 42px; }
  .standards-grid { grid-template-columns: 1fr; }
  .standard-card { min-height: 215px; }
  .standards-note { text-align: left; }
  .work-grid { grid-template-columns: 1fr; }
  .work-thumb { height: 200px; }
  .human-card { grid-template-columns: 1fr; text-align: center; }
  .human-avatar { margin-inline: auto; }
  .human-points { grid-template-columns: 1fr 1fr; text-align: left; }
  .process-grid { grid-template-columns: 1fr; }
  .process-grid article { min-height: auto; }
  .faq-list summary { font-size: .73rem; }
  .quote-section { padding-bottom: 58px; }
  .quote-panel { grid-template-columns: 1fr; gap: 20px; padding: 20px; text-align: center; }
  .quote-icon { width: 124px; height: 124px; margin-inline: auto; }
  .quote-form { grid-template-columns: 1fr; text-align: left; }
  .quote-form textarea, .quote-form button, .form-note { grid-column: auto; }
  .quote-steps { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .footer-contact { text-align: left; }
}
@media (max-width:430px) {
  .typewriter-title { font-size: clamp(2.0rem,11.8vw,3.1rem); }
  .hero-media { min-height: 340px; }
  .hero-media > img { height: 340px; }
  .package-card ul, .human-points { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .reveal, .js .reveal { opacity: 1; transform: none; }
  .marquee { width: 100%; flex-wrap: wrap; justify-content: center; transform: none; animation: none; }
  .type-line.typing::after, .type-spark, .float-char, .hero-scan-line { display: none; }
}
`;

/* ─────────────────────────────────────────────────────
   STATIC DATA  (deterministic so no hydration flicker)
───────────────────────────────────────────────────── */
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: ((i * 7.3 + 3) % 90) + 3,
  y: ((i * 6.1 + 10) % 68) + 14,
  size: ((i * 0.38) % 2.2) + 1.5,
  speed: ((i * 0.73) % 4) + 7,
  delay: -(((i * 0.81) % 8)),
}));

const FLOAT_CHARS = [
  "</>","{}", "=>", "01", "//", "[ ]", "&&", "const",
  "fn()", "!==", "var", "||", "??", ">>", "0x1", "..",
].map((char, i) => ({
  id: i,
  char,
  x: ((i * 6.25) % 88) + 4,
  y: ((i * 5.9 + 6) % 74) + 10,
  speed: ((i * 0.63) % 4) + 5,
  delay: -(((i * 0.79) % 6)),
}));

const PACKAGES = [
  { cls: "package-blue",   n: "01", icon: "↗", name: "Landing Page",     desc: "Focused launch for a service, offer or campaign.",       price: 1499, suffix: "",  chip: "Focused launch",   pkg: "Landing Page — from $1,499",    btn: "Choose landing page",    items: ["1 conversion-focused page","Custom responsive design","SEO-ready page structure","Lead form and calls to action","Performance-minded build"] },
  { cls: "package-bronze", n: "02", icon: "⌂", name: "Small Business",   desc: "For tradies, local teams and service businesses.",       price: 2490, suffix: "",  chip: "Business-ready",   pkg: "Small Business — from $2,490",  btn: "Choose small business",  popular: true, items: ["Up to 5 custom pages","Custom website design","Mobile responsive development","Content management system","Contact and enquiry setup","SEO-ready structure"] },
  { cls: "package-silver", n: "03", icon: "⌁", name: "Medium Business",  desc: "For growing businesses ready to convert more.",          price: 3490, suffix: "",  chip: "Growth build",     pkg: "Medium Business — from $3,490", btn: "Choose medium business", items: ["Up to 10 custom pages","Custom website design","Advanced page structure","Conversion-focused layouts","Performance optimisation","Built to support more enquiries"] },
  { cls: "package-gold",   n: "04", icon: "✦", name: "Business Pro",     desc: "A premium platform for established brands.",             price: 4490, suffix: "+", chip: "Premium platform", pkg: "Business Pro — from $4,490",    btn: "Choose business pro",    items: ["15+ custom pages","Custom design system","Advanced functionality","Custom integrations","SEO and performance foundations","Growth-ready architecture"] },
  { cls: "package-purple", n: "05", icon: "◇", name: "eCommerce Store",  desc: "For product businesses ready to sell online.",           price: 4990, suffix: "+", chip: "Sell online",      pkg: "eCommerce Store — from $4,990", btn: "Choose eCommerce",       items: ["Shopify or WooCommerce","Product and category setup","Secure payment integration","Mobile shopping experience","SEO-friendly store structure","Conversion-focused checkout path"] },
];

/* ─────────────────────────────────────────────────────
   PRICE COUNTER COMPONENT
───────────────────────────────────────────────────── */
function PriceCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || startedRef.current) return;
      startedRef.current = true;
      obs.disconnect();
      const dur = 1100;
      const t0 = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - t0) / dur, 1);
        setCount(Math.floor(p * value));
        if (p < 1) requestAnimationFrame(tick);
        else setCount(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>${count.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────── */
export default function App() {
  /* ── scroll progress ── */
  const [scrollPct, setScrollPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      setScrollPct(Math.min(100, Math.max(0, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  /* ── reveal all .reveal elements ── */
  useEffect(() => {
    document.documentElement.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [...document.querySelectorAll(".reveal")];
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("active")); return; }
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("active"); o.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── process connector line draw ── */
  useEffect(() => {
    const grid = document.querySelector(".process-grid");
    if (!grid || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { grid.classList.add("line-visible"); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  /* ── typewriter ── */
  const LINES = ["REAL CUSTOM", "WEBSITES", "BUILT BY A PERSON."];
  const [display, setDisplay] = useState(LINES.map(() => ""));
  const [cursorAt, setCursorAt] = useState(-1);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setDisplay(LINES); return; }
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
    (async () => {
      await sleep(350);
      for (let i = 0; i < LINES.length; i++) {
        if (cancelled) return;
        setCursorAt(i);
        for (let j = 0; j <= LINES[i].length; j++) {
          if (cancelled) return;
          const idx = i, slice = j;
          setDisplay(prev => prev.map((d, k) => k === idx ? LINES[idx].slice(0, slice) : d));
          await sleep(LINES[i][j - 1] === " " ? 20 : 36);
        }
        setCursorAt(-1);
        await sleep(90);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  /* ── mobile menu ── */
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── QR fallback ── */
  useEffect(() => {
    const img = document.querySelector<HTMLImageElement>("[data-qr-image]");
    const container = img?.closest(".quote-qr");
    if (!img || !container) return;
    const fail = () => container.classList.add("is-missing");
    const ok   = () => container.classList.remove("is-missing");
    img.addEventListener("error", fail);
    img.addEventListener("load",  ok);
    if (img.complete) img.naturalWidth > 0 ? ok() : fail();
  }, []);

  /* ── visibility pause ── */
  useEffect(() => {
    const h = () => document.body.classList.toggle("animation-paused", document.hidden);
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, []);

  /* ── package button → select ── */
  const selectPkg = (value: string) => {
    const sel = document.getElementById("package") as HTMLSelectElement | null;
    if (!sel) return;
    const opt = [...sel.options].find(o => o.value === value || o.textContent?.trim() === value);
    if (opt) sel.value = opt.value;
  };

  /* ── marquee items (doubled for seamless loop) ── */
  const marqueeItems = [
    "AUSTRALIA-WIDE SERVICE", "CLEAR QUOTES",
    "CUSTOM RESPONSIVE BUILDS", "DIRECT DEVELOPER SUPPORT",
  ];
  const techItems = [
    "REACT", "NEXT.JS", "TYPESCRIPT", "TAILWIND CSS",
    "NODE.JS", "POSTGRESQL", "VERCEL", "FIGMA", "CLOUDFLARE",
  ];
  const statsItems = [
    "100% CUSTOM CODE", "NO TEMPLATES", "MOBILE-FIRST",
    "SEO STRUCTURED", "FAST LOAD TIMES", "PLAIN ENGLISH SCOPE",
  ];
  const trustItems = [
    "DIRECT DEVELOPER CONTACT", "WRITTEN QUOTES ONLY", "NO AGENCY MARKUPS",
    "ONE POINT OF CONTACT", "AUSTRALIA-WIDE", "POST-LAUNCH SUPPORT",
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      <a className="skip-link" href="#main-content">Skip to main content</a>

      {/* ══════════════ HERO ══════════════ */}
      <header className="hero" id="home">
        <div className="ambient-orbs" aria-hidden="true">
          <span className="orb orb-1" />
          <span className="orb orb-2" />
          <span className="grid-glow" style={{ backgroundSize: "clamp(38px, 9vw, 74px) clamp(38px, 9vw, 74px)" }} />
        </div>

        {/* Scan line */}
        <div className="hero-scan-line" aria-hidden="true" />

        {/* Floating code chars */}
        {FLOAT_CHARS.map(fc => (
          <span
            key={fc.id}
            className="float-char"
            aria-hidden="true"
            style={{ left: `${fc.x}%`, top: `${fc.y}%`, "--fc-speed": `${fc.speed}s`, "--fc-delay": `${fc.delay}s` } as React.CSSProperties}
          >{fc.char}</span>
        ))}

        {/* Sparks */}
        {SPARKS.map(s => (
          <span
            key={s.id}
            className="type-spark"
            aria-hidden="true"
            style={{ "--spark-x": `${s.x}%`, "--spark-y": `${s.y}%`, "--spark-size": `${s.size}px`, "--spark-speed": `${s.speed}s`, "--spark-delay": `${s.delay}s` } as React.CSSProperties}
          />
        ))}

        {/* Nav */}
        <nav className="site-nav reveal fade-down" aria-label="Primary navigation">
          <a href="#home" className="brand" aria-label="Moxi Corp home">
            <span>Moxi <b>Corp</b></span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="navLinks"
            onClick={() => setMenuOpen(v => !v)}
          >{menuOpen ? "✕" : "☰"}</button>
          <div className={`nav-links${menuOpen ? " active" : ""}`} id="navLinks">
            {(["packages", "work", "process", "faq"] as const).map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
            <a href="#quote" onClick={() => setMenuOpen(false)}>Free quote</a>
          </div>
          <a className="nav-cta" href="#quote">Request a free quote</a>
        </nav>

        {/* Hero content */}
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow reveal fade-right stagger-1">
              <span />
              Australian website design &amp; development
            </div>

            <h1
              className="typewriter-title reveal fade-up stagger-2"
              aria-label="Real custom websites built by a person"
            >
              {LINES.map((line, i) => (
                <span
                  key={i}
                  className={`type-line${i === 2 ? " gradient-line" : ""}${cursorAt === i ? " typing" : ""}`}
                  aria-hidden="true"
                >{display[i]}</span>
              ))}
            </h1>

            <div className="not-ai reveal fade-up stagger-3">Direct, human service. No confusing handovers.</div>

            <p className="hero-lead reveal fade-up stagger-4">
              I plan, design and build modern websites around your business, your customers and the action you want them to take.
            </p>

            <div className="hero-actions reveal fade-up stagger-5">
              <a className="button primary" href="#quote">Request a free quote <span aria-hidden="true">→</span></a>
              <a className="button secondary" href="#work">See real work</a>
            </div>

            <div className="mini-proof reveal fade-up stagger-6" aria-label="Moxi Corp service highlights">
              <span><b>01</b> Clear scope</span>
              <span><b>02</b> Responsive build</span>
              <span><b>03</b> Direct support</span>
            </div>
          </div>

          <div className="hero-media reveal scale-in stagger-4">
            <img src="images/program-hero.jpg" alt="Developer workspace showing a custom website project" width="1200" height="800" fetchpriority="high" decoding="async" />
            <div className="media-shade" aria-hidden="true">
              <img
                src={socialGif}
                alt=""
                role="presentation"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "23px",
                  mixBlendMode: "screen",
                  opacity: 0.55,
                  pointerEvents: "none",
                  display: "block",
                  fontSize: 0,
                  color: "transparent",
                }}
              />
            </div>
            <div className="media-label" aria-hidden="true"><span /> Designed for your business</div>
            <div className="feature-stack">
              {[
                { n: "01", title: "Clear delivery plan",       desc: "Scope and timeframe agreed before the build." },
                { n: "02", title: "Responsive by design",      desc: "Built to work across modern screen sizes." },
                { n: "03", title: "A real point of contact",   desc: "Talk directly with the person building your site." },
              ].map(c => (
                <article key={c.n} className="glass-card">
                  <span aria-hidden="true">{c.n}</span>
                  <div><strong>{c.title}</strong><small>{c.desc}</small></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════ MARQUEE ══════════════ */}
      <div className="urgent-strip" aria-label="Service highlights">
        <div className="marquee">
          {[0, 1].flatMap(rep =>
            marqueeItems.flatMap((label, i) => [
              <span key={`${rep}-${i}`}>{label}</span>,
              <i key={`${rep}-d${i}`} aria-hidden="true">◆</i>,
            ])
          )}
        </div>
      </div>

      <main id="main-content">
        {/* ══════════════ PROMO BAR ══════════════ */}
        <section className="promo-bar" aria-label="Package introduction">
          <div className="wrap promo-bar-inner reveal fade-up">
            <div className="promo-kicker">START HERE</div>
            <div>
              <strong>Choose the website starting point that fits your next stage.</strong>
              <span>Every project is confirmed with a clear written scope before work begins.</span>
            </div>
            <a href="#packages">Compare packages <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        {/* ══════════════ PACKAGES ══════════════ */}
        <section className="packages-section" id="packages">
          <div className="wrap">
            <div className="section-title dark-title reveal fade-up">
              <span>SELECT A PACKAGE</span>
              <h2>Five ways to get your next website moving.</h2>
              <p>Choose a starting point, then request a quote so the final scope can be matched to your business.</p>
            </div>

            <div className="package-grid">
              {PACKAGES.map((pkg, i) => (
                <article key={pkg.n} className={`package-card ${pkg.cls} reveal fade-up stagger-${i + 1}`}>
                  {pkg.popular && <div className="popular">Popular</div>}
                  <div className="package-number">{pkg.n}</div>
                  <div className="package-icon" aria-hidden="true">{pkg.icon}</div>
                  <span className="package-name">{pkg.name}</span>
                  <small>{pkg.desc}</small>
                  <div className="was-price">Starting from</div>
                  <div className="package-price">
                    <PriceCounter value={pkg.price} suffix={pkg.suffix} /> <em>AUD</em>
                  </div>
                  <div className="save-chip">{pkg.chip}</div>
                  <ul>{pkg.items.map(item => <li key={item}>{item}</li>)}</ul>
                  <a href="#quote" className="package-button" onClick={() => selectPkg(pkg.pkg)}>{pkg.btn}</a>
                </article>
              ))}
            </div>

            <div className="package-note reveal fade-up">
              <span>Not sure which package fits?</span>
              <p>Tell me what you need and I&apos;ll recommend the best starting point—without locking you into the wrong option.</p>
              <a href="#quote">Ask for a recommendation →</a>
            </div>

            <div className="benefits-strip reveal fade-up" aria-label="Build inclusions">
              {[
                { icon: "</>", title: "Purpose-built",       sub: "Planned around your goals" },
                { icon: "⚡",  title: "Performance-minded",  sub: "Lean, modern foundations" },
                { icon: "▣",   title: "Responsive",          sub: "Designed across screen sizes" },
                { icon: "◎",   title: "Clear scope",         sub: "Know what is included" },
                { icon: "↗",   title: "Launch support",      sub: "Help getting the site live" },
              ].map(b => (
                <div key={b.title}>
                  <span aria-hidden="true">{b.icon}</span>
                  <strong>{b.title}</strong>
                  <small>{b.sub}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TECH STACK STRIP ══════════════ */}
        <div className="urgent-strip--dark" aria-label="Technologies used">
          <div className="marquee marquee--rev">
            {[0, 1].flatMap(rep =>
              techItems.flatMap((label, i) => [
                <span key={`${rep}-${i}`}>{label}</span>,
                <i key={`${rep}-d${i}`} aria-hidden="true">▸</i>,
              ])
            )}
          </div>
        </div>

        {/* ══════════════ STANDARDS ══════════════ */}
        <section className="standards-section" id="standards">
          <div className="wrap standards-layout">
            <div className="standards-intro reveal fade-up">
              <span>MODERN WEB FOUNDATIONS</span>
              <h2>Built around the things a business website actually needs.</h2>
              <p>Good design should look sharp, make the next action obvious and rest on solid technical foundations.</p>
              <a href="#quote">Plan my website <span aria-hidden="true">→</span></a>
            </div>
            <div className="standards-grid">
              {[
                { n: "01", cat: "Performance",     title: "Core Web Vitals-minded",    desc: "Layouts, media and interactions planned with real-world loading and responsiveness in mind.",      href: "https://web.dev/articles/vitals",                                                                           label: "Read Google's guidance ↗" },
                { n: "02", cat: "Accessibility",   title: "Inclusive foundations",     desc: "Semantic structure, keyboard focus, readable contrast and reduced-motion support from the start.",  href: "https://www.w3.org/WAI/standards-guidelines/wcag/",                                                         label: "Read W3C guidance ↗" },
                { n: "03", cat: "Responsive design",title: "Made for modern screens",  desc: "Flexible layouts that adapt across phones, tablets, laptops and larger displays.",                  href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design",         label: "Read MDN guidance ↗" },
                { n: "04", cat: "Business basics",  title: "A goal before a layout",   desc: "Clear website goals, domain and hosting decisions, useful content and a sensible launch plan.",     href: "https://business.gov.au/online-and-digital/business-website/set-up-a-business-website",                    label: "Read business.gov.au ↗" },
              ].map((s, i) => (
                <a key={s.n} className={`standard-card reveal fade-up stagger-${i + 1}`} href={s.href} target="_blank" rel="noopener noreferrer">
                  <b>{s.n}</b>
                  <span>{s.cat}</span>
                  <strong>{s.title}</strong>
                  <p>{s.desc}</p>
                  <small>{s.label}</small>
                </a>
              ))}
            </div>
          </div>
          <p className="standards-note wrap">These are build principles, not automatic score or compliance guarantees. Final results depend on project scope, content, hosting and third-party services.</p>
        </section>

        {/* ══════════════ WORK ══════════════ */}
        <section className="work-section" id="work">
          <div className="wrap">
            <div className="section-title dark-title reveal fade-up">
              <span>SELECTED WORK</span>
              <h2>Real projects. Different industries. One clear goal.</h2>
              <p>Each site is shaped around its audience, content and next action.</p>
            </div>
            <div className="work-grid">
              {[
                { cls: "music",       img: imgAsharMusic, href: "https://asharmusic.com/",                               url: "asharmusic.com",          title: "Ashar Music",           label: "Artist website" },
                { cls: "cleaning",    img: imgWeb1,       href: "https://www.moxicleaningco.com.au/",                    url: "moxicleaningco.com.au",   title: "Moxi Cleaning Co",      label: "Service business" },
                { cls: "property",    img: imgWeb5,       href: "https://addz89.github.io/Moxirealestate_template/",     url: "Real Estate Template",    title: "Real Estate Template",  label: "Real estate concept" },
                { cls: "photography", img: imgWeb7,       href: "https://addz89.github.io/Photography_template/",        url: "Photography Template",    title: "Photography Template",  label: "Photography concept" },
              ].map((w, i) => (
                <a key={w.cls} href={w.href} target="_blank" rel="noopener noreferrer"
                  className={`work-card reveal fade-up stagger-${i + 1} ${w.cls}`}
                  aria-label={`${w.title} — view live site`}>
                  <div className="laptop-shell">
                    {/* Lid */}
                    <div className="laptop-lid">
                      <div className="laptop-cam" aria-hidden="true" />
                      <div className="laptop-viewport">
                        <div className="laptop-toolbar">
                          <div className="laptop-dots" aria-hidden="true">
                            <span /><span /><span />
                          </div>
                          <div className="laptop-url">{w.url}</div>
                        </div>
                        <div className="work-thumb" style={{ backgroundImage: `url(${w.img})` }} />
                      </div>
                    </div>
                    {/* Base */}
                    <div className="laptop-base" aria-hidden="true" />
                    <div className="laptop-foot" aria-hidden="true" />
                  </div>
                  <div className="work-info">
                    <strong>{w.title}</strong>
                    <small>View live ↗</small>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ HUMAN ══════════════ */}
        <section className="human-section" id="about">
          <div className="wrap human-card reveal scale-in">
            <div className="human-avatar" aria-hidden="true">MC</div>
            <div className="human-copy">
              <span>REAL HUMAN SERVICE</span>
              <h2>You talk to the person building your website.</h2>
              <p>I personally plan, design, code and launch each project. That means fewer handovers, clearer answers and a site tailored to your business.</p>
            </div>
            <div className="human-points">
              {[
                { icon: "💬", title: "Direct communication", desc: "One point of contact from start to finish." },
                { icon: "◎",  title: "Clear decisions",      desc: "Know what is included before the build." },
                { icon: "</>",title: "Tailored structure",   desc: "Pages and sections shaped around your goals." },
                { icon: "↗",  title: "Launch support",       desc: "Help connecting, checking and publishing the site." },
              ].map(p => (
                <div key={p.title}>
                  <span aria-hidden="true">{p.icon}</span>
                  <strong>{p.title}</strong>
                  <small>{p.desc}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ STATS STRIP ══════════════ */}
        <div className="urgent-strip--blue" aria-label="Build commitments">
          <div className="marquee">
            {[0, 1].flatMap(rep =>
              statsItems.flatMap((label, i) => [
                <span key={`${rep}-${i}`}>{label}</span>,
                <i key={`${rep}-d${i}`} aria-hidden="true">◆</i>,
              ])
            )}
          </div>
        </div>

        {/* ══════════════ PROCESS ══════════════ */}
        <section className="process-section" id="process">
          <div className="wrap">
            <div className="section-title dark-title reveal fade-up">
              <span>HOW IT WORKS</span>
              <h2>A clear path from idea to launch.</h2>
            </div>
            <div className="process-grid">
              {[
                { n: "01", title: "Tell me about the business", desc: "Share your services, audience, goals and what you want customers to do." },
                { n: "02", title: "Agree on scope",             desc: "You receive a clear recommendation, inclusions and delivery plan before work starts." },
                { n: "03", title: "Design, build and review",   desc: "The site is built around your brand, then refined with your feedback." },
                { n: "04", title: "Test and launch",            desc: "We check the key pages, forms and responsive layout before publishing." },
              ].map((step, i) => (
                <article key={step.n} className={`reveal fade-up stagger-${i + 1}`}>
                  <span>{step.n}</span>
                  <strong>{step.title}</strong>
                  <p>{step.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ FAQ ══════════════ */}
        <section className="faq-section" id="faq">
          <div className="wrap faq-layout">
            <div className="faq-intro reveal fade-up">
              <span>COMMON QUESTIONS</span>
              <h2>Useful answers before you request a quote.</h2>
              <p>Still unsure? Send the enquiry anyway. I can help work out the right starting point.</p>
              <a href="mailto:support@moxicorpstudio.com.au">support@moxicorpstudio.com.au</a>
            </div>
            <div className="faq-list reveal fade-up stagger-2">
              {[
                { q: "Which package should I choose?",      a: "The package cards are starting points. Tell me your page count, features and goals, and I'll recommend the closest fit before anything is agreed." },
                { q: "What do you need from me?",           a: "Usually your business details, services, branding, preferred examples, contact information and any photos or copy you already have. Missing pieces can be identified during scoping." },
                { q: "How long will the website take?",     a: "The timeframe depends on the size, features and how quickly content and feedback are supplied. Your expected delivery window will be confirmed in the written scope." },
                { q: "Can you help with domains and hosting?", a: "Yes, setup guidance can be discussed as part of the project. The exact hosting, domain and ongoing-cost responsibilities will be written into your quote." },
                { q: "Will I be able to update the website?",  a: "That depends on the chosen platform and package. If self-editing is important, mention it in your enquiry so the right setup can be recommended." },
                { q: "What happens before I pay?",          a: "We first confirm what you need. You should receive a clear scope and quote covering inclusions, responsibilities and the payment arrangement before the project begins." },
              ].map(faq => (
                <details key={faq.q}>
                  <summary>{faq.q}<span aria-hidden="true">+</span></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ TRUST STRIP ══════════════ */}
        <div className="urgent-strip--ink" aria-label="Service commitments">
          <div className="marquee marquee--rev">
            {[0, 1].flatMap(rep =>
              trustItems.flatMap((label, i) => [
                <span key={`${rep}-${i}`}>{label}</span>,
                <i key={`${rep}-d${i}`} aria-hidden="true">◆</i>,
              ])
            )}
          </div>
        </div>

        {/* ══════════════ QUOTE ══════════════ */}
        <section className="quote-section" id="quote">
          <div className="wrap quote-wrap">
            <div className="quote-panel reveal fade-up">
              <div className="quote-icon quote-qr">
                <span className="qr-fallback" aria-hidden="true">ADD<br />QR</span>
                <img src={vcardQr} alt="Scan this QR code to save Moxi Corp contact details" width="108" height="108" loading="lazy" decoding="async" data-qr-image />
              </div>
              <div className="quote-copy">
                <span>LET&apos;S BUILD YOUR NEW WEBSITE</span>
                <h2>Request your free quote.</h2>
                <p>Tell me what you need and I&apos;ll recommend a practical starting point.</p>
              </div>
              <form action="https://formspree.io/f/xvzjprdv" method="POST" className="quote-form">
                <input type="hidden" name="_subject" value="New Landing Page Enquiry - Moxi Corp" />
                <input type="text" name="_gotcha" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <label className="sr-only" htmlFor="quote-name">Your name</label>
                <input id="quote-name" type="text" name="name" placeholder="Your name" autoComplete="name" required />
                <label className="sr-only" htmlFor="quote-email">Email address</label>
                <input id="quote-email" type="email" name="email" placeholder="Email address" autoComplete="email" required />
                <label className="sr-only" htmlFor="package">Select a package</label>
                <select id="package" name="package" required>
                  <option value="">Select a package</option>
                  <option>Landing Page — from $1,499</option>
                  <option>Small Business — from $2,490</option>
                  <option>Medium Business — from $3,490</option>
                  <option>Business Pro — from $4,490</option>
                  <option>eCommerce Store — from $4,990</option>
                  <option>Not sure yet</option>
                </select>
                <label className="sr-only" htmlFor="quote-message">Business and website needs</label>
                <textarea id="quote-message" name="message" placeholder="Tell me about your business, pages, features and goals" required />
                <button type="submit">Request free quote <span aria-hidden="true">→</span></button>
                <small className="form-note">Your details are used only to respond to this enquiry.</small>
              </form>
            </div>

            <div className="quote-steps reveal fade-up" aria-label="What happens next">
              {[
                { n: "01", title: "Send the enquiry",       desc: "No commitment—just tell me what you need." },
                { n: "02", title: "Get a recommendation",   desc: "I'll clarify the scope and best package." },
                { n: "03", title: "Review the quote",       desc: "Check inclusions and next steps before deciding." },
              ].map(s => (
                <div key={s.n}>
                  <b>{s.n}</b>
                  <span><strong>{s.title}</strong><small>{s.desc}</small></span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer>
        <div className="wrap footer-grid reveal fade-up">
          <div className="footer-brand">
            <strong>Moxi Corp</strong>
            <span>Real websites. Direct support. Clear scope.</span>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#packages">Packages</a>
            <a href="#work">Our work</a>
            <a href="#process">Process</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="footer-contact">
            <a href="mailto:support@moxicorpstudio.com.au">support@moxicorpstudio.com.au</a>
            <span>ABN 18 936 263 775</span>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} Moxi Corp</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
