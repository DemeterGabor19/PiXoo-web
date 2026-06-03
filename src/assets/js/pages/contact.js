import { initRevealOnScroll } from "../utils/reveal-on-scroll.js";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  const successMessage = form.querySelector("[data-contact-success]");
  const faqCards = Array.from(document.querySelectorAll(".contact-faq article"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.elements.website?.value) {
      return;
    }

    successMessage.hidden = false;
  });

  initRevealOnScroll(faqCards, {
    delayStep: 65,
  });
}
