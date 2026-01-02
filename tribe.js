// ===========================
// TRIBE PAGE LOGIC
// ===========================

// Get tribe key from URL
const params = new URLSearchParams(window.location.search);
const tribeKey = params.get("tribe");

// DOM elements
const tribeTitle = document.getElementById("tribeTitle");
const tribeDescription = document.getElementById("tribeDescription");
const whatsappJoin = document.getElementById("whatsappJoin");

// Guard: no tribe key
if (!tribeKey) {
  tribeTitle.textContent = "Community";
  tribeDescription.textContent =
    "No community was specified.";
  whatsappJoin.style.display = "none";
} else {
  fetch("tribes.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load tribes.json");
      return res.json();
    })
    .then(data => {
      let tribe = null;

      // ✅ Support OBJECT format
      if (!Array.isArray(data) && typeof data === "object") {
        tribe = data[tribeKey];
      }

      // ✅ Support ARRAY format
      if (Array.isArray(data)) {
        tribe = data.find(t => t.id === tribeKey);
      }

      // ❌ Tribe not found
      if (!tribe) {
        tribeTitle.textContent = "Community";
        tribeDescription.textContent =
          "This community is not available at the moment.";
        whatsappJoin.style.display = "none";
        return;
      }

      // ✅ Populate UI
      tribeTitle.textContent = tribe.name || "Community";
      tribeDescription.textContent =
        tribe.description || "Join the discussion.";

      if (tribe.whatsapp) {
        whatsappJoin.href = tribe.whatsapp;
        whatsappJoin.style.display = "inline-flex";
      } else {
        whatsappJoin.style.display = "none";
      }
    })
    .catch(err => {
      console.error("Tribe load error:", err);

      tribeTitle.textContent = "Error";
      tribeDescription.textContent =
        "Unable to load community data. Please try again later.";
      whatsappJoin.style.display = "none";
    });
}
