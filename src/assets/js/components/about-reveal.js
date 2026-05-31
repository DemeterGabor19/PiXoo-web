export function initAboutReveal() {
  const about = document.querySelector(".about");

  if (!about) return;

  const items = [...about.querySelectorAll("[data-about-reveal-item]")];

  if (!items.length) return;

  const setProgress = (item, progress) => {
    const opacity = 0.34 + progress * 0.66;
    const alpha = 0.42 + progress * 0.48;
    const glowSize = progress * 14;
    const glowAlpha = progress * 0.14;

    item.style.setProperty("--about-reveal-opacity", opacity.toFixed(3));
    item.style.setProperty("--about-reveal-alpha", alpha.toFixed(3));
    item.style.setProperty("--about-reveal-glow-size", `${glowSize.toFixed(1)}px`);
    item.style.setProperty("--about-reveal-glow-alpha", glowAlpha.toFixed(3));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => setProgress(item, 1));
    return;
  }

  let frameId = null;

  const updateReveal = () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 0.86;
    const endY = viewportHeight * 0.44;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const rawProgress = (startY - itemCenter) / (startY - endY);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      setProgress(item, progress);
    });

    frameId = null;
  };

  const requestUpdate = () => {
    if (frameId === null) {
      frameId = window.requestAnimationFrame(updateReveal);
    }
  };

  updateReveal();

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}
