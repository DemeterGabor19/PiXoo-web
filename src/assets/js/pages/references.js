import { initRevealOnScroll } from "../utils/reveal-on-scroll.js";

export function initReferencesShowcase() {
  const showcase = document.querySelector("[data-references-showcase]");

  if (!showcase) {
    return;
  }

  const section = showcase.closest(".references-showcase");
  const panels = Array.from(showcase.querySelectorAll("[data-reference-panel]"));

  if (!section || !panels.length) {
    return;
  }

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const stackedLayoutQuery = window.matchMedia("(max-width: 980px)");
  let maxTranslate = 0;
  let scrollDistance = 0;
  let ticking = false;

  const setActivePanel = (activePanel) => {
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel === activePanel);
    });
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const isHorizontalMode = () =>
    !reduceMotionQuery.matches && !stackedLayoutQuery.matches;

  const measure = () => {
    section.style.setProperty("--reference-panel-count", panels.length);

    if (!isHorizontalMode()) {
      showcase.style.removeProperty("--reference-track-x");
      section.style.removeProperty("height");
      setActivePanel(panels[0]);
      return;
    }

    maxTranslate = Math.max(0, showcase.scrollWidth - window.innerWidth);
    scrollDistance = Math.max(1, maxTranslate);
    const trackHeight = showcase.getBoundingClientRect().height;
    section.style.height = `${trackHeight + scrollDistance}px`;
  };

  const update = () => {
    ticking = false;

    if (!isHorizontalMode()) {
      return;
    }

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrolled = window.scrollY - sectionTop;
    const progress = clamp(scrolled / scrollDistance, 0, 1);
    const translateX = -maxTranslate * progress;
    const activeIndex = clamp(
      Math.round(progress * (panels.length - 1)),
      0,
      panels.length - 1
    );

    showcase.style.setProperty("--reference-track-x", `${translateX}px`);
    setActivePanel(panels[activeIndex]);
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  const refresh = () => {
    measure();
    update();
  };

  refresh();

  window.requestAnimationFrame(refresh);

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh, { once: true });
  reduceMotionQuery.addEventListener("change", refresh);
  stackedLayoutQuery.addEventListener("change", refresh);

  if (document.fonts?.ready) {
    document.fonts.ready.then(refresh).catch(() => {});
  }

  showcase.querySelectorAll("img").forEach((image) => {
    if (!image.complete) {
      image.addEventListener("load", refresh, { once: true });
    }
  });

  initRevealOnScroll(panels, {
    className: "mobile-card-reveal",
    delayStep: 70,
    mediaQuery: "(max-width: 980px)",
  });
  initReferenceModals(section);
}

function initReferenceModals(root) {
  const openButtons = Array.from(
    root.querySelectorAll("[data-reference-modal-open]")
  );
  const closeTriggers = Array.from(
    root.querySelectorAll("[data-reference-modal-close]")
  );
  let activeModal = null;
  let lastFocusedElement = null;

  if (!openButtons.length) {
    return;
  }

  const getFocusableElements = (modal) =>
    Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    );

  const closeModal = () => {
    if (!activeModal) {
      return;
    }

    activeModal.hidden = true;
    document.body.classList.remove("is-reference-modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    activeModal = null;
    lastFocusedElement = null;
  };

  const openModal = (modalId, trigger) => {
    const modal = document.getElementById(modalId);

    if (!modal) {
      return;
    }

    lastFocusedElement = trigger;
    activeModal = modal;
    modal.hidden = false;
    document.body.classList.add("is-reference-modal-open");

    const panel = modal.querySelector(".reference-modal__panel");
    const focusable = getFocusableElements(modal);
    const firstFocusable = focusable[0] || panel;

    window.requestAnimationFrame(() => {
      firstFocusable.focus();
    });
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.referenceModalOpen, button);
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!activeModal) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = getFocusableElements(activeModal);

    if (!focusable.length) {
      event.preventDefault();
      activeModal.querySelector(".reference-modal__panel")?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
