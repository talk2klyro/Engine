// ===========================
// 🔒 ACCESS GUARD
// ===========================
if (sessionStorage.getItem("hasAccess") !== "true") {
  window.location.href = "gate.html";
}

// ===========================
// DOM REFERENCES
// ===========================
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
const openAffiliateModal = document.getElementById("openAffiliateModal");
const affiliateModal = document.getElementById("affiliateModal");
const closeModalBtn = document.querySelector(".close-modal");

let items = [];

// ===========================
// UTILITIES
// ===========================
function toRoman(num) {
  const roman = [
    "", "I", "II", "III", "IV", "V",
    "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV"
  ];
  return roman[num] || num;
}

// ===========================
// RENDER FUNCTION
// ===========================
function render(data) {
  if (!grid) {
    console.warn("Grid element not found");
    return;
  }

  grid.innerHTML = "";

  if (!data.length) {
    grid.innerHTML = "<p>No content found.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    // ---------- Carousel ----------
    let imagesHtml = "";

    if (Array.isArray(item.images) && item.images.length > 0) {
      item.images.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image">
            <img src="${img}" alt="${item.title} - Image ${idx + 1}" loading="lazy" />
            <span class="roman-overlay">${toRoman(idx + 1)}</span>
          </div>
        `;
      });
    } else if (item.image) {
      imagesHtml = `
        <div class="carousel-image">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>
      `;
    }

    // ---------- Buttons ----------
    let buttonsHtml = "";

    if (item.reference) {
      buttonsHtml += `
        <button class="ref-btn"
          onclick="window.location.href='reference.html?id=${item.reference}'">
          Reference
        </button>
      `;
    }

    if (item.insight) {
      buttonsHtml += `
        <button class="insight-btn"
          onclick="window.location.href='insight.html?id=${item.insight}'">
          🤔 Insight
        </button>
      `;
    }

    buttonsHtml += `
      <button class="comment-btn"
        onclick="window.open(
          'https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v',
          '_blank'
        )">
        Comment
      </button>
    `;

    // ---------- Card Template ----------
    card.innerHTML = `
      <div class="carousel">${imagesHtml}</div>
      <div class="card-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div class="card-actions">
          ${buttonsHtml}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===========================
// FETCH DATA
// ===========================
fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load data.json");
    return res.json();
  })
  .then(data => {
    // Normalize data
    if (!Array.isArray(data)) {
      console.warn("data.json was not an array. Normalizing.");
      data = [data];
    }

    items = data;
    render(items);
  })
  .catch(err => {
    console.error("Data load error:", err);
    if (grid) {
      grid.innerHTML = "<p style='color:red'>Failed to load content.</p>";
    }
  });

// ===========================
// SEARCH
// ===========================
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

// ===========================
// AFFILIATE MODAL
// ===========================
if (openAffiliateModal && affiliateModal) {
  openAffiliateModal.addEventListener("click", () => {
    affiliateModal.classList.remove("hidden");
    affiliateModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
}

if (closeModalBtn && affiliateModal) {
  closeModalBtn.addEventListener("click", () => {
    affiliateModal.classList.add("hidden");
    affiliateModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

if (affiliateModal) {
  affiliateModal.addEventListener("click", e => {
    if (e.target === affiliateModal) {
      affiliateModal.classList.add("hidden");
      affiliateModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });
}
