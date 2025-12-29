// ---------------------------
// ACCESS CONTROL
// ---------------------------
if (sessionStorage.getItem("hasAccess") !== "true") {
  window.location.href = "gate.html";
}

// ---------------------------
// DATA & RENDERING
// ---------------------------
const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");

let items = [];

// Utility: convert number to Roman numerals
function toRoman(num) {
  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
  return romans[num - 1] || num;
}

// Load JSON data
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    items = data;
    render(items);
  })
  .catch((err) => {
    console.error("Failed to load data.json:", err);
    grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
  });

// Render function
function render(data) {
  grid.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    // Build carousel HTML for multiple images
    let imagesHtml = "";
    if (item.images && item.images.length > 0) {
      item.images.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image">
            <img src="${img}" alt="${item.title} - Image ${idx + 1}" loading="lazy" />
            <span class="roman-overlay">${toRoman(idx + 1)}</span>
          </div>
        `;
      });
    } else if (item.image) {
      // fallback to single image if no array
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
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value)
    );

    render(filtered);
  });
}
