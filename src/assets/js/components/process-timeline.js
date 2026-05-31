export function initProcessTimeline() {
  const timeline = document.querySelector("[data-process-timeline]");

  if (!timeline) return;

  const steps = [...timeline.querySelectorAll("[data-process-step]")];
  const cta = document.querySelector(".process__cta");

  function updateTimeline() {
    const timelineRect = timeline.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.58;

    const progressPx = triggerY - timelineRect.top;
    const progress = Math.min(Math.max(progressPx / timelineRect.height, 0), 1);

    timeline.style.setProperty("--process-progress", progress.toString());

    if (cta) {
      const ctaRect = cta.getBoundingClientRect();
      const ctaGlowStart = window.innerHeight * 0.9;
      const ctaGlowEnd = window.innerHeight * 0.64;
      const ctaGlowProgress = Math.min(
        Math.max((ctaGlowStart - ctaRect.top) / (ctaGlowStart - ctaGlowEnd), 0),
        1,
      );
      const ctaOpacity = 0.42 + ctaGlowProgress * 0.58;
      const ctaTranslateY = 18 - ctaGlowProgress * 18;
      const ctaGlowSize = ctaGlowProgress * 34;
      const ctaGlowAlpha = ctaGlowProgress * 0.34;

      cta.style.setProperty("--process-cta-opacity", ctaOpacity.toFixed(3));
      cta.style.setProperty(
        "--process-cta-y",
        `${ctaTranslateY.toFixed(1)}px`,
      );
      cta.style.setProperty(
        "--process-cta-glow-size",
        `${ctaGlowSize.toFixed(1)}px`,
      );
      cta.style.setProperty(
        "--process-cta-glow-alpha",
        ctaGlowAlpha.toFixed(3),
      );
    }

    steps.forEach((step) => {
      const point = step.querySelector(".process__point");

      if (!point) return;

      const pointRect = point.getBoundingClientRect();
      const pointCenterFromTimelineTop =
        pointRect.top - timelineRect.top + pointRect.height / 2;

      const shouldBeActive = progressPx >= pointCenterFromTimelineTop;

      step.classList.toggle("is-active", shouldBeActive);
    });
  }

  updateTimeline();

  window.addEventListener("scroll", updateTimeline, { passive: true });
  window.addEventListener("resize", updateTimeline);
}
