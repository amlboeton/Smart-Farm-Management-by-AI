# AgriPulse — AI-Powered Smart Farm Management Platform
## Implementasi Kebun PT Agricole Indonesia Makmur & Fitur Cerdas

Platform Smart Agriculture terpadu untuk perkebunan **PT Agricole Indonesia Makmur** yang beroperasi di dataran tinggi pegunungan Cipanas/Sukaresmi, Kabupaten Cianjur, Jawa Barat.

---

## 1. Profil Titik Lokasi & Protokol Telemetri Lapangan (Real-time IoT)

- **Nama Entitas / Pemilik**: PT Agricole Indonesia Makmur
- **Titik Koordinat GPS Presisi**: `-6.7532660826354585, 107.01747234233768`
- **Wilayah Administratif**: Kecamatan Sukaresmi / Kawasan Cipanas, Kabupaten Cianjur, Jawa Barat
- **Topografi & Elevasi**: Dataran tinggi pegunungan ~1.085 mdpl (iklim sejuk, evapotranspirasi dinamis 3.2 – 4.5 mm/hari)
- **Protokol Komunikasi Jaringan IoT**:
  - **LoRaWAN AS923**: Frekuensi 923.2 MHz, Spreading Factor SF7, jangkauan radius hingga 12 km melintasi kontur perbukitan.
  - **Cellular NB-IoT (Band 8)**: Komunikasi data berdaya rendah untuk modul node greenhouse dan stasiun pompa otomatis.
- **Infrastruktur Base Station**:
  - **Gateway Lapangan**: `GW-AGRICOLE-01` (Tower Sentral Kebun)
  - **Metrik Sinyal**: RSSI -78 dBm, SNR 9.4 dB, Packet Loss 0.0% (Optimal)
  - **Daya Node Lapangan**: Baterai terintegrasi panel surya mikro (96–98% charge)

---

## 2. Implementasi 3 Fitur Cerdas Terpadu

### Fitur 1: Google Search Data Grounding (Live Market & BMKG Weather Intelligence)
- **Model**: `gemini-3.8-flash` dengan konfigurasi `tools: [{ googleSearch: {} }]`.
- **Fungsi**:
  - Pelacakan harga pasar komoditas real-time (jagung pipil kering, tomat beef, paprika merah) di pasar induk Jabodetabek dan Jawa Barat.
  - Peringatan dini cuaca ekstrim dan hujan lebat dari data BMKG terkini untuk penyesuaian jadwal irigasi tetes.
- **Endpoint**: `/api/agri-search` dengan metadata rujukan web terverifikasi (`groundingMetadata.groundingChunks`).

### Fitur 2: Google Maps Data Grounding & Peta Geospasial Interaktif
- **Model**: `gemini-3.8-flash` dengan konfigurasi `tools: [{ googleMaps: {} }]`.
- **Fungsi**:
  - Deteksi dan rekomendasi geospasial fasilitas pertanian di sekitar titik `-6.753266, 107.017472`: distributor resmi pupuk NPK & saprotan di Cipanas, kios bibit tanaman hortikultura di Sukaresmi/Pacet, Balai Penyuluhan Pertanian (BPP), dan pasar pengumpul sayur Cianjur.
  - Tampilan visual peta satelit interaktif (OpenStreetMap layer terkalibrasi) dengan marker koordinat langsung dan tombol cepat buka di Google Maps.
- **Endpoint**: `/api/agri-maps`.

### Fitur 3: Gemini Multi-turn Chatbot (Asisten Kepala Agronom)
- **Model**: `gemini-3.8-flash` dengan konteks multi-turn (`contents` array user-model berurutan).
- **Fungsi**:
  - Riwayat percakapan berkelanjutan (multi-turn thread) yang tersimpan secara lokal dan otomatis bergulir ke pesan terbaru.
  - Pemahaman mendalam tentang profil kebun PT Agricole (Cipanas), data telemetri sensor terkini (kelembaban tanah, suhu akar, pH, NPK, VPD, status katup irigasi).
  - Mode Grounding dinamis yang dapat dipilih langsung pengguna:
    1. *🌱 Standar Agronomi IoT* (Analisis sensor lapangan dan SOP tanaman).
    2. *🔍 Google Search Grounding* (Harga pasar dan riset live web).
    3. *📍 Google Maps Grounding* (Fasilitas dan distributor sekitar Cianjur).
- **Endpoint**: `/api/chat-multiturn`.

---

## 3. Integrasi Penyimpanan Cloud Google Drive & Google Sheets

- **Folder Tujuan Cloud**: `https://drive.google.com/drive/u/0/folders/1P62-KOsYtJAqXGQJMSsgm-nmclVpXwYV` (Folder ID: `1P62-KOsYtJAqXGQJMSsgm-nmclVpXwYV`).
- **Subfolder Otomatis**:
  - `📁 01_Laporan_Harian/`: Rincian telemetri per jam dan log katup.
  - `📁 02_Laporan_Mingguan/`: Rata-rata mingguan konsumsi air dan status NPK.
  - `📁 03_Laporan_Bulanan/`: Bahan presentasi eksekutif dan efisiensi air (%).
- **Format File**: Google Sheets native dan spreadsheet CSV siap olah.
- **Mekanisme**: Sinkronisasi instan via OAuth Google Workspace dengan tombol *"Bahan Presentasi Eksekutif"* dan modal ekspor.

---

## 4. Validasi & Sanitasi Data

- **Pembersihan Blok C (Kopi)**: Telah dihapus secara permanen dari daftar zona aktif dan memori cache browser per permintaan pengguna, menyisakan Blok A (Jagung Hibrida P32 Singa) dan Blok B (Smart Greenhouse Tomat Beef & Paprika).
- **Status Kompilasi**: Build lulus dengan 0 error pada TypeScript compiler (`tsc --noEmit`) dan Vite bundle.
