const usernameField = document.querySelector("#usernameField");
const feedBackArea = document.querySelector(".invalid_feedback");
const emailField = document.querySelector("#emailField");
const emailFeedBackArea = document.querySelector(".emailFeedBackArea");
const passwordField = document.querySelector("#passwordField");
const usernameSuccessOutput = document.querySelector(".usernameSuccessOutput");
const showPasswordToggle = document.querySelector(".showPasswordToggle");
const submitBtn = document.querySelector(".submit-btn");

// Toggle password visibility
const handleToggleInput = () => {
  const isPasswordVisible = passwordField.getAttribute("type") === "text";
  passwordField.setAttribute("type", isPasswordVisible ? "password" : "text");
  showPasswordToggle.textContent = isPasswordVisible ? "SHOW" : "HIDE";
};

showPasswordToggle.addEventListener("click", handleToggleInput);

// Email validation
emailField.addEventListener("keyup", (e) => {
  const emailVal = e.target.value.trim();

  emailField.classList.remove("is-invalid");
  emailFeedBackArea.style.display = "none";

  if (emailVal.length > 0) {
    fetch("/authentication/validate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({ email: emailVal }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email_error) {
          submitBtn.disabled = true;
          emailField.classList.add("is-invalid");
          emailFeedBackArea.style.display = "block";
          emailFeedBackArea.innerHTML = `<p>${data.email_error}</p>`;
        } else {
          submitBtn.disabled = false;
        }
      })
      .catch((err) => console.error("Email validation failed", err));
  }
});

// Username validation
usernameField.addEventListener("keyup", (e) => {
  const usernameVal = e.target.value.trim();

  usernameSuccessOutput.style.display = "block";
  usernameSuccessOutput.textContent = `Checking "${usernameVal}"...`;

  usernameField.classList.remove("is-invalid");
  feedBackArea.style.display = "none";

  if (usernameVal.length > 0) {
    fetch("/authentication/validate-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({ username: usernameVal }),
    })
      .then((res) => res.json())
      .then((data) => {
        usernameSuccessOutput.style.display = "none";

        if (data.username_error) {
          usernameField.classList.add("is-invalid");
          feedBackArea.style.display = "block";
          feedBackArea.innerHTML = `<p>${data.username_error}</p>`;
          submitBtn.disabled = true;
        } else {
          submitBtn.disabled = false;
        }
      })
      .catch((err) => {
        usernameSuccessOutput.style.display = "none";
        console.error("Username validation failed", err);
      });
  }
});

// CSRF helper (if using Django)
function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("csrftoken=")) {
      return cookie.split("=")[1];
    }
  }
  return "";
}
