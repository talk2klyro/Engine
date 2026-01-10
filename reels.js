// ===========================
// REELS.JS – TIKTOK-LIKE VIDEO FEED
// ===========================
document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------
  // DOM REFERENCES
  // ---------------------------
  const container = document.querySelector(".reels-container");
  if (!container) return;

  let reelsData = [];
  let watchStats = JSON.parse(localStorage.getItem("watchStats")) || {};
  let lastScroll = 0, lastScrollTime = Date.now();
  let userActive = true;

  // ---------------------------
  // UTILS
  // ---------------------------
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // ---------------------------
  // LOAD REELS DATA
  // ---------------------------
  async function loadReels() {
    try {
      const res = await fetch("data.json");
      const json = await res.json();
      reelsData = json.posts
        .flatMap(post => post.cards
          .filter(card => card.type === "video")
          .map(card => ({ ...card, username: post.title, caption: post.description || "" }))
        );
      renderReels(reelsData);
    } catch (err) {
      console.error("Failed to load reels:", err);
      container.innerHTML = "<p style='color:red;'>Failed to load videos.</p>";
    }
  }

  // ---------------------------
  // RENDER REELS
  // ---------------------------
  function renderReels(data) {
    container.innerHTML = "";
    data.forEach((videoCard, index) => {
      const reel = document.createElement("div");
      reel.className = "reel";

      reel.innerHTML = `
        <div class="skeleton"></div>
        <video data-id="${index}" muted loop playsinline preload="metadata"></video>
        <div class="overlay">
          <strong>${videoCard.username}</strong>
          <p>${videoCard.caption}</p>
        </div>
        <div class="actions">
          <span class="like">❤️</span>
        </div>
        <div class="progress"></div>
      `;

      container.appendChild(reel);
    });

    initObservers();
    attachLikes();
    initAdaptiveAutoplay();
  }

  // ---------------------------
  // VIDEO LAZY-LOAD + PLAY/PAUSE
  // ---------------------------
  function initObservers() {
    const videos = document.querySelectorAll(".reel video");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        const reel = video.closest(".reel");
        const id = video.dataset.id;
        const progress = reel.querySelector(".progress");

        // Lazy load video source
        if (!video.src) {
          video.src = reelsData[id].video;
        }

        if (entry.isIntersecting) {
          reel.querySelector(".skeleton")?.remove();
          if (userActive) video.play();
          video._start = Date.now();

          video.ontimeupdate = () => {
            progress.style.width = (video.currentTime / video.duration) * 100 + "%";
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
    }, { threshold: 0.75 });

    videos.forEach(v => observer.observe(v));
  }

  // ---------------------------
  // LIKE BUTTONS
  // ---------------------------
  function attachLikes() {
    document.querySelectorAll(".like").forEach((like, index) => {
      like.onclick = () => {
        like.classList.toggle("active");
      };
    });
  }

  // ---------------------------
  // ADAPTIVE AUTOPLAY (SCROLL)
  // ---------------------------
  container.addEventListener("scroll", () => {
    // Scroll speed tracker
    const now = Date.now();
    const speed = Math.abs(container.scrollTop - lastScroll) / (now - lastScrollTime);
    lastScroll = container.scrollTop;
    lastScrollTime = now;
    userActive = speed < 0.5;
  });

  function initAdaptiveAutoplay() {
    const videos = document.querySelectorAll(".reel video");
    setInterval(() => {
      videos.forEach(video => {
        const rect = video.closest(".reel").getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (userActive) video.play();
          else video.pause();
        }
      });
    }, 200);
  }

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  loadReels();
});
