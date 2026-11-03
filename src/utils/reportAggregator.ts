import { FarmZone } from '../types/farm';

export interface ReportRow {
  [key: string]: string | number;
}

export interface GeneratedReport {
  title: string;
  period: 'Harian' | 'Mingguan' | 'Bulanan';
  zoneName: string;
  cropName: string;
  generatedAt: string;
  headers: string[];
  rows: (string | number)[][];
  summaryMetrics: { label: string; value: string }[];
  csvContent: string;
}

// Convert 2D array of headers and rows into clean CSV
export function convertToCsv(headers: string[], rows: (string | number)[][]): string {
  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCsv).join(',');
  const rowLines = rows.map((r) => r.map(escapeCsv).join(','));
  return [headerLine, ...rowLines].join('\r\n');
}

// 1. Generate Daily Telemetry & Irrigation Report (24 Hours)
export function generateDailyReport(zone: FarmZone, dateStr?: string): GeneratedReport {
  const today = dateStr || new Date().toISOString().split('T')[0];
  const headers = [
    'Waktu (WIB)',
    'Kelembaban Tanah (%)',
    'Suhu Tanah (°C)',
    'Suhu Udara (°C)',
    'Kelembaban Udara RH (%)',
    'pH Tanah',
    'Nitrogen (mg/kg)',
    'Fosfor (mg/kg)',
    'Kalium (mg/kg)',
    'VPD (kPa)',
    'Radiasi Surya (W/m²)',
    'Status Katup',
    'Volume Aliran (Liter)',
  ];

  const rows: (string | number)[][] = [];
  const baseMoisture = zone.sensors.soilMoisture;
  const baseTemp = zone.sensors.soilTemp;

  for (let hour = 0; hour < 24; hour++) {
    const timeLabel = `${String(hour).padStart(2, '0')}:00`;
    // Natural daily curve (cooler in morning, sun peak at 12:00)
    const sunFactor = Math.sin((Math.PI * Math.max(0, hour - 6)) / 12);
    const solarRad = hour >= 6 && hour <= 18 ? Math.round(sunFactor * zone.sensors.solarRadiation * (0.85 + Math.random() * 0.3)) : 0;
    const airTemp = +(zone.sensors.ambientTemp - 4 + sunFactor * 7 + (Math.random() - 0.5)).toFixed(1);
    const soilTemp = +(baseTemp - 1.5 + sunFactor * 3.5).toFixed(1);
    
    // Irrigation occurs at 06:00 and 16:00
    const isIrrigating = (hour >= 6 && hour <= 7) || (hour >= 16 && hour <= 17);
    const valveState = isIrrigating ? 'OPEN' : 'AUTO_STANDBY';
    const flowLitres = isIrrigating ? Math.round(zone.irrigation.dailyVolumeLiters / 2) : 0;
    const moisture = +(baseMoisture + (isIrrigating ? 8 : -0.5 * (hour % 6))).toFixed(1);
    const vpd = +(zone.sensors.vpd + (sunFactor * 0.4)).toFixed(2);

    rows.push([
      timeLabel,
      moisture,
      soilTemp,
      airTemp,
      zone.sensors.ambientHumidity,
      zone.sensors.soilPh,
      zone.sensors.nitrogen,
      zone.sensors.phosphorus,
      zone.sensors.potassium,
      vpd,
      solarRad,
      valveState,
      flowLitres,
    ]);
  }

  const csvContent = convertToCsv(headers, rows);

  return {
    title: `Laporan_Harian_Telemetri_${zone.name.split(' - ')[0].replace(/\s+/g, '_')}_${today}`,
    period: 'Harian',
    zoneName: zone.name,
    cropName: zone.crop,
    generatedAt: new Date().toLocaleString('id-ID'),
    headers,
    rows,
    summaryMetrics: [
      { label: 'Rata-rata Kelembaban', value: `${zone.sensors.soilMoisture}%` },
      { label: 'Total Volume Air Diberikan', value: `${zone.irrigation.dailyVolumeLiters.toLocaleString('id-ID')} Liter` },
      { label: 'Status Katup Terakhir', value: zone.irrigation.valveStatus },
      { label: 'Derajat Keasaman Tanah', value: `${zone.sensors.soilPh} pH` },
    ],
    csvContent,
  };
}

// 2. Generate Weekly Aggregation Report (7 Days)
export function generateWeeklyReport(zone: FarmZone): GeneratedReport {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const headers = [
    'Hari',
    'Tanggal',
    'Rata2 Kelembaban Tanah (%)',
    'Suhu Tanah Min-Maks (°C)',
    'Total Air Terdistribusi (L)',
    'Penghematan Air vs Konvensional (%)',
    'Rata-rata pH',
    'Indeks Hara NPK (mg/kg)',
    'Laju Evapotranspirasi ET₀ (mm)',
    'Indeks Vigor Kanopi (NDVI)',
  ];

  const now = new Date();
  const rows: (string | number)[][] = [];

  days.forEach((day, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - idx));
    const dateFormatted = d.toISOString().split('T')[0];

    const moisture = +(zone.sensors.soilMoisture + (idx % 2 === 0 ? 1.5 : -1.2)).toFixed(1);
    const tempRange = `${(zone.sensors.soilTemp - 2.5).toFixed(1)} - ${(zone.sensors.soilTemp + 3.2).toFixed(1)}`;
    const dailyWater = Math.round(zone.irrigation.dailyVolumeLiters * (0.9 + Math.random() * 0.2));
    const savedPercent = Math.round(32 + Math.random() * 8);
    const et0 = +(3.8 + Math.random() * 1.4).toFixed(1);

    rows.push([
      day,
      dateFormatted,
      moisture,
      tempRange,
      dailyWater,
      `${savedPercent}%`,
      zone.sensors.soilPh,
      `${zone.sensors.nitrogen}-${zone.sensors.phosphorus}-${zone.sensors.potassium}`,
      et0,
      zone.ndviStats.averageNdvi,
    ]);
  });

  const csvContent = convertToCsv(headers, rows);
  const weekLabel = `Minggu_${Math.ceil(now.getDate() / 7)}_Bulan_${now.getMonth() + 1}_${now.getFullYear()}`;

  return {
    title: `Laporan_Mingguan_${zone.name.split(' - ')[0].replace(/\s+/g, '_')}_${weekLabel}`,
    period: 'Mingguan',
    zoneName: zone.name,
    cropName: zone.crop,
    generatedAt: new Date().toLocaleString('id-ID'),
    headers,
    rows,
    summaryMetrics: [
      { label: 'Total Pemakaian Air 7 Hari', value: `${(zone.irrigation.dailyVolumeLiters * 7).toLocaleString('id-ID')} Liter` },
      { label: 'Efisiensi Air Mingguan', value: '~36.4% lebih hemat' },
      { label: 'Rata-rata NDVI Kanopi', value: `${zone.ndviStats.averageNdvi} (Vigor Tinggi)` },
      { label: 'Stabilitas pH Tanah', value: `${zone.sensors.soilPh} (Netral Ideal)` },
    ],
    csvContent,
  };
}

// 3. Generate Monthly Executive Presentation Report (30 Days / 4 Weeks)
export function generateMonthlyReport(zone: FarmZone): GeneratedReport {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const headers = [
    'Minggu Siklus Tanam',
    'Fase Fisiologis Tanaman',
    'Total Volume Air Diterapkan (m³)',
    'Air Dihemat vs Konvensional (m³)',
    'Dosis Fertigasi NPK (kg/Ha)',
    'Rata-rata Kelembaban Volumetrik (%)',
    'Rata-rata pH Tanah',
    'Skor Kesehatan Tanaman (%)',
    'Rata-rata NDVI Kanopi',
    'Estimasi Proyeksi Hasil Panen (Ton/Ha)',
  ];

  const rows: (string | number)[][] = [
    ['Minggu 1 (Awal)', 'Vegetatif Dini', 42.5, 24.0, 35, 52.4, 6.4, 94, 0.72, 8.4],
    ['Minggu 2 (Pertengahan)', 'Vegetatif Cepat', 48.0, 26.5, 40, 54.1, 6.3, 95, 0.76, 8.8],
    ['Minggu 3 (Puncak)', 'Inisiasi Pembungaan', 55.2, 31.0, 45, 50.8, 6.5, 93, 0.81, 9.2],
    ['Minggu 4 (Saat Ini)', zone.stage, 51.0, 28.5, 42, zone.sensors.soilMoisture, zone.sensors.soilPh, zone.healthScore, zone.ndviStats.averageNdvi, 9.5],
  ];

  const csvContent = convertToCsv(headers, rows);

  return {
    title: `Bahan_Presentasi_Bulanan_Eksekutif_${zone.name.split(' - ')[0].replace(/\s+/g, '_')}_${currentMonth}_${currentYear}`,
    period: 'Bulanan',
    zoneName: zone.name,
    cropName: zone.crop,
    generatedAt: new Date().toLocaleString('id-ID'),
    headers,
    rows,
    summaryMetrics: [
      { label: 'Total Volume Air Dihemat', value: '110.0 m³ (38.2%)' },
      { label: 'Pupuk Kimia Dihemat', value: '28.5% (Variable Rate Fertigation)' },
      { label: 'Estimasi Peningkatan Panen', value: '+22.4% vs Lahan Konvensional' },
      { label: 'Indeks Kesehatan Agrikultur', value: `${zone.healthScore}/100 (Optimal)` },
    ],
    csvContent,
  };
}
