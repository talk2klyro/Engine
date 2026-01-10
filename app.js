// ===========================
// APP.JS – MERGED VIDEO-FIRST + CARD FEED + AFFILIATE
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
  const grid = document.getElementById("posts-container") || document.getElementById("grid");
  const searchInput = document.getElementById("searchInput");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = affiliateModal?.querySelector(".close-modal");
  const feedSwitcher = document.getElementById("feed-switcher");

  if (!grid) return;

  let items = [];

  // ---------------------------
  // UTILS
  // ---------------------------
  const debounce = (fn, delay = 200) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const getEmbedUrl = url => {
    if (!url) return "";
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtube.com/shorts")) {
      const id = url.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("instagram.com")) return `${url}embed`;
    if (url.includes("tiktok.com")) return `${url}?embed=1`;
    if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=true`;
    return url;
  };

  // ---------------------------
  // CREATE CARD HELPERS
  // ---------------------------
  const createEmbedVideoCard = card => {
    const wrapper = document.createElement("div");
    wrapper.className = "card card-video";
    wrapper.style.aspectRatio = "9/16";

    const preview = document.createElement("div");
    preview.className = "video-preview";
    preview.style.position = "relative";
    preview.style.width = "100%";
    preview.style.paddingTop = "56.25%";
    preview.style.overflow = "hidden";
    preview.style.borderRadius = "14px";
    preview.style.background = "#000";

    preview.innerHTML = `
      <img src="${card.thumbnail}" alt="${card.title}" loading="lazy" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
      <div class="play-overlay" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:3rem; color:white; background:rgba(0,0,0,.35); cursor:pointer;">▶</div>
    `;

    preview.addEventListener("click", () => {
      preview.innerHTML = `
        <iframe src="${getEmbedUrl(card.video)}" style="position:absolute; inset:0; width:100%; height:100%;" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
      `;
    });

    wrapper.appendChild(preview);
    return wrapper;
  };

  const createDirectVideoCard = card => {
    const wrapper = document.createElement("div");
    wrapper.className = "card card-video";
    wrapper.style.aspectRatio = "9/16";

    const video = document.createElement("video");
    video.setAttribute("controls", "true");
    video.setAttribute("preload", "metadata");
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";

    // Lazy load using IntersectionObserver
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !video.src) {
          video.src = card.video;
          io.unobserve(video);
        }
      });
    });
    io.observe(video);

    wrapper.appendChild(video);
    return wrapper;
  };

  const createTextCard = card => {
    const wrapper = document.createElement("div");
    wrapper.className = "card card-text";
    wrapper.innerHTML = `<h3>${card.title}</h3><p>${card.text}</p>`;
    return wrapper;
  };

  const createMerchCard = card => {
    const wrapper = document.createElement("div");
    wrapper.className = "card card-merch";
    wrapper.innerHTML = `<h3>${card.title}</h3><p class="price">${card.price || "N/A"}</p><p class="availability">${card.availability || "Available"}</p>`;
    return wrapper;
  };

  // ---------------------------
  // RENDER FUNCTION
  // ---------------------------
  const render = data => {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    data.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "post";
      postDiv.innerHTML = `<h2>${post.title}</h2>${post.description ? `<p>${post.description}</p>` : ""}`;

      const cardsWrapper = document.createElement("div");
      cardsWrapper.className = "cards-wrapper";

      (post.cards || []).forEach(card => {
        let cardEl;
        if (card.type === "video") {
          cardEl = card.video.includes("youtube") || card.video.includes("tiktok") || card.video.includes("instagram") || card.video.includes("facebook")
            ? createEmbedVideoCard(card)
            : createDirectVideoCard(card);
        } else if (card.type === "text") {
          cardEl = createTextCard(card);
        } else if (card.type === "merch") {
          cardEl = createMerchCard(card);
        } else {
          cardEl = createTextCard(card);
        }
        cardsWrapper.appendChild(cardEl);
      });

      postDiv.appendChild(cardsWrapper);

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";

      if (post.insight) {
        const btn = document.createElement("button");
        btn.className = "btn-insight";
        btn.textContent = "Insight";
        btn.onclick = () => window.location.href = `insight.html?id=${post.insight}`;
        actionsDiv.appendChild(btn);
      }

      if (post.reference) {
        const btn = document.createElement("button");
        btn.className = "btn-reference";
        btn.textContent = "Reference";
        btn.onclick = () => window.location.href = `reference.html?id=${post.reference}`;
        actionsDiv.appendChild(btn);
      }

      const commentBtn = document.createElement("button");
      commentBtn.className = "btn-comment";
      commentBtn.textContent = "💬 Comment";
      commentBtn.onclick = () => window.open("https://whatsapp.com/channel/0029Vb77PdM6LwHtxQS6u638", "_blank");
      actionsDiv.appendChild(commentBtn);

      postDiv.appendChild(actionsDiv);
      frag.appendChild(postDiv);
    });

    grid.appendChild(frag);
  };

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  const loadPosts = async () => {
    try {
      const res = await fetch("data.json");
      const json = await res.json();
      items = Array.isArray(json.posts) ? json.posts : [];
      render(items);
    } catch (err) {
      console.error("Failed to load data.json", err);
      grid.innerHTML = "<p style='color:#ff4d4d;'>Failed to load content.</p>";
    }
  };

  loadPosts();

  // ---------------------------
  // SEARCH
  // ---------------------------
  if (searchInput) {
    searchInput.addEventListener("input", debounce(e => {
      const q = e.target.value.toLowerCase();
      render(items.filter(post =>
        post.title.toLowerCase().includes(q) ||
        (post.description && post.description.toLowerCase().includes(q)) ||
        (post.cards && post.cards.some(card =>
          (card.title && card.title.toLowerCase().includes(q)) ||
          (card.text && card.text.toLowerCase().includes(q))
        ))
      ));
    }, 200));
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

  // ---------------------------
  // FEED SWITCHER (EMOJIS)
  // ---------------------------
  if (feedSwitcher) {
    feedSwitcher.addEventListener("click", e => {
      if (e.target.dataset.feed) window.location.href = e.target.dataset.feed;
    });
  }
});
