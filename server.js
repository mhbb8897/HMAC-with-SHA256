import express from "express";
import cors from "cors";
import CryptoJS from "crypto-js";
import hmac from "js-crypto-hmac";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/data", async (req, res) => {
  const { ciphertext, hmacHex } = req.body;

  // Validasi input
  if (!ciphertext || !hmacHex) {
    return res.status(400).json({ message: "Semua data harus diisi!" });
  }

  try {
    const secretKey = "sss";
    const hash = "SHA-256";

    // 1. Hitung ulang HMAC dari ciphertext
    const computedHmacArray = await hmac.compute(
      new TextEncoder().encode(secretKey),
      new TextEncoder().encode(ciphertext),
      hash
    );

    const computedHmac = Array.from(computedHmacArray)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    console.log("HMAC dari client :", hmacHex);
    console.log("HMAC dihitung svr :", computedHmac);

    // 2. Validasi HMAC
    if (computedHmac !== hmacHex) {
      console.error("HMAC tidak valid (secret key salah atau data rusak)!");
      return res.status(403).json({ message: "HMAC tidak valid!" });
    }

    // 3. Dekripsi data (karena HMAC sudah valid)
    const decrypted = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!originalText) {
      return res.status(400).json({
        message: "Dekripsi gagal (kemungkinan secret key salah).",
      });
    }
    const outerData = JSON.parse(originalText.dataString);
    const parsedData = JSON.parse(outerData.dataString);
    console.log("Plaintext hasil dekripsi:", originalText);
    console.log(`Data parsedData : ${parsedData.dataString}`)
    console.log("Data setelah dekripsi:", JSON.parse(originalText));

    // 4. Simpan data
    const newData = {
// ...parsedData.dataString,
      nama: parsedData.nama,
      no_telp: parsedData.no_telp,
      email: parsedData.email,
      address: parsedData.address,
      aduan: parsedData.aduan,
      encrypted_data: ciphertext,
      hmac: hmacHex,
      timestamp: new Date().toISOString(),
    };
    let database = [];
    try {
      const dbContent = await fs.readFile("database.json", "utf8");
      database = JSON.parse(dbContent);
    } catch (err) {
      console.log("File database.json belum ada, akan dibuat baru.");
    }

    database.push(newData);
    await fs.writeFile("database.json", JSON.stringify(database, null, 2));

    return res.status(200).json({
      message: "Data berhasil diterima dan disimpan!",
      data: newData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.get("/aduan", async (req, res) => {
  try {
    const dbContent = await fs.readFile("database.json", "utf8");
    const database = JSON.parse(dbContent);

    const formattedData = database.map((aduan) => {
      return {
        ...aduan,
        formattedTimestamp: new Date(aduan.timestamp).toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });

    res.status(200).json({
      message: "Data berhasil diambil!",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

app.listen(3000, () =>
  console.log("Server berjalan di http://localhost:3000")
);
