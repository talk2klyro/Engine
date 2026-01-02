// ===========================
// INSIGHT PAGE LOGIC
// ===========================

// Get `id` from URL query
const params = new URLSearchParams(window.location.search);
const insightId = params.get("id");

// DOM elements
const container = document.getElementById("insightContent");
const titleEl = document.getElementById("insightTitle");

// Guard: no insight ID
if (!insightId) {
  if (titleEl) titleEl.textContent = "Insight";
  if (container)
    container.innerHTML =
      "<p style='color:#ff4d4d;'>No insight specified.</p>";
} else {
  fetch(`insights/${insightId}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Insight JSON not found");
      return res.json();
    })
    .then(data => {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid insight data");
      }

      // Populate title
      if (titleEl) titleEl.textContent = data.title || "Insight";

      // Build content
      let imagesHtml = "";
      if (Array.isArray(data.images) && data.images.length > 0) {
        imagesHtml = data.images
          .map(
            img =>
              `<div class="carousel-image"><img src="${img}" alt="${
                data.title || "Insight"
              }" loading="lazy" /></div>`
          )
          .join("");
      }

      if (container) {
        container.innerHTML = `
          <p>${data.description || ""}</p>
          <div class="insight-images">${imagesHtml}</div>
        `;
      }
    })
    .catch(err => {
      console.error("Insight load error:", err);
      if (container)
        container.innerHTML =
          "<p style='color:#ff4d4d;'>Failed to load insight.</p>";
      if (titleEl) titleEl.textContent = "Error";
    });
}
