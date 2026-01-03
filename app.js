// ===========================
// APP.JS — REFLY FEED (STABLE)
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // 🔒 ACCESS GATE
  // ---------------------------
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.replace("gate.html");
    return;
  }

  // ---------------------------
  // DOM REFERENCES
  // ---------------------------
  const grid = document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");

  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  let items = [];

  // ---------------------------
  // UTILITIES
  // ---------------------------
  function toRoman(num) {
    const roman = ["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
    return roman[num] || num;
  }

  // ---------------------------
  // RENDER CARDS
  // ---------------------------
  function render(data) {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;

      // Images
      const images = item.images?.length
        ? item.images
        : item.image
        ? [item.image]
        : [];

      const carouselHTML = images.map((img, i) => `
        <div class="carousel-image card-image">
          <img src="${img}" alt="${item.title}" loading="lazy" />
          ${images.length > 1 ? `<span class="roman-overlay">${toRoman(i + 1)}</span>` : ""}
        </div>
      `).join("");

      // Buttons
      const buttons = `
        ${item.reference ? `<button class="ref-btn" onclick="location.href='reference.html?id=${item.reference}'">Reference</button>` : ""}
        ${item.insight ? `<button class="insight-btn" onclick="location.href='insight.html?id=${item.insight}'">🤔 Insight</button>` : ""}
        <button class="comment-btn" onclick="window.open('https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v','_blank')">Comment</button>
      `;

      card.innerHTML = `
        <div class="carousel">${carouselHTML}</div>
        <div class="card-content">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="card-actions">${buttons}</div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Image safety
    document.querySelectorAll(".card-image img").forEach(img => {
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.loading = "lazy";
    });
  }

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      items = Array.isArray(data) ? data : [data];
      render(items);
    })
    .catch(() => {
      grid.innerHTML = `<p style="color:#ff4d4d">Failed to load content.</p>`;
    });

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      render(items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      ));
    });
  }

  // ---------------------------
  // AFFILIATE MODAL (FIXED)
  // ---------------------------
  if (openAffiliateModal && affiliateModal && closeModalBtn) {

    const closeModal = () => {
      affiliateModal.classList.add("hidden");
      affiliateModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    openAffiliateModal.addEventListener("click", () => {
      affiliateModal.classList.remove("hidden");
      affiliateModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });

    closeModalBtn.addEventListener("click", closeModal);

    affiliateModal.addEventListener("click", e => {
      if (e.target === affiliateModal) closeModal();
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) {
        closeModal();
      }
    });
  }

});
