// ===========================
// APP.JS – Refly Card-based Posts (Refactored & Optimized)
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
  // CONSTANTS & DOM REFERENCES
  // ---------------------------
  const WHATSAPP_URL = "https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v";

  const grid = document.getElementById("posts-container") || document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = document.querySelector(".close-modal");

  let posts = [];

  // ---------------------------
  // UTILITY FUNCTIONS
  // ---------------------------
  const toRoman = num => ["", "I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"][num] || num;

  // ---------------------------
  // FETCH POSTS
  // ---------------------------
  async function loadPosts() {
    try {
      const res = await fetch("data.json");
      let data = await res.json();
      if (!Array.isArray(data)) data = [data];
      posts = data;
      renderPosts(posts);
    } catch (err) {
      console.error("Failed to load posts:", err);
      if (grid) grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
  }

  // ---------------------------
  // RENDER FUNCTIONS
  // ---------------------------
  function renderPosts(postsArray) {
    if (!grid) return;
    grid.innerHTML = "";
    postsArray.forEach(post => grid.appendChild(createPostElement(post)));
  }

  function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    // Title & Description
    const header = document.createElement("h2");
    header.textContent = post.title;
    postDiv.appendChild(header);

    const desc = document.createElement("p");
    desc.textContent = post.description;
    postDiv.appendChild(desc);

    // Cards
    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "cards-wrapper";
    if (Array.isArray(post.cards)) {
      post.cards.forEach(card => cardsWrapper.appendChild(createCardElement(card)));
    }
    postDiv.appendChild(cardsWrapper);

    // Action Buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "post-actions";

    if (post.insight) actionsDiv.appendChild(createActionButton("insight", post));
    if (post.reference) actionsDiv.appendChild(createActionButton("reference", post));

    // Comment button always
    const commentBtn = document.createElement("button");
    commentBtn.textContent = "Comment";
    commentBtn.className = "btn-comment";
    commentBtn.addEventListener("click", () => openCommentModal(post.id));
    actionsDiv.appendChild(commentBtn);

    postDiv.appendChild(actionsDiv);

    return postDiv;
  }

  function createCardElement(card) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const titleEl = document.createElement("h3");
    titleEl.textContent = card.title;
    cardDiv.appendChild(titleEl);

    const textEl = document.createElement("p");
    textEl.textContent = card.text;
    cardDiv.appendChild(textEl);

    return cardDiv;
  }

  function createActionButton(type, post) {
    const btn = document.createElement("button");
    if (type === "insight") {
      btn.textContent = "🤔 Insight";
      btn.className = "btn-insight";
      btn.addEventListener("click", () => window.location.href = `insight.html?id=${post.insight}`);
    } else if (type === "reference") {
      btn.textContent = "Reference";
      btn.className = "btn-reference";
      btn.addEventListener("click", () => window.location.href = `reference.html?id=${post.reference}`);
    }
    return btn;
  }

  // ---------------------------
  // COMMENT MODAL (Example)
  // ---------------------------
  function openCommentModal(postId) {
    const modal = document.getElementById("comment-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const postIdEl = modal.querySelector(".modal-post-id");
    if (postIdEl) postIdEl.textContent = postId;
  }

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q)
      );
      renderPosts(filtered);
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

    affiliateModal.addEventListener("click", e => { if (e.target === affiliateModal) closeModal(); });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal();
    });
  }

  // ---------------------------
  // INITIALIZE
  // ---------------------------
  loadPosts();

});
