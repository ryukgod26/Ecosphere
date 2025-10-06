document.addEventListener("DOMContentLoaded", async () => {
  // Initialize map
  const map = L.map('map').setView([31.63, 74.87], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Fetch reports from backend
  let response = await fetch("/cleaner/api/reports");
  let reports = await response.json();

  reports.forEach(report => {
    const [lng, lat] = report.location.coordinates;

    if (report.status === "Pending" || report.status === "Cleaned") {
      const marker = L.marker([lat, lng]).addTo(map);

      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
        <b>${report.resident.fullName}</b><br>
        Mobile: ${report.resident.mobile}<br><br>
        <img src="${report.image}" width="100"/><br>
        Status: <span id="status-${report._id}">${report.status}</span><br><br>
      `;

      // Add button only if pending
      if (report.status === "Pending") {
        const btn = document.createElement("button");
        btn.textContent = "Mark Cleaned";
        btn.addEventListener("click", async () => {
          try {
            const res = await fetch(`/cleaner/api/mark-cleaned/${report._id}`, { method: "POST" });
            const data = await res.json();
            if (data.success) {
              // Update status text
              document.getElementById(`status-${report._id}`).textContent = "Cleaned";
              // Remove button
              btn.remove();
            } else {
              alert("Error: " + data.message);
            }
          } catch (err) {
            console.error(err);
            alert("Failed to mark cleaned.");
          }
        });
        popupContent.appendChild(btn);
      }

      marker.bindPopup(popupContent);
    }
  });
});
