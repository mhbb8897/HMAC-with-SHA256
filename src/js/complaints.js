import Swal from "sweetalert2";
import CryptoJS from "crypto";
import hmac from "js-crypto-hmac";

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Hilangkan animasi loading
    document.querySelector(".loading-overlay").style.display = "none";
    // Tampilkan konten utama
    document.querySelector(".content").style.display = "block";
  }, 2000);
  document
    .getElementById("uploadData")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const secretKey = "ssss"; // Secretkey for HMAC and AES

      const data = {
        nama: document.getElementById("nama").value,
        no_telp: document.getElementById("no_telp").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        aduan: document.getElementById("aduan").value,
      };

      const hash = "SHA-256";
      const dataString = JSON.stringify(data);

      // Enkripsi
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ dataString }), secretKey).toString();

      // HMAC
      const computedHmac = await hmac.compute(
        new TextEncoder().encode(secretKey),
        new TextEncoder().encode(ciphertext),
        hash
      );

      const hmacHex = Array.from(computedHmac)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      // Data to Server
      const dataToSend = {
        ciphertext,
        hmacHex,
      };
      console.log(hmacHex);
      console.log(ciphertext);
      try {
        const response = await fetch("http://localhost:3000/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Data berhasil dikirim:", result);
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data berhasil dikirim!",
          });
          window.location.href = "server.html";
        } else {
          console.error("Gagal:", result.message);
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: `Gagal mengirim data: ${result.message}`,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Kesalahan!",
          text: "Terjadi kesalahan, silakan coba lagi.",
        });
      }
    });
});
