document.addEventListener("DOMContentLoaded", async () => {
  const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  const satelliteMap = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, IGN, and GIS User Community'
    }
  );

  const map = L.map('map', {
    center: [20.5937, 78.9629], // default India center
    zoom: 5,
    layers: [streetMap]
  });

  L.control.layers({
    "Street Map": streetMap,
    "Satellite": satelliteMap
  }, null, { collapsed: false }).addTo(map);

  let currentMarker = null;
 const placeParts = [];
if (window.residentData?.locality) placeParts.push(window.residentData.locality);
if (window.residentData?.city) placeParts.push(window.residentData.city);
if (window.residentData?.state) placeParts.push(window.residentData.state);
placeParts.push("India"); // always append country
const placeQuery = placeParts.join(", ");
const coords = await getCoordinates(placeQuery);
if (coords) map.setView(coords, 14);
  // === Function to get coordinates from Nominatim ===
  async function getCoordinates(placeName) {
  if (!placeName) return null;
  try {
    // Force search within India
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName + ", India")}&limit=1`
    );
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    return null;
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}




  // === Click to add marker ===
  map.on('click', e => {
    const { lat, lng } = e.latlng;

    if (currentMarker) map.removeLayer(currentMarker);

    currentMarker = L.marker([lat, lng]).addTo(map);
    currentMarker.bindPopup("Selected location").openPopup();

    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    document.getElementById('reportForm').style.display = 'block';
  });

  // === Close form and remove marker ===
  window.closeForm = function() {
    document.getElementById('reportForm').style.display = 'none';
    if (currentMarker) {
      map.removeLayer(currentMarker);
      currentMarker = null;
    }
  };

  // === Submit the report ===
  document.getElementById('markForm').addEventListener('submit', async e => {
    e.preventDefault();

    if (!currentMarker) {
      alert("Please select a location on the map first.");
      return;
    }

    const formData = new FormData();
    formData.append("lat", document.getElementById('lat').value);
    formData.append("lng", document.getElementById('lng').value);
    formData.append("name", document.getElementById('name').value);
    formData.append("mobile", document.getElementById('mobile').value);
    formData.append("image", document.getElementById('image').files[0]);

    try {
      const response = await fetch("/resident/report", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert("Area reported successfully!");
        closeForm(); // remove marker only after successful submission
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Something went wrong while submitting report.");
    }
  });

  // === Load existing reports as markers (optional) ===
  try {
    const res = await fetch("/resident/api/reports"); // create this route if needed
    const reports = await res.json();
    reports.forEach(r => {
      if (r.status === "Pending") {
        L.marker([r.location.coordinates[1], r.location.coordinates[0]])
          .addTo(map)
          .bindPopup(`<b>${r.resident.fullName}</b><br>${r.resident.mobile}`);
      }
    });
  } catch (err) {
    console.error("Error loading existing reports:", err);
  }
});
