export function initBenefitsReveal() {
  const section = document.querySelector(".benefits");

  if (!section) return;

  const items = [...section.querySelectorAll("[data-benefits-reveal-item]")];

  if (!items.length) return;

  const setProgress = (item, progress) => {
    const opacity = 0.28 + progress * 0.72;
    const translateY = 24 - progress * 24;
    const mediaOpacity = 0.46 + progress * 0.54;
    const mediaScale = 0.94 + progress * 0.06;

    item.style.setProperty("--benefit-reveal-opacity", opacity.toFixed(3));
    item.style.setProperty(
      "--benefit-reveal-y",
      `${translateY.toFixed(1)}px`,
    );
    item.style.setProperty(
      "--benefit-media-opacity",
      mediaOpacity.toFixed(3),
    );
    item.style.setProperty("--benefit-media-scale", mediaScale.toFixed(3));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => setProgress(item, 1));
    return;
  }

  let frameId = null;

  const updateReveal = () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 0.88;
    const endY = viewportHeight * 0.5;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const rawProgress =
        (startY - itemCenter + index * 38) / (startY - endY);
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
