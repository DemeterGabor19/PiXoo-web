import { initRevealOnScroll } from "../utils/reveal-on-scroll.js";

const fallbackErrorMessage =
  "Most nem sikerült elküldeni az üzenetet. Kérlek, próbáld újra pár perc múlva, vagy írj közvetlenül a hello@pixoo.hu címre.";

const successText =
  "Köszönöm, megkaptam az üzeneted. Átnézem a részleteket, és jellemzően 1 munkanapon belül válaszolok.";

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  const successMessage = form.querySelector("[data-contact-success]");
  const submitButton = form.querySelector("[type='submit']");
  const faqCards = Array.from(document.querySelectorAll(".contact-faq article"));
  let isAwaitingTurnstile = false;
  let isSubmitting = false;

  const setMessage = (message, isError = false) => {
    if (!successMessage) {
      return;
    }

    successMessage.textContent = message;
    successMessage.hidden = false;
    successMessage.classList.toggle("is-error", isError);
  };

  window.pixooContactTurnstileCallback = () => {
    if (!isAwaitingTurnstile) {
      return;
    }

    isAwaitingTurnstile = false;
    form.requestSubmit();
  };

  window.pixooContactTurnstileErrorCallback = () => {
    isAwaitingTurnstile = false;
    isSubmitting = false;
    submitButton?.removeAttribute("disabled");
    setMessage("Nem sikerült befejezni a biztonsági ellenőrzést. Kérlek, próbáld újra.", true);
  };

  const readJsonResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    await response.text();
    throw new Error(fallbackErrorMessage);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting || isAwaitingTurnstile) {
      return;
    }

    if (form.elements.website?.value) {
      return;
    }

    if (!form.hasAttribute("data-wp-submit")) {
      setMessage(successText);
      return;
    }

    const formData = new FormData(form);

    if (!formData.get("cf-turnstile-response")) {
      const turnstileElement = form.querySelector(".cf-turnstile");

      if (window.turnstile && turnstileElement) {
        isAwaitingTurnstile = true;
        submitButton?.setAttribute("disabled", "disabled");
        setMessage("Biztonsági ellenőrzés folyamatban...");
        window.turnstile.execute(turnstileElement);
        return;
      }

      setMessage("A biztonsági ellenőrzés még töltődik. Kérlek, várj pár másodpercet, majd próbáld újra.", true);
      return;
    }

    submitButton?.setAttribute("disabled", "disabled");
    isSubmitting = true;
    setMessage("Küldés folyamatban...");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });
      const result = await readJsonResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(result.data?.message || result.message || fallbackErrorMessage);
      }

      form.reset();
      window.turnstile?.reset();
      setMessage(result.data?.message || successText);
    } catch (error) {
      window.turnstile?.reset();
      setMessage(error instanceof Error ? error.message : fallbackErrorMessage, true);
    } finally {
      isSubmitting = false;
      submitButton?.removeAttribute("disabled");
    }
  });

  initRevealOnScroll(faqCards, {
    delayStep: 65,
  });
}
