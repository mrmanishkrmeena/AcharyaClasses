

// var uploadField = document.getElementById("myfile");

// uploadField.onchange = function() {
//   if (this.files[0].size > 102400) {
//     alert("File is too big! File size should be 100kb.");
//     this.value = "";
//   }
// };



document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".hobbies input[type='checkbox']");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      checkboxes.forEach((cb) => {
        if (cb !== this) cb.checked = false;
      });
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwn2yFFNFMSqRMoeLJKp90G4yCxDhfvhrmvQ1OedDlerZLJPhZmaSM0txckqtWcYzXd1w/exec'
  const form = document.forms['submit-to-google-sheet']




  // const form = document.querySelector("form");
  const classSelectionCheckboxes = document.querySelectorAll("input[name='class']");

  // Function to gather class selections
  const getClassSelections = () => {
    const selectedClasses = [];
    classSelectionCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedClasses.push(checkbox.value);
      }
    });
    return selectedClasses;
  };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))

    // Extract form data
    const formData = {
      fname: document.querySelector("input[name='fname']").value,
      lname: document.querySelector("input[name='lname']").value,
      email: document.querySelector("input[name='email']").value,
      phone_number: document.querySelector("input[name='phone-number']").value,
      gender: document.querySelector("input[name='gender']:checked")?.value,
      age: document.querySelector("input[name='age']").value,
      dob: document.querySelector("input[name='dob']").value,
      address: document.querySelector("textarea[name='address']").value,
      state: document.querySelector("select[name='state']").value,
      pincode: document.querySelector("input[name='pincode']").value,
      classSelection: getClassSelections(), // Get selected classes
    };

    try {
      const response = await fetch("/submit-form", { // Updated to /submit-form
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Form submitted successfully!");
        form.reset();
      } else {
        alert(data.message || "Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again later.");
    }
  });
});

