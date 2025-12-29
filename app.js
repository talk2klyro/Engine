const grid = document.getElementById("grid");
const searchInput = document.getElementById("searchInput");

const items = [
  {
    title: "Creative Thinking",
    description: "Ideas that spark innovation",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    alt: "Mountain landscape"
  },
  {
    title: "Business Inspiration",
    description: "Modern work ideas",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    alt: "People working together"
  }
];

render(items);

function render(data) {
  grid.innerHTML = "";
  data.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <img src="${item.image}" alt="${item.alt}">
      <div class="card-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <button>Save Idea</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  render(items.filter(i =>
    i.title.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q)
  ));
});
