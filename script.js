const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");

let items = [];

// Load data
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    items = data;
    render(items);
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

// Search filtering
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(value) ||
    item.description.toLowerCase().includes(value)
  );

  render(filtered);
});
