# Sistem Pengaduan dengan Enkripsi AES & HMAC
Proyek ini adalah implementasi REST API sederhana menggunakan Express.js untuk menerima data terenkripsi dari client. Data dienkripsi menggunakan AES dan dilindungi dengan HMAC-SHA256 untuk menjamin integritas dan keaslian data.
Aplikasi ini saya dokumentasikan untuk mendukung pembelajaran saya dalam pengembangan aplikasi web yang berfokus pada **keamanan data**.

## Fitur
- **Enkripsi Data**: Semua data terenkripsi menggunakan AES sebelum dikirim ke server.
- **Validasi HMAC**: Memastikan integritas data dengan HMAC (SHA-256).
- **Simpan Data**: Data yang valid disimpan dalam file `database.json`.
- **Ambil Data**: Endpoint untuk menampilkan semua data yang sudah tersimpan dengan timestamp terformat.
- **CORS Support**: Server dapat menerima request dari client berbeda.

## Teknologi yang Digunakan
- Node.js
- Express
- CryptoJS
- js-crypto-hmac
- CORS
- File system (`fs`) untuk penyimpanan data

## Endpoint API

### 1. Kirim Data
**POST** `/data`  
Mengirim data terenkripsi ke server.

Request Body:
```json
{
  "ciphertext": "encrypted_string",
  "hmacHex": "hmac_hash"
}
