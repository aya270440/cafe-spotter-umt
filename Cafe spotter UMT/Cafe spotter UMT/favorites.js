function displayFavorites() {
  const container = document.getElementById("favorites");
  const saved = JSON.parse(localStorage.getItem("favorites")) || [];

  if (saved.length === 0) {
    container.innerHTML = "<p>No favorites saved yet.</p>";
    return;
  }

  saved.forEach(cafe => {
    const card = document.createElement("div");
    card.style.padding = "1rem";
    card.style.margin = "1rem";
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "12px";
    card.style.backgroundColor = "#fff";

    card.innerHTML = `
      <h3>${cafe.name}</h3>
      ${cafe.address ? `<p>${cafe.address}</p>` : ""}
      <img src="${cafe.img}" alt="${cafe.name}" style="width:150px; border-radius:10px;"><br/>
      <p><strong>Hours:</strong> ${cafe.hours}</p>
      <button onclick="removeFavorite('${cafe.name}')">🗑 Remove</button>
    `;
    container.appendChild(card);
  });
}

function removeFavorite(name) {
  let saved = JSON.parse(localStorage.getItem("favorites")) || [];
  saved = saved.filter(c => c.name !== name);
  localStorage.setItem("favorites", JSON.stringify(saved));
  location.reload();
}

displayFavorites();
