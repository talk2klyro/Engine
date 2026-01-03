// ===========================
// APP.JS - REFACTORED
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // 🔒 ACCESS CONTROL
  // ---------------------------
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
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
  // UTILITY: Roman numerals
  // ---------------------------
  function toRoman(num) {
    const roman = [
      "", "I", "II", "III", "IV", "V",
      "VI", "VII", "VIII", "IX", "X",
      "XI", "XII", "XIII", "XIV", "XV"
    ];
    return roman[num] || num;
  }

  // ---------------------------
  // RENDER FUNCTION
  // ---------------------------
  function render(data) {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(item => {
      const card = document.createElement("article");
      card.className = "card";
      card.tabIndex = 0;

      // ---------- Carousel ----------
      let imagesHtml = "";
      const imgs = item.images && item.images.length ? item.images : item.image ? [item.image] : [];
      imgs.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image card-image">
            <img src="${img}" alt="${item.alt || item.title} - Image ${idx + 1}" loading="lazy" />
            ${imgs.length > 1 ? `<span class="roman-overlay">${toRoman(idx + 1)}</span>` : ""}
          </div>
        `;
      });

      // ---------- Buttons ----------
      let buttonsHtml = "";

      if (item.reference) {
        buttonsHtml += `<button class="ref-btn" onclick="window.location.href='reference.html?id=${item.reference}'">Reference</button>`;
      }

      if (item.insight) {
        buttonsHtml += `<button class="insight-btn" onclick="window.location.href='insight.html?id=${item.insight}'">🤔 Insight</button>`;
      }

      buttonsHtml += `<button class="comment-btn" onclick="window.open('https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v','_blank')">Comment</button>`;

      // ---------- Card HTML ----------
      card.innerHTML = `
        <div class="carousel">${imagesHtml}</div>
        <div class="card-content">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="card-actions">${buttonsHtml}</div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Make images fill 9:16 container
    document.querySelectorAll('.card-image img').forEach(img => {
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.loading = 'lazy';
    });
  }

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) data = [data]; // support single object
      items = data;
      render(items);
    })
    .catch(err => {
      console.error("Failed to load data.json:", err);
      if (grid) grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    });

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
      render(filtered);
    });
  }

  // ---------------------------
  // AFFILIATE MODAL
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
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal();
    });
  }

});
