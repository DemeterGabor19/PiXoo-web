export function initPricingConfigurator() {
  const root = document.querySelector("[data-pricing-configurator]");

  if (!root) {
    return;
  }

  const options = Array.from(root.querySelectorAll("[data-pricing-option]"));
  const summaryList = root.querySelector("[data-pricing-summary-list]");
  const emptyState = root.querySelector("[data-pricing-empty]");
  const totalOutput = root.querySelector("[data-pricing-total]");
  const requestOpenButton = root.querySelector("[data-pricing-request-open]");
  const modal = document.querySelector("[data-pricing-request-modal]");
  const requestSummary = modal?.querySelector("[data-pricing-request-summary]");
  const hiddenInput = modal?.querySelector("[data-pricing-request-hidden]");
  const form = modal?.querySelector("[data-pricing-request-form]");
  const successMessage = modal?.querySelector("[data-pricing-request-success]");
  const submitButton = form?.querySelector("[type='submit']");
  const closeTriggers = modal
    ? Array.from(modal.querySelectorAll("[data-pricing-request-close]"))
    : [];
  const revealItems = [
    ...Array.from(root.querySelectorAll(".pricing-group")),
    ...Array.from(root.querySelectorAll(".pricing-option")),
    root.querySelector(".pricing-summary"),
  ].filter(Boolean);
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lastFocusedElement = null;
  let isAwaitingTurnstile = false;
  let isSubmitting = false;

  const fallbackErrorMessage =
    "Most nem sikerült elküldeni az ajánlatkérést. Kérlek, próbáld újra pár perc múlva, vagy írj közvetlenül a hello@pixoo.hu címre.";
  const successText =
    "Köszönöm, megkaptam az ajánlatkérést. Átnézem az összeállítást, és jellemzően 1 munkanapon belül válaszolok.";

  const setMessage = (message, isError = false) => {
    if (!successMessage) {
      return;
    }

    successMessage.textContent = message;
    successMessage.hidden = false;
    successMessage.classList.toggle("is-error", isError);
  };

  const readJsonResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    await response.text();
    throw new Error(fallbackErrorMessage);
  };

  window.pixooPricingTurnstileCallback = () => {
    if (!isAwaitingTurnstile) {
      return;
    }

    isAwaitingTurnstile = false;
    form?.requestSubmit();
  };

  window.pixooPricingTurnstileErrorCallback = () => {
    isAwaitingTurnstile = false;
    isSubmitting = false;
    submitButton?.removeAttribute("disabled");
    setMessage("Nem sikerült befejezni a biztonsági ellenőrzést. Kérlek, próbáld újra.", true);
  };

  const initReveal = () => {
    revealItems.forEach((item, index) => {
      item.classList.add("pricing-reveal");
      item.style.setProperty("--pricing-reveal-delay", `${Math.min(index, 8) * 45}ms`);
    });

    if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
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
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: "HUF",
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("HUF", "Ft");

  const getSelectedOptions = () =>
    options
      .filter((option) => option.checked)
      .map((option) => ({
        label: option.value,
        price: Number(option.dataset.price || 0),
        isRecurring: option.dataset.recurring === "true",
        isVisibleInSummary: option.dataset.pricingSummary !== "false",
      }));

  const render = () => {
    const selectedOptions = getSelectedOptions().filter(
      (option) => option.isVisibleInSummary
    );
    const total = selectedOptions.reduce(
      (sum, option) => (option.isRecurring ? sum : sum + option.price),
      0
    );
    const formatOptionPrice = (option) => {
      if (!option.price) {
        return "Alapár";
      }

      return option.isRecurring
        ? `+${formatPrice(option.price)}/hó-tól`
        : `+${formatPrice(option.price)}`;
    };

    summaryList.innerHTML = selectedOptions
      .map(
        (option) => `
          <li>
            <span>${option.label}</span>
            <strong>${formatOptionPrice(option)}</strong>
          </li>
        `
      )
      .join("");

    emptyState.hidden = selectedOptions.length > 0;
    totalOutput.textContent = `${formatPrice(total)}-tól`;

    const summaryText = [
      ...selectedOptions.map(
        (option) => `- ${option.label}: ${formatOptionPrice(option)}`
      ),
      "",
      `Becsült induló ár: ${formatPrice(total)}-tól`,
    ].join("\n");

    if (requestSummary) {
      requestSummary.textContent = summaryText;
    }

    if (hiddenInput) {
      hiddenInput.value = summaryText;
    }
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.body.classList.remove("is-pricing-modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  };

  const openModal = () => {
    if (!modal) {
      return;
    }

    lastFocusedElement = requestOpenButton;
    modal.hidden = false;
    document.body.classList.add("is-pricing-modal-open");
    render();

    const firstInput = modal.querySelector("input, textarea, button");
    window.requestAnimationFrame(() => firstInput?.focus());
  };

  options.forEach((option) => {
    option.addEventListener("change", render);
  });

  requestOpenButton?.addEventListener("click", openModal);
  closeTriggers.forEach((trigger) => trigger.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (!modal || modal.hidden || event.key !== "Escape") {
      return;
    }

    closeModal();
  });

  form?.addEventListener("submit", async (event) => {
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

  initReveal();
  render();
}
