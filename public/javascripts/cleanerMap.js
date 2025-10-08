document.addEventListener("DOMContentLoaded", async () => {
  // === Base Layers ===
  const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  const satelliteMap = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, IGN, and GIS User Community'
    }
  );

  // === Initialize map ===
  const map = L.map('map', {
    center: [31.63, 74.87],
    zoom: 14,
    layers: [streetMap]
  });

  L.control.layers({ "Street Map": streetMap, "Satellite": satelliteMap }, null, { collapsed: false }).addTo(map);

  // === Fetch and display pending reports ===
  async function loadReports() {
    try {
      const res = await fetch("/cleaner/api/reports");
      const reports = await res.json();

      // Remove all existing markers
      if (window.reportMarkers) {
        window.reportMarkers.forEach(m => map.removeLayer(m));
      }
      window.reportMarkers = [];

      reports.forEach(report => {
        if (report.status === "Pending" && report.location && report.location.coordinates.length === 2) {
          const [lng, lat] = report.location.coordinates;
          const marker = L.marker([lat, lng]).addTo(map);

          const popupContent = `
            <div style="text-align:center">
              <img src="${report.image}" alt="Garbage Image" style="width:100px;height:100px;border-radius:10px;object-fit:cover;"><br>
              <strong>${report.resident.fullName}</strong><br>
              📞 ${report.resident.mobile}<br>
              <button data-id="${report._id}" class="markCleanedBtn" style="margin-top:5px;background:#28a745;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">
                Mark as Cleaned
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          window.reportMarkers.push(marker);
        }
      });
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  }

  await loadReports();

  // === Handle Mark as Cleaned ===
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("markCleanedBtn")) {
      const reportId = e.target.getAttribute("data-id");

      try {
        const response = await fetch(`/cleaner/api/mark-cleaned/${reportId}`, {
          method: "POST"
        });

        const data = await response.json();
        if (data.success) {
          alert("Marked as cleaned ✅");
          await loadReports(); // Refresh map markers
        } else {
          alert("Error: " + data.error);
        }
      } catch (error) {
        console.error("Error marking cleaned:", error);
        alert("Failed to mark as cleaned.");
      }
    }
  });
});
