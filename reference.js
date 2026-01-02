// ===========================
// REFERENCE PAGE LOGIC
// ===========================

// Get `id` from URL query
const params = new URLSearchParams(window.location.search);
const refId = params.get("id");

// DOM elements
const container = document.getElementById("referenceContent");
const titleEl = document.getElementById("referenceTitle");

// Guard: no reference ID
if (!refId) {
  if (titleEl) titleEl.textContent = "Reference";
  if (container)
    container.innerHTML =
      "<p style='color:#ff4d4d;'>No reference specified.</p>";
} else {
  fetch(`references/${refId}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Reference JSON not found");
      return res.json();
    })
    .then(data => {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid reference data");
      }

      // Set title
      if (titleEl) titleEl.textContent = data.title || "Reference";

      // Build images
      let imagesHtml = "";
      if (Array.isArray(data.images) && data.images.length > 0) {
        imagesHtml = data.images
          .map(
            img =>
              `<div class="reference-image"><img src="${img}" alt="${
                data.title || "Reference"
              }" loading="lazy" /></div>`
          )
          .join("");
      }

      // Build link if provided
      let linkHtml = data.link
        ? `<a class="whatsapp-btn" href="${data.link}" target="_blank" rel="noopener">Read Source</a>`
        : "";

      // Populate container
      if (container) {
        container.innerHTML = `
          <p>${data.description || ""}</p>
          <div class="reference-images">${imagesHtml}</div>
          ${linkHtml}
        `;
      }
    })
    .catch(err => {
      console.error("Reference load error:", err);
      if (container)
        container.innerHTML =
          "<p style='color:#ff4d4d;'>Failed to load reference.</p>";
      if (titleEl) titleEl.textContent = "Error";
    });
}
