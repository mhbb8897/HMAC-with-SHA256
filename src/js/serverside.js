async function fetchAduan() {
  setTimeout(() => {
    // Sembunyikan loading overlay
    document.querySelector(".loading-overlay").style.display = "none";
    // Tampilkan konten
    document.querySelector(".content").style.display = "block";
  }, 3000);
  try {
    const response = await fetch("http://localhost:3000/aduan");
    if (!response.ok) throw new Error("Gagal mengambil data!");

    const result = await response.json();
    const aduanContainer = document.getElementById("aduanContainer");
    const totalData = document.getElementById("totalData");

    aduanContainer.innerHTML = "";

    if (result.data && result.data.length > 0) {
      result.data.forEach((aduan) => {
        const entry = document.createElement("div");
        entry.classList.add("entry");

        const formattedTimestamp = new Date(aduan.timestamp).toLocaleString(
          "id-ID",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }
        );

        entry.innerHTML = `
                    <h4>${aduan.nama}</h4>
                    <p><strong>No Telepon:</strong> ${aduan.no_telp}</p>
                    <p><strong>Email:</strong> ${aduan.email}</p>
                    <p><strong>Alamat:</strong> ${aduan.address}</p>
                    <p><strong>Aduan:</strong> ${aduan.aduan}</p>
                    <p><strong>Waktu submit:</strong> ${formattedTimestamp}</p>
                `;

        aduanContainer.appendChild(entry);
      });

      totalData.textContent = result.data.length;
    } else {
      aduanContainer.innerHTML = "<p>Tidak ada data.</p>";
      totalData.textContent = "0";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("aduanContainer").innerHTML =
      "<p>Terjadi kesalahan saat mengambil data.</p>";
  }
}

// Panggil fungsi fetchAduan saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchAduan);
