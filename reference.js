const params = new URLSearchParams(window.location.search);
const refId = params.get("id");

const container = document.getElementById("referenceContent");
const titleEl = document.getElementById("referenceTitle");

if (!refId) {
  container.innerHTML = "<p style='color:#ff4d4d;'>No reference specified.</p>";
} else {
  fetch(`references/${refId}.json`)
    .then(res => res.json())
    .then(data => {
      titleEl.textContent = data.title;
      container.innerHTML = `
        <p>${data.description}</p>
        ${data.images?.map(img => `<img src="${img}" alt="${data.title}" />`).join("") || ""}
        ${data.link ? `<a href="${data.link}" target="_blank">Read Source</a>` : ""}
      `;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p style='color:#ff4d4d;'>Failed to load reference.</p>";
    });
}
