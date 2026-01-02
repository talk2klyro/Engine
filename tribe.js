const params = new URLSearchParams(window.location.search);
const tribeKey = params.get("tribe");

const tribeTitle = document.getElementById("tribeTitle");
const tribeDescription = document.getElementById("tribeDescription");
const whatsappJoin = document.getElementById("whatsappJoin");

fetch("tribes.json")
  .then((res) => res.json())
  .then((tribes) => {
    const tribe = tribes[tribeKey];

    if (!tribe) {
      tribeTitle.textContent = "Community";
      tribeDescription.textContent =
        "This community is not available at the moment.";
      whatsappJoin.style.display = "none";
      return;
    }

    tribeTitle.textContent = tribe.name;
    tribeDescription.textContent = tribe.description;
    whatsappJoin.href = tribe.whatsapp;
  })
  .catch(() => {
    tribeTitle.textContent = "Error";
    tribeDescription.textContent =
      "Unable to load community data. Please try again later.";
  });
