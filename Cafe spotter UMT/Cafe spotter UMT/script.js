let userLat = null, userLng = null;

// Initialize map
const map = L.map('map').setView([5.407391, 103.08842], 16);

// Base map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

// Get user location
map.locate({ setView: true, maxZoom: 16 });

map.on('locationfound', function (e) {
  userLat = e.latitude;
  userLng = e.longitude;

  L.marker([userLat, userLng], {
    title: "You are here",
    icon: L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    })
  }).addTo(map)
    .bindPopup("📍 You are here")
    .openPopup();
});

map.on('locationerror', function () {
  alert("Unable to retrieve your location. Enable GPS to get directions.");
});

// Load café data and add markers with popup + Save button
fetch('cafes.json')
  .then(response => response.json())
  .then(cafes => {
    cafes.forEach(cafe => {
      const menuList = cafe.menu?.map(item => `<li>${item}</li>`).join("") || "";

      let directionLink = `<i style="color:gray;">Enable location for directions</i>`;
      if (userLat !== null && userLng !== null) {
        directionLink = `<a href="https://waze.com/ul?ll=${cafe.lat},${cafe.lng}&navigate=yes" target="_blank">🧭 Navigate with Waze</a>`;
      }

      const marker = L.marker([cafe.lat, cafe.lng]).addTo(map);

      const popupDiv = document.createElement("div");
      popupDiv.innerHTML = `
        <b>${cafe.name}</b><br/>
        ${cafe.address ? cafe.address + '<br/>' : ''}
        <img src="${cafe.img}" class="popup-img" alt="${cafe.name}" /><br/>
        <b>Opening Hours:</b> ${cafe.hours || 'Not available'}<br/>
        <b>Menu:</b>
        <ul>${menuList}</ul>
        ${directionLink}<br/>
        <button class="save-btn" style="margin-top:10px;">❤️ Save to Favorites</button>
      `;

      marker.bindPopup(popupDiv);

      marker.on("popupopen", () => {
        const btn = popupDiv.querySelector(".save-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            saveFavorite(cafe);
          });
        }
      });
    });
  })
  .catch(error => console.error("Error loading café data:", error));

// Save favorite café to localStorage
function saveFavorite(cafe) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find(c => c.name === cafe.name)) {
    favorites.push(cafe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`✅ "${cafe.name}" added to Favorites!`);
  } else {
    alert(`⚠️ "${cafe.name}" is already in your Favorites.`);
  }
}

// Redirect to favorites.html when button is clicked
document.getElementById("goToFavorites").addEventListener("click", () => {
  window.location.href = "favorites.html";
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("✅ Service Worker registered"))
    .catch(error => console.error("❌ Service Worker registration failed:", error));
}
