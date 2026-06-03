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
  const closeTriggers = modal
    ? Array.from(modal.querySelectorAll("[data-pricing-request-close]"))
    : [];
  let lastFocusedElement = null;

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

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.elements.website?.value) {
      return;
    }

    successMessage.hidden = false;
  });

  render();
}
