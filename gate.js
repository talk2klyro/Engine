const ACCESS_CODE = "BENTO2025"; // ← change this

const input = document.getElementById("codeInput");
const button = document.getElementById("enterBtn");
const error = document.getElementById("error");

button.addEventListener("click", checkCode);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkCode();
});

function checkCode() {
  if (input.value === ACCESS_CODE) {
    sessionStorage.setItem("hasAccess", "true");
    window.location.href = "index.html";
  } else {
    error.textContent = "Invalid access code. Please try again.";
    input.value = "";
    input.focus();
  }
}
