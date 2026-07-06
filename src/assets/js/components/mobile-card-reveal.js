import { initRevealOnScroll } from "../utils/reveal-on-scroll.js";

export function initMobileCardReveal() {
  const selectors = [
    ".features__card",
    ".additional-services__card",
    ".benefits__card",
    ".process__step",
    ".refs__showcase",
    ".website-audit__preview",
    ".website-audit__impression",
    ".website-audit__check-grid article",
    ".website-audit__feature-panel",
    ".website-audit__note",
    ".website-audit__process-visual",
    ".website-audit__truth",
    ".website-audit__request",
  ];

  const cards = selectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector))
  );

  initRevealOnScroll(cards, {
    className: "mobile-card-reveal",
    delayStep: 55,
    maxDelayItems: 6,
    mediaQuery: "(max-width: 760px)",
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.14,
  });
}
