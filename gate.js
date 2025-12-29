/* ============================= */
/* ACCESS CODE CONFIG */
/* ============================= */

const ACCESS_CODE = "BENTO2025"; // ← change this anytime

/* ============================= */
/* ACCESS GATE LOGIC */
/* ============================= */

const input = document.getElementById("codeInput");
const enterBtn = document.getElementById("enterBtn");
const error = document.getElementById("error");

if (enterBtn && input) {
  enterBtn.addEventListener("click", checkCode);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkCode();
  });
}

function checkCode() {
  if (input.value.trim() === ACCESS_CODE) {
    sessionStorage.setItem("hasAccess", "true");
    window.location.href = "index.html";
  } else {
    error.textContent = "Invalid access code. Please try again.";
    input.value = "";
    input.focus();
  }
}

/* ============================= */
/* SUBSCRIPTION MODAL LOGIC */
/* ============================= */

const subscribeBtn = document.getElementById("subscribeBtn");
const modal = document.getElementById("subscriptionModal");
const closeModal = document.getElementById("closeModal");

if (subscribeBtn && modal && closeModal) {
  subscribeBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  });

  closeModal.addEventListener("click", closeSubscriptionModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeSubscriptionModal();
    }
  });
}

function closeSubscriptionModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}
