// ===========================
// APP.JS – Refly (Card-Based)
// ===========================

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // 🔒 ACCESS CONTROL
  // ---------------------------
  if (sessionStorage.getItem("hasAccess") !== "true") {
    window.location.href = "gate.html";
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
  // RENDER POSTS
  // ---------------------------
  function render(data) {
    if (!grid) return;
    grid.innerHTML = "";

    data.forEach(post => {
      const article = document.createElement("article");
      article.className = "post";

      // Header
      article.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.description}</p>
      `;

      // Cards
      if (Array.isArray(post.cards)) {
        const cardsWrapper = document.createElement("div");
        cardsWrapper.className = "cards-wrapper";

        post.cards.forEach(card => {
          const cardDiv = document.createElement("div");
          cardDiv.className = "card";

          cardDiv.innerHTML = `
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          `;

          cardsWrapper.appendChild(cardDiv);
        });

        article.appendChild(cardsWrapper);
      }

      // Actions
      const actions = document.createElement("div");
      actions.className = "card-actions";

      if (post.insight) {
        actions.innerHTML += `
          <button class="insight-btn"
            onclick="window.location.href='insight.html?id=${post.insight}'">
            🤔 Insight
          </button>
        `;
      }

      if (post.reference) {
        actions.innerHTML += `
          <button class="ref-btn"
            onclick="window.location.href='reference.html?id=${post.reference}'">
            Reference
          </button>
        `;
      }

      actions.innerHTML += `
        <button class="comment-btn"
          onclick="window.open('https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v','_blank')">
          Comment
        </button>
      `;

      article.appendChild(actions);
      grid.appendChild(article);
    });
  }

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  fetch("data.json")
    .then(res => res.json())
    .then(data => {
      items = Array.isArray(data) ? data : [];
      render(items);
    })
    .catch(err => {
      console.error("Failed to load data:", err);
      grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    });

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      render(
        items.filter(post =>
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q)
        )
      );
    });
  }

  // ---------------------------
  // AFFILIATE MODAL (SAFE)
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
