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

    card.innerHTML = `
      <img src="${item.image}" alt="${item.alt}" loading="lazy" />
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
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value)
  );

  render(filtered);
});
