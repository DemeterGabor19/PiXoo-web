export function initRevealOnScroll(items, options = {}) {
  const elements = items.filter(Boolean);

  if (!elements.length) {
    return;
  }

  const {
    className = "mobile-reveal",
    delayStep = 45,
    maxDelayItems = 8,
    mediaQuery = "(max-width: 760px)",
    rootMargin = "0px 0px -10% 0px",
    threshold = 0.12,
  } = options;
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealQuery = window.matchMedia(mediaQuery);

  if (!revealQuery.matches) {
    return;
  }

  elements.forEach((element, index) => {
    element.classList.add(className);
    element.style.setProperty(
      "--mobile-reveal-delay",
      `${Math.min(index, maxDelayItems) * delayStep}ms`
    );
  });

  if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin, threshold }
  );

  elements.forEach((element) => observer.observe(element));
}
