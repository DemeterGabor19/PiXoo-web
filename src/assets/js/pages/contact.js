export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  const successMessage = form.querySelector("[data-contact-success]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.elements.website?.value) {
      return;
    }

    successMessage.hidden = false;
  });
}
