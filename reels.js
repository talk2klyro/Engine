// ===========================
// REELS.JS – VIDEO-FIRST SCROLL FEED + AFFILIATE
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
  const container = document.getElementById("reels");
  const openAffiliateModal = document.getElementById("openAffiliateModal");
  const affiliateModal = document.getElementById("affiliateModal");
  const closeModalBtn = affiliateModal?.querySelector(".close-modal");
  const feedSwitcher = document.getElementById("feed-switcher");

  if (!container) return;

  // ---------------------------
  // STATE
  // ---------------------------
  let reelsData = [];
  let watchStats = JSON.parse(localStorage.getItem("watchStats")) || {};
  let scrollPosition = parseInt(localStorage.getItem("scrollPosition")) || 0;
  let userActive = true;
  let loading = false;

  let lastScroll = 0;
  let lastScrollTime = Date.now();

  // ---------------------------
  // UTILS
  // ---------------------------
  const delay = ms => new Promise(r => setTimeout(r, ms));

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

  const createReelElement = reel => {
    const reelDiv = document.createElement("div");
    reelDiv.className = "reel";

    const frag = document.createDocumentFragment();

    // Skeleton / preview
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    frag.appendChild(skeleton);

    // Video or embed
    const videoWrapper = document.createElement("div");
    videoWrapper.className = "video-wrapper";
    videoWrapper.style.position = "relative";
    videoWrapper.style.width = "100%";
    videoWrapper.style.aspectRatio = "9/16";
    videoWrapper.style.overflow = "hidden";
    videoWrapper.style.borderRadius = "14px";

    if (reel.video.includes("youtube") || reel.video.includes("tiktok") || reel.video.includes("instagram") || reel.video.includes("facebook")) {
      // Embed platform video
      const preview = document.createElement("div");
      preview.className = "video-preview";
      preview.style.position = "absolute";
      preview.style.inset = 0;

      preview.innerHTML = `
        <img src="${reel.thumbnail}" alt="${reel.username || 'video'}" loading="lazy" style="width:100%;height:100%;object-fit:cover;"/>
        <div class="play-overlay" style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:3rem; color:white; background:rgba(0,0,0,.35); cursor:pointer;">▶</div>
      `;

      preview.addEventListener("click", () => {
        preview.innerHTML = `
          <iframe src="${getEmbedUrl(reel.video)}" style="position:absolute; inset:0; width:100%; height:100%;" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        `;
      });

      videoWrapper.appendChild(preview);

    } else {
      // Direct video URL
      const video = document.createElement("video");
      video.setAttribute("playsinline", "");
      video.setAttribute("muted", "");
      video.setAttribute("loop", "");
      video.setAttribute("preload", "metadata");
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";

      // Lazy load video
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !video.src) {
            video.src = reel.video;
            io.unobserve(video);
          }
        });
      });
      io.observe(video);

      videoWrapper.appendChild(video);
    }

    frag.appendChild(videoWrapper);

    // Overlay info
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
      <strong>${reel.username || ""}</strong>
      <p>${reel.caption || ""}</p>
    `;
    frag.appendChild(overlay);

    // Actions
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.innerHTML = `<span class="like">❤️</span>`;
    frag.appendChild(actions);

    // Progress bar
    const progress = document.createElement("div");
    progress.className = "progress";
    frag.appendChild(progress);

    reelDiv.appendChild(frag);
    return reelDiv;
  };

  // ---------------------------
  // LOAD FEED
  // ---------------------------
  async function loadReels() {
    if (loading) return;
    loading = true;
    await delay(200); // micro-delay for anticipation

    try {
      const res = await fetch("reels.json");
      const data = await res.json();

      reelsData = Array.isArray(data) ? data : [];
      renderReels(reelsData);

      // Restore scroll position
      if (scrollPosition > 0) container.scrollTo({ top: scrollPosition, behavior: "instant" });

    } catch (err) {
      console.error("Failed to load reels.json", err);
      container.innerHTML = "<p style='color:#ff4d4d;'>Failed to load reels.</p>";
    } finally {
      loading = false;
    }
  }

  // ---------------------------
  // RENDER
  // ---------------------------
  function renderReels(data) {
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    data.forEach(reel => frag.appendChild(createReelElement(reel)));
    container.appendChild(frag);
    initObservers();
    attachLikes();
  }

  // ---------------------------
  // INTERSECTION OBSERVER – AUTOPLAY
  // ---------------------------
  function initObservers() {
    const videos = container.querySelectorAll("video");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        const reel = video.closest(".reel");
        const progress = reel.querySelector(".progress");
        const id = video.dataset.id;

        if (entry.isIntersecting) {
          video.play();
          video.ontimeupdate = () => {
            if (progress) progress.style.width = (video.currentTime / video.duration) * 100 + "%";
          };
        } else {
          video.pause();
          if (video._start) {
            const watched = Date.now() - video._start;
            watchStats[id] = (watchStats[id] || 0) + watched;
            localStorage.setItem("watchStats", JSON.stringify(watchStats));
          }
        }
      });
    }, { threshold: 0.65 });

    videos.forEach(v => observer.observe(v));
  }

  // ---------------------------
  // LIKE BUTTON
  // ---------------------------
  function attachLikes() {
    container.querySelectorAll(".like").forEach((like, index) => {
      like.onclick = () => {
        like.classList.toggle("active");
      };
    });
  }

  // ---------------------------
  // SCROLL TRACKER + INFINITE
  // ---------------------------
  container.addEventListener("scroll", () => {
    localStorage.setItem("scrollPosition", container.scrollTop);

    const now = Date.now();
    const speed = Math.abs(container.scrollTop - lastScroll) / (now - lastScrollTime);
    lastScroll = container.scrollTop;
    lastScrollTime = now;

    userActive = speed < 0.5;

    if (container.scrollTop + container.clientHeight > container.scrollHeight - 900) {
      loadReels();
    }
  });

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
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !affiliateModal.classList.contains("hidden")) closeModal(); });
  }

  // ---------------------------
  // FEED SWITCHER (EMOJIS)
  // ---------------------------
  if (feedSwitcher) {
    feedSwitcher.addEventListener("click", e => { if (e.target.dataset.feed) window.location.href = e.target.dataset.feed; });
  }

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  loadReels();
});
