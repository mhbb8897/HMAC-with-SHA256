document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Sembunyikan loading overlay
    document.querySelector(".loading-overlay").style.display = "none";
    // Tampilkan konten
    document.querySelector(".content").style.display = "block";
  }, 3000); // 3 detik simulasi loading
  document
    .getElementById("complaintLink")
    .addEventListener("click", function (event) {
      event.preventDefault();
      window.location.href = "src/pages/complaints.html";
    });
});
