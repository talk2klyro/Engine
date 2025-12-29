// ---------------------------
// ACCESS CONTROL
// ---------------------------
if (sessionStorage.getItem("hasAccess") !== "true") {
  window.location.href = "gate.html";
}

// ---------------------------
// ELEMENTS & STATE
// ---------------------------
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");
let items = [];

// ---------------------------
// UTILITY: Roman numerals
// ---------------------------
function toRoman(num) {
  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
  return romans[num - 1] || num;
}

// ---------------------------
// LOAD DATA
// ---------------------------
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    items = data;
    render(items);
  })
  .catch(err => {
    console.error("Failed to load data.json:", err);
    if (grid) grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
  });

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

    // Create carousel HTML
    let imagesHtml = "";
    if (item.images && item.images.length > 0) {
      item.images.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image">
            <img src="${img}" alt="${item.title} - Image ${idx+1}" loading="lazy" />
            <span class="roman-overlay">${toRoman(idx+1)}</span>
          </div>
        `;
      });
    } else if (item.image) {
      imagesHtml = `
        <div class="carousel-image">
          <img src="${item.image}" alt="${item.alt || item.title}" loading="lazy" />
        </div>
      `;
    }

    card.innerHTML = `
      <div class="carousel">${imagesHtml}</div>
      <div class="card-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <button aria-label="Save ${item.title}">Save Idea</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ---------------------------
// SEARCH FUNCTIONALITY
// ---------------------------
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    const filtered = items.filter(
      i => i.title.toLowerCase().includes(value) || i.description.toLowerCase().includes(value)
    );
    render(filtered);
  });
}

// ---------------------------
// AFFILIATE MODAL
// ---------------------------
const affiliateBtn = document.getElementById("affiliateBtn");
const affiliateModal = document.getElementById("affiliateModal");
const closeAffiliate = document.getElementById("closeAffiliate");

if (affiliateBtn && affiliateModal && closeAffiliate) {
  affiliateBtn.addEventListener("click", () => {
    affiliateModal.style.display = "flex";
    affiliateModal.setAttribute("aria-hidden", "false");
  });

  closeAffiliate.addEventListener("click", () => {
    affiliateModal.style.display = "none";
    affiliateModal.setAttribute("aria-hidden", "true");
  });

  // Close modal on outside click
  affiliateModal.addEventListener("click", (e) => {
    if (e.target === affiliateModal) {
      affiliateModal.style.display = "none";
      affiliateModal.setAttribute("aria-hidden", "true");
    }
  });
}
