
// ============ Contact Form Submission ===========

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const nameInput = form.querySelector("input[placeholder='Name']");
    const emailInput = form.querySelector("input[placeholder='Email']");
    const phoneInput = form.querySelector("input[placeholder='Mobile Number']");
    const messageInput = form.querySelector("textarea[placeholder='Message']");
    
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

    const validateInput = (input, validationFn, errorMessage) => {
        const value = input.value.trim();
        if (!value) {
            input.classList.add("invalid-input");
            input.classList.remove("valid-input");
            input.setCustomValidity("This field is required.");
            return false;
        } else if (validationFn && !validationFn(value)) {
            input.classList.add("invalid-input");
            input.classList.remove("valid-input");
            input.setCustomValidity(errorMessage);
            return false;
        } else {
            input.classList.remove("invalid-input");
            input.classList.add("valid-input");
            input.setCustomValidity("");
            return true;
        }
    };

    nameInput.addEventListener("input", () => validateInput(nameInput));
    emailInput.addEventListener("input", () => validateInput(emailInput, validateEmail, "Invalid email format."));
    phoneInput.addEventListener("input", () => validateInput(phoneInput, validatePhoneNumber, "Invalid phone number."));
    messageInput.addEventListener("input", () => validateInput(messageInput));

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isNameValid = validateInput(nameInput);
        const isEmailValid = validateInput(emailInput, validateEmail, "Invalid email format.");
        const isPhoneValid = validateInput(phoneInput, validatePhoneNumber, "Invalid phone number.");
        const isMessageValid = validateInput(messageInput);

        if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim(),
            };
            console.log("formData:", formData);

            try {
                const response = await fetch("/send-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert("Form submitted successfully!");
                    form.reset();
                    document.querySelectorAll(".valid-input").forEach((input) => input.classList.remove("valid-input"));
                } else {
                    const errorData = await response.json();
                    alert(`Failed to submit: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("An error occurred while submitting the form. Please try again later.");
            }
        }
    });
});

  
  