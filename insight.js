// Get `id` from URL query
const params = new URLSearchParams(window.location.search);
const insightId = params.get("id");

const container = document.getElementById("insightContent");
const titleEl = document.getElementById("insightTitle");

if (!insightId) {
  container.innerHTML = "<p style='color:#ff4d4d;'>No insight specified.</p>";
} else {
  fetch(`insights/${insightId}.json`)
    .then(res => res.json())
    .then(data => {
      titleEl.textContent = data.title;
      container.innerHTML = `
        <p>${data.description}</p>
        ${data.images?.map(img => `<img src="${img}" alt="${data.title}" />`).join("") || ""}
      `;
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p style='color:#ff4d4d;'>Failed to load insight.</p>";
    });
}
