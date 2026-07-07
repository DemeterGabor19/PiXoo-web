export function initWebsiteAuditReveal() {
  const section = document.querySelector(".website-audit");

  if (!section) return;

  const revealItems = [
    ...section.querySelectorAll(
      [
        ".website-audit__hero-content",
        ".website-audit__preview",
        ".website-audit__intro-content",
        ".website-audit__impression",
        ".website-audit__section-head",
        ".website-audit__result",
        ".website-audit__deliverables-copy",
        ".website-audit__feature-panel",
        ".website-audit__note",
        ".website-audit__process-visual",
        ".website-audit__process-copy",
        ".website-audit__truth",
        ".website-audit__request",
      ].join(",")
    ),
  ];
  const checkCards = [
    ...section.querySelectorAll(".website-audit__check-grid article"),
  ];
  const heroStats = [
    ...section.querySelectorAll(".website-audit__hero-stats article"),
  ];
  const listItems = [
    ...section.querySelectorAll(
      ".website-audit__deliverables-list article, .website-audit__process-list li"
    ),
  ];
  const items = [...revealItems, ...heroStats, ...checkCards, ...listItems];

  if (!items.length) return;

  const setProgress = (item, progress) => {
    const opacity = 0.32 + progress * 0.68;
    const translateY = 26 - progress * 26;
    const scale = 0.97 + progress * 0.03;
    const glow = progress * 0.16;

    item.style.setProperty("--audit-reveal-opacity", opacity.toFixed(3));
    item.style.setProperty("--audit-reveal-y", `${translateY.toFixed(1)}px`);
    item.style.setProperty("--audit-reveal-scale", scale.toFixed(3));
    item.style.setProperty("--audit-reveal-glow", glow.toFixed(3));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => setProgress(item, 1));
    return;
  }

  let frameId = null;
  const clamp = (value) => Math.min(Math.max(value, 0), 1);

  const updateReveal = () => {
    const viewportHeight = window.innerHeight;
    const startY = viewportHeight * 0.88;
    const endY = viewportHeight * 0.45;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const stagger = Math.min(index % 8, 7) * 20;
      const rawProgress = (startY - itemCenter + stagger) / (startY - endY);

      setProgress(item, clamp(rawProgress));
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
