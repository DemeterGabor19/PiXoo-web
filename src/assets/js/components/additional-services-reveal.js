export function initAdditionalServicesReveal() {
  const section = document.querySelector("[data-additional-services]");

  if (!section) return;

  const cards = [...section.querySelectorAll("[data-additional-services-card]")];

  if (!cards.length) return;

  const setCardProgress = (card, progress) => {
    const opacity = 0.34 + progress * 0.66;
    const translateY = 18 - progress * 18;
    const lineWhiteAlpha = 0.78 - progress * 0.46;
    const lineWhiteSoftAlpha = lineWhiteAlpha * 0.9;
    const lineBlueAlpha = 0.16 + progress * 0.84;
    const lineBlueSoftAlpha = lineBlueAlpha * 0.94;
    const lineBlueTailAlpha = lineBlueAlpha * 0.18;
    const lineGlowAlpha = progress * 0.5;
    const mediaGlowAlpha = 0.08 + progress * 0.18;
    const mediaGlowSize = 22 + progress * 14;

    card.style.setProperty("--additional-card-opacity", opacity.toFixed(3));
    card.style.setProperty(
      "--additional-card-y",
      `${translateY.toFixed(1)}px`,
    );
    card.style.setProperty(
      "--additional-line-white-alpha",
      lineWhiteAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-line-white-soft-alpha",
      lineWhiteSoftAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-line-blue-alpha",
      lineBlueAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-line-blue-soft-alpha",
      lineBlueSoftAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-line-blue-tail-alpha",
      lineBlueTailAlpha.toFixed(3),
    );
    card.style.setProperty("--additional-line-progress", progress.toFixed(3));
    card.style.setProperty(
      "--additional-line-glow-alpha",
      lineGlowAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-media-glow-alpha",
      mediaGlowAlpha.toFixed(3),
    );
    card.style.setProperty(
      "--additional-media-glow-size",
      `${mediaGlowSize.toFixed(1)}px`,
    );
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cards.forEach((card) => setCardProgress(card, 1));
    return;
  }

  let frameId = null;

  const updateReveal = () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 0.88;
    const endY = viewportHeight * 0.52;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const rawProgress =
        (startY - cardCenter + index * 58) / (startY - endY);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      setCardProgress(card, progress);
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
