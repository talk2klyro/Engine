// ---------------------------
// RENDER FUNCTION (UPDATED)
// ---------------------------
function render(data) {
  if (!grid) return;
  grid.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;

    // ---------- Build carousel ----------
    let imagesHtml = "";
    if (item.images && item.images.length > 0) {
      item.images.forEach((img, idx) => {
        imagesHtml += `
          <div class="carousel-image">
            <img src="${img}" alt="${item.title} - Image ${idx + 1}" loading="lazy" />
            <span class="roman-overlay">${toRoman(idx + 1)}</span>
          </div>
        `;
      });
    } else if (item.image) {
      imagesHtml = `
        <div class="carousel-image">
          <img src="${item.image}" alt="${item.alt || item.title}" loading="lazy" />
        </div>
      `;
    }

    // ---------- Build action buttons ----------
    let buttonsHtml = "";

    // Reference button (left)
    if (item.reference) {
      buttonsHtml += `<button class="ref-btn" onclick="window.location.href='reference.html?id=${item.reference}'">Reference</button>`;
    }

    // Insight button (middle)
    if (item.insight) {
      buttonsHtml += `<button class="insight-btn" onclick="window.location.href='insight.html?id=${item.insight}'">🤔 Insight</button>`;
    }

    // Comment button (right, always WhatsApp)
    buttonsHtml += `<button class="comment-btn" onclick="window.open('https://chat.whatsapp.com/HbO36O92c0j1LDowCpbF3v','_blank')">Comment</button>`;

    // ---------- Card template ----------
    card.innerHTML = `
      <div class="carousel">${imagesHtml}</div>
      <div class="card-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <div class="card-actions">
          ${buttonsHtml}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Reattach tribe button events (optional)
  attachTribeEvents();
}
