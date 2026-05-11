export function initProcessTimeline() {
  const timeline = document.querySelector("[data-process-timeline]");

  if (!timeline) return;

  const steps = [...timeline.querySelectorAll("[data-process-step]")];

  function updateTimeline() {
    const timelineRect = timeline.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.58;

    const progressPx = triggerY - timelineRect.top;
    const progress = Math.min(Math.max(progressPx / timelineRect.height, 0), 1);

    timeline.style.setProperty("--process-progress", progress.toString());

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
