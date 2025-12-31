// ---------------------------
// 🔒 ACCESS CONTROL
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
    if (grid) {
      grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
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

    // ---------- Images ----------
    let imagesHtml = "";
    if (item.images?.length) {
      item.images.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image">
            <img src="${img}" alt="${item.title} image ${idx + 1}" loading="lazy" />
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

    // ---------- Action Buttons ----------
    let actionsHtml = "";

    if (item.reference) {
      actionsHtml += `
        <button
          class="action-btn"
          aria-label="View references"
          onclick="openReference('${item.reference}')"
        >🔖</button>
      `;
    }

    if (item.insight) {
      actionsHtml += `
        <button
          class="action-btn"
          aria-label="Learn more"
          onclick="openInsight('${item.insight}')"
        >🤔</button>
      `;
    }

    if (item.comments) {
      actionsHtml += `
        <button
          class="action-btn"
          aria-label="View comments"
          onclick="openComments('${item.comments}')"
        >💬</button>
      `;
    }

    if (item.tribe) {
      actionsHtml += `
        <button
          class="tribe-btn"
          data-tribe="${item.tribe}"
        >Discuss</button>
      `;
    }

    // ---------- Card Template ----------
    card.innerHTML = `
      <div class="carousel">${imagesHtml}</div>

      <div class="card-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        ${actionsHtml ? `<div class="card-actions">${actionsHtml}</div>` : ""}
      </div>
    `;

    grid.appendChild(card);
  });

  // Reattach tribe button events after rendering
  attachTribeEvents();
}

// ---------------------------
// SEARCH
// ---------------------------
if (searchInput) {
  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    const filtered = items.filter(i =>
      i.title.toLowerCase().includes(value) ||
      i.description.toLowerCase().includes(value)
    );
    render(filtered);
  });
}

// ---------------------------
// ACTION HANDLERS
// ---------------------------
function openReference(refId) {
  window.location.href = `reference.html?id=${refId}`;
}

function openInsight(insightId) {
  window.location.href = `insight.html?id=${insightId}`;
}

function openComments(commentId) {
  window.location.href = `comments.html?id=${commentId}`;
}

// ---------------------------
// TRIBE DISCUSSION BUTTONS
// ---------------------------
function attachTribeEvents() {
  const tribeButtons = document.querySelectorAll(".tribe-btn");
  tribeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const tribe = button.dataset.tribe;
      window.location.href = `discussion.html?tribe=${encodeURIComponent(tribe)}`;
    });
  });
}

// ---------------------------
// AFFILIATE MODAL
// ---------------------------
const openBtn = document.getElementById("openAffiliateModal");
const modal = document.getElementById("affiliateModal");
const closeBtn = document.querySelector(".close-modal");

if (openBtn && modal && closeBtn) {
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  function closeAffiliateModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeAffiliateModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeAffiliateModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeAffiliateModal();
  });
}
