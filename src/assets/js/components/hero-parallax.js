export function initHeroParallax() {
  const hero = document.querySelector(".hero");

  if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const defaultGlowX = 72;
  const defaultGlowY = 36;
  let frameId = null;
  let targetX = 0;
  let targetY = 0;
  let targetGlowX = defaultGlowX;
  let targetGlowY = defaultGlowY;
  let currentX = 0;
  let currentY = 0;
  let currentGlowX = defaultGlowX;
  let currentGlowY = defaultGlowY;

  const easeValue = (current, target, strength) =>
    current + (target - current) * strength;

  const setHeroMotion = () => {
    currentX = easeValue(currentX, targetX, 0.08);
    currentY = easeValue(currentY, targetY, 0.08);
    currentGlowX = easeValue(currentGlowX, targetGlowX, 0.14);
    currentGlowY = easeValue(currentGlowY, targetGlowY, 0.14);

    hero.style.setProperty("--hero-brand-shift-x", `${currentX * 18}px`);
    hero.style.setProperty("--hero-brand-shift-y", `${currentY * 12}px`);
    hero.style.setProperty("--hero-glow-x", `${currentGlowX}%`);
    hero.style.setProperty("--hero-glow-y", `${currentGlowY}%`);

    const isSettled =
      Math.abs(currentX - targetX) < 0.001 &&
      Math.abs(currentY - targetY) < 0.001 &&
      Math.abs(currentGlowX - targetGlowX) < 0.05 &&
      Math.abs(currentGlowY - targetGlowY) < 0.05;

    if (isSettled) {
      frameId = null;
      return;
    }

    frameId = window.requestAnimationFrame(setHeroMotion);
  };

  const scheduleHeroMotion = () => {
    if (frameId === null) {
      frameId = window.requestAnimationFrame(setHeroMotion);
    }
  };

  hero.addEventListener("pointermove", (event) => {
    hero.classList.add("is-pointer-inside");

    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    targetX = Math.max(-1, Math.min(1, (x - 0.5) * 2));
    targetY = Math.max(-1, Math.min(1, (y - 0.5) * 2));
    targetGlowX = x * 100;
    targetGlowY = y * 100;

    scheduleHeroMotion();
  });

  hero.addEventListener("pointerleave", () => {
    hero.classList.remove("is-pointer-inside");

    targetX = 0;
    targetY = 0;
    targetGlowX = defaultGlowX;
    targetGlowY = defaultGlowY;

    scheduleHeroMotion();
  });
}
