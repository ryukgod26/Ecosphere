document.addEventListener("DOMContentLoaded", () => {
  let map = L.map('map').setView([31.63, 74.87], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let currentMarker = null;

  map.on('click', e => {
    const { lat, lng } = e.latlng;

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([lat, lng]).addTo(map);
    currentMarker.bindPopup("Selected location").openPopup();

    // Fill hidden fields
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    document.getElementById('reportForm').style.display = 'block';
  });

  window.closeForm = function() {
    document.getElementById('reportForm').style.display = 'none';

    if (currentMarker) {
      map.removeLayer(currentMarker);
      currentMarker = null;
    }
  };

  document.getElementById('markForm').addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("lat", document.getElementById('lat').value);
    formData.append("lng", document.getElementById('lng').value);
    formData.append("name", document.getElementById('name').value);
    formData.append("mobile", document.getElementById('mobile').value);
    formData.append("image", document.getElementById('image').files[0]); // field name must match multer config

    try {
      const response = await fetch("/resident/report", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        alert("Area reported successfully!");
        closeForm();

        if (currentMarker) {
          map.removeLayer(currentMarker);
          currentMarker = null;
        }
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Something went wrong while submitting report.");
    }
  });

});
