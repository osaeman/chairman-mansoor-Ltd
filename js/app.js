function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  sidebar.style.display = "flex";
  setTimeout(() => {
    sidebar.style.transform = "translateX(0)";
  }, 10);
}
function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  sidebar.style.transform = "translateX(100%)";
  setTimeout(() => {
    sidebar.style.display = "none";
  }, 300);
}
/* Floating label support */ const inputs = document.querySelectorAll(".input");
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentNode.classList.add("focus");
  });
  input.addEventListener("blur", function () {
    if (this.value.trim() === "") {
      this.parentNode.classList.remove("focus");
    }
  });
  if (input.value.trim() !== "") {
    input.parentNode.classList.add("focus");
  }
});
/* Contact form validation and submission */ const contactForm =
  document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactSuccess = document.getElementById("contactSuccess");
const contactError = document.getElementById("contactError");
const fields = {
  fullName: {
    element: document.getElementById("fullName"),
    error: document.getElementById("fullNameError"),
    message: "Please enter your full name.",
  },
  emailAddress: {
    element: document.getElementById("emailAddress"),
    error: document.getElementById("emailAddressError"),
    message: "Please enter a valid email address.",
  },
  phoneNumber: {
    element: document.getElementById("phoneNumber"),
    error: document.getElementById("phoneNumberError"),
    message: "Please enter your phone number.",
  },
  subject: {
    element: document.getElementById("subject"),
    error: document.getElementById("subjectError"),
    message: "Please enter a subject.",
  },
  message: {
    element: document.getElementById("message"),
    error: document.getElementById("messageError"),
    message: "Please enter your message.",
  },
};
function setFieldError(field, message) {
  if (!field || !field.element || !field.error) return;
  field.element.classList.add("input--error");
  field.element.parentNode.classList.add("has-error");
  field.error.textContent = message;
}
function clearFieldError(field) {
  if (!field || !field.element || !field.error) return;
  field.element.classList.remove("input--error");
  field.element.parentNode.classList.remove("has-error");
  field.error.textContent = "";
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validateContactForm() {
  let isValid = true;
  Object.keys(fields).forEach((key) => {
    clearFieldError(fields[key]);
  });
  if (!fields.fullName.element.value.trim()) {
    setFieldError(fields.fullName, fields.fullName.message);
    isValid = false;
  }
  const emailValue = fields.emailAddress.element.value.trim();
  if (!emailValue || !isValidEmail(emailValue)) {
    setFieldError(fields.emailAddress, fields.emailAddress.message);
    isValid = false;
  }
  if (!fields.phoneNumber.element.value.trim()) {
    setFieldError(fields.phoneNumber, fields.phoneNumber.message);
    isValid = false;
  }
  if (!fields.subject.element.value.trim()) {
    setFieldError(fields.subject, fields.subject.message);
    isValid = false;
  }
  if (!fields.message.element.value.trim()) {
    setFieldError(fields.message, fields.message.message);
    isValid = false;
  }
  return isValid;
}
Object.keys(fields).forEach((key) => {
  const field = fields[key];
  if (field.element) {
    field.element.addEventListener("input", () => {
      clearFieldError(field);
    });
  }
});
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (contactSuccess) contactSuccess.style.display = "none";
    if (contactError) contactError.style.display = "none";
    if (!validateContactForm()) return;
    const formData = new FormData(contactForm);
    const actionUrl = contactForm.getAttribute("action") || "../mailer.php";
    if (contactSubmitBtn) {
      contactSubmitBtn.classList.add("is-loading");
      contactSubmitBtn.disabled = true;
      const btnText = contactSubmitBtn.querySelector(
        ".contact-form__button-text",
      );
      if (btnText) btnText.textContent = "Sending...";
    }
    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        body: formData,
      });
      const result = await response.text();
      if (response.ok && result.trim() === "success") {
        if (contactSuccess) contactSuccess.style.display = "block";
        contactForm.reset();
        inputs.forEach((input) => {
          input.parentNode.classList.remove("focus");
        });
      } else {
        if (contactError) contactError.style.display = "block";
      }
    } catch (error) {
      if (contactError) contactError.style.display = "block";
      console.error("Contact form error:", error);
    } finally {
      if (contactSubmitBtn) {
        contactSubmitBtn.classList.remove("is-loading");
        contactSubmitBtn.disabled = false;
        const btnText = contactSubmitBtn.querySelector(
          ".contact-form__button-text",
        );
        if (btnText) btnText.textContent = "Submit Enquiry";
      }
    }
  });
}
