export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  const successMessage = form.querySelector("[data-contact-success]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.hidden = false;
  });
}
