// ---------------------------
// GET REFERENCE ID FROM URL
// ---------------------------
const params = new URLSearchParams(window.location.search);
const refId = params.get("id");

// ---------------------------
// SELECT ELEMENTS
// ---------------------------
const container = document.getElementById("referenceContent");
const titleEl = document.getElementById("referenceTitle");

// ---------------------------
// ERROR HANDLING IF NO ID
// ---------------------------
if (!refId) {
  container.innerHTML = "<p style='color:#ff4d4d;'>No reference specified.</p>";
} else {
  // ---------------------------
  // FETCH REFERENCE JSON
  // ---------------------------
  fetch(`references/${refId}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Reference not found");
      return res.json();
    })
    .then(data => {
      // SET TITLE
      titleEl.textContent = data.title;

      // BUILD HTML
      let imagesHtml = "";
      if (data.images && data.images.length > 0) {
        imagesHtml = data.images
          .map(img => `<div class="card"><img src="${img}" alt="${data.title}" /></div>`)
          .join("");
      }

      let linkHtml = data.link
        ? `<a class="whatsapp-btn" href="${data.link}" target="_blank" rel="noopener">Read Source</a>`
        : "";

      container.innerHTML = `
        <p>${data.description}</p>
        <div class="reference-images">${imagesHtml}</div>
        ${linkHtml}
      `;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p style='color:#ff4d4d;'>Failed to load reference.</p>";
    });
}
