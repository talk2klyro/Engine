/* =============================
   ACCESS CODE CONFIG
============================= */

const ACCESS_CODE = "BENTO2025"; // change anytime

/* =============================
   DOM REFERENCES
============================= */

const input = document.getElementById("codeInput");
const enterBtn = document.getElementById("enterBtn");
const error = document.getElementById("error");

const subscribeBtn = document.getElementById("subscribeBtn");
const modal = document.getElementById("subscriptionModal");
const closeModalBtn = document.getElementById("closeModal");

/* =============================
   ACCESS LOGIC
============================= */

function checkCode() {
  if (!input) return;

  if (input.value.trim() === ACCESS_CODE) {
    sessionStorage.setItem("hasAccess", "true");
    window.location.href = "index.html";
  } else {
    if (error) {
      error.textContent = "Invalid access code. Please try again.";
    }
    input.value = "";
    input.focus();
  }
}

if (enterBtn && input) {
  enterBtn.addEventListener("click", checkCode);

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") checkCode();
  });
}

/* =============================
   SUBSCRIPTION MODAL (OPTIONAL)
============================= */

if (subscribeBtn && modal && closeModalBtn) {
  subscribeBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  });

  closeModalBtn.addEventListener("click", closeSubscriptionModal);

  modal.addEventListener("click", e => {
    if (e.target === modal) closeSubscriptionModal();
  });
}

function closeSubscriptionModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
                                      }
