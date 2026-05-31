export function initFeaturesReveal() {
  const reveal = document.querySelector("[data-features-reveal]");
  const cards = [...document.querySelectorAll("[data-features-card]")];

  if (!reveal && !cards.length) return;

  const items = reveal
    ? [...reveal.querySelectorAll("[data-features-reveal-item]")]
    : [];
  const cardRows = [...new Set(cards.map((card) => card.dataset.featuresRow))];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => {
      item.style.setProperty("--reveal-progress", "1");
      item.style.setProperty("--reveal-opacity", "1");
      item.style.setProperty("--reveal-title-brightness", "1");
      item.style.setProperty("--reveal-text-alpha", "0.92");
      item.style.setProperty("--reveal-glow-size", "18px");
      item.style.setProperty("--reveal-glow-alpha", "0.18");
    });
    cards.forEach((card) => {
      card.style.setProperty("--feature-card-opacity", "1");
      card.style.setProperty("--feature-card-y", "0px");
      card.style.setProperty("--feature-line-progress", "1");
      card.style.setProperty("--feature-line-glow-alpha", "0.56");
    });
    return;
  }

  let frameId = null;

  const clamp = (value) => Math.min(Math.max(value, 0), 1);

  const updateReveal = () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 0.86;
    const endY = viewportHeight * 0.42;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const rawProgress = (startY - itemCenter) / (startY - endY);
      const progress = clamp(rawProgress);
      const isTitle = item.classList.contains("features__title");
      const minOpacity = isTitle ? 0.32 : 0.38;
      const minAlpha = isTitle ? 1 : 0.24;
      const opacity = minOpacity + progress * (1 - minOpacity);
      const textAlpha = minAlpha + progress * (0.92 - minAlpha);
      const titleBrightness = 0.58 + progress * 0.42;
      const glowSize = progress * 18;
      const glowAlpha = progress * 0.18;

      item.style.setProperty("--reveal-progress", progress.toFixed(3));
      item.style.setProperty("--reveal-opacity", opacity.toFixed(3));
      item.style.setProperty(
        "--reveal-title-brightness",
        titleBrightness.toFixed(3),
      );
      item.style.setProperty("--reveal-text-alpha", textAlpha.toFixed(3));
      item.style.setProperty("--reveal-glow-size", `${glowSize.toFixed(1)}px`);
      item.style.setProperty("--reveal-glow-alpha", glowAlpha.toFixed(3));
    });

    cardRows.forEach((row) => {
      const rowCards = cards.filter((card) => card.dataset.featuresRow === row);
      const firstCard = rowCards[0];

      if (!firstCard) return;

      const rect = firstCard.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const rawProgress = (startY - rowCenter) / (startY - endY);
      const progress = clamp(rawProgress);
      const opacity = 0.28 + progress * 0.72;
      const translateY = 24 - progress * 24;
      const lineGlowAlpha = progress * 0.56;

      rowCards.forEach((card) => {
        card.style.setProperty("--feature-card-opacity", opacity.toFixed(3));
        card.style.setProperty("--feature-card-y", `${translateY.toFixed(1)}px`);
        card.style.setProperty("--feature-line-progress", progress.toFixed(3));
        card.style.setProperty(
          "--feature-line-glow-alpha",
          lineGlowAlpha.toFixed(3),
        );
      });
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
