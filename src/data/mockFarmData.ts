import { FarmZone, WeatherDay } from '../types/farm';

export const INITIAL_ZONES: FarmZone[] = [
  {
    id: 'zone-a',
    name: 'Blok A - Lapangan Terbuka Jagung Hibrida',
    category: 'Open Field',
    crop: 'Jagung Hibrida P32 Singa',
    variety: 'Zea mays var. indentata',
    plantingDate: '12 September 2026',
    harvestTarget: '28 November 2026',
    areaHectares: 14.5,
    stage: 'Fase Pembungaan (R1 Silking)',
    healthScore: 92,
    image: '/src/assets/images/hero_smart_farm_aerial_1792959250082.jpg',
    sensors: {
      soilMoisture: 42,
      soilTemp: 26.4,
      soilPh: 6.5,
      nitrogen: 142,
      phosphorus: 38,
      potassium: 195,
      ambientTemp: 29.8,
      ambientHumidity: 68,
      solarRadiation: 780,
      vpd: 1.15,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 120,
      dailyVolumeLiters: 4850,
      lastIrrigationTime: 'Hari ini, 05:45 WIB',
      nextScheduledTime: 'Hari ini, 16:30 WIB',
      targetMoisturePercent: 50,
    },
    ndviStats: {
      averageNdvi: 0.78,
      vigorousPercent: 78,
      moderatePercent: 16,
      stressedPercent: 6,
      lastDroneFlight: '24 Oktober 2026, 08:30 WIB',
    },
  },
  {
    id: 'zone-b',
    name: 'Blok B - Smart Greenhouse Hidroponik Tomat & Paprika',
    category: 'Greenhouse',
    crop: 'Tomat Beef & Paprika Merah',
    variety: 'Solanum lycopersicum & Capsicum annuum',
    plantingDate: '01 Agustus 2026',
    harvestTarget: '15 November 2026',
    areaHectares: 2.8,
    stage: 'Fase Pembuahan & Pematangan',
    healthScore: 96,
    image: '/src/assets/images/greenhouse_iot_smart_1792959251639.jpg',
    sensors: {
      soilMoisture: 62,
      soilTemp: 23.8,
      soilPh: 6.1,
      nitrogen: 210,
      phosphorus: 55,
      potassium: 280,
      ambientTemp: 25.2,
      ambientHumidity: 72,
      solarRadiation: 540,
      vpd: 0.88,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 45,
      dailyVolumeLiters: 1620,
      lastIrrigationTime: 'Hari ini, 11:15 WIB',
      nextScheduledTime: 'Hari ini, 14:00 WIB',
      targetMoisturePercent: 65,
    },
    ndviStats: {
      averageNdvi: 0.88,
      vigorousPercent: 89,
      moderatePercent: 9,
      stressedPercent: 2,
      lastDroneFlight: '23 Oktober 2026, 14:00 WIB',
    },
  },
  {
    id: 'zone-c',
    name: 'Blok C - Kebun Kopi Arabika & Hortikultura Lereng',
    category: 'Terrace Orchard',
    crop: 'Kopi Arabika Typica & Cabai Rawit',
    variety: 'Coffea arabica & Capsicum frutescens',
    plantingDate: '15 Maret 2025',
    harvestTarget: 'Desember 2026',
    areaHectares: 8.2,
    stage: 'Fase Pembentukan Buah (Berry Development)',
    healthScore: 84,
    image: '/src/assets/images/field_drone_ndvi_1792959250550.jpg',
    sensors: {
      soilMoisture: 38,
      soilTemp: 24.1,
      soilPh: 5.8,
      nitrogen: 110,
      phosphorus: 29,
      potassium: 160,
      ambientTemp: 26.5,
      ambientHumidity: 65,
      solarRadiation: 690,
      vpd: 1.28,
    },
    irrigation: {
      valveStatus: 'CLOSED',
      flowRateLpm: 0,
      dailyVolumeLiters: 2200,
      lastIrrigationTime: 'Kemarin, 17:00 WIB',
      nextScheduledTime: 'Hari ini, 15:30 WIB',
      targetMoisturePercent: 45,
    },
    ndviStats: {
      averageNdvi: 0.69,
      vigorousPercent: 64,
      moderatePercent: 24,
      stressedPercent: 12,
      lastDroneFlight: '22 Oktober 2026, 09:15 WIB',
    },
  },
];

export const PRELOADED_LEAF_SAMPLES = [
  {
    id: 'sample-corn-rust',
    title: 'Hawar Daun Jagung (Southern Corn Leaf Blight)',
    crop: 'Jagung Hibrida',
    zone: 'Blok A - Lapangan Terbuka',
    image: '/src/assets/images/crop_leaf_sample_1792959251114.jpg',
    symptoms: 'Bercak memanjang kecokelatan dengan tepi gelap dan halo klorotik pada daun bagian tengah.',
    expectedDisease: 'Bipolaris maydis (Hawar Daun Jagung / Southern Corn Leaf Blight)',
  },
  {
    id: 'sample-tomato-blight',
    title: 'Bercak Kering Tomat (Early Blight Alternaria)',
    crop: 'Tomat Beef',
    zone: 'Blok B - GreenHouse',
    image: '/src/assets/images/crop_leaf_sample_1792959251114.jpg',
    symptoms: 'Lesi konsentris berbentuk lingkaran mirip target panahan dengan nekrosis jaringan daun.',
    expectedDisease: 'Alternaria solani (Early Blight / Bercak Kering Daun)',
  },
];

export const WEATHER_FORECAST: WeatherDay[] = [
  { day: 'Hari Ini', tempMax: 31, tempMin: 22, condition: 'Cerah Berawan', rainProbability: 20, et0: 4.8, windSpeedKmh: 9 },
  { day: 'Senin', tempMax: 30, tempMin: 23, condition: 'Hujan Ringan Sore', rainProbability: 65, et0: 3.4, windSpeedKmh: 14 },
  { day: 'Selasa', tempMax: 29, tempMin: 22, condition: 'Hujan Sedang', rainProbability: 75, et0: 2.8, windSpeedKmh: 16 },
  { day: 'Rabu', tempMax: 31, tempMin: 23, condition: 'Cerah', rainProbability: 15, et0: 5.1, windSpeedKmh: 8 },
  { day: 'Kamis', tempMax: 32, tempMin: 24, condition: 'Cerah Terik', rainProbability: 10, et0: 5.4, windSpeedKmh: 7 },
  { day: 'Jumat', tempMax: 30, tempMin: 23, condition: 'Berawan Sebagian', rainProbability: 35, et0: 4.2, windSpeedKmh: 11 },
  { day: 'Sabtu', tempMax: 29, tempMin: 22, condition: 'Hujan Lokal', rainProbability: 50, et0: 3.6, windSpeedKmh: 12 },
];

export const SMART_FARM_KNOWLEDGE = {
  overview: `AI-Powered Smart Farm Management Platform adalah ekosistem digital terintegrasi berbasis kecerdasan buatan (Artificial Intelligence), Internet of Things (IoT), Computer Vision, dan data satelit/drone yang dirancang untuk mengoptimalkan seluruh siklus produksi agrikultur secara presisi, terukur, dan berkelanjutan.`,
  corePillars: [
    {
      title: '1. Lapisan Sensorik & Akuisisi Data (IoT & Remote Sensing)',
      description: 'Sensor tanah in-situ mengukur kelembaban volumetrik, EC (Electrical Conductivity), pH, dan NPK secara real-time. Didukung stasiun mikroklimat (VPD, solar radiasi, suhu kanopi) dan pencitraan multispektral drone/satelit (NDVI, NDRE, EVI).',
      benefit: 'Transparansi kondisi riil tanah dan tanaman hingga tingkat resolusi meter persegi.'
    },
    {
      title: '2. Edge Computing & Konektivitas Telemetri',
      description: 'Pengiriman data telemetri dengan latensi rendah melalui protokol LoRaWAN, Cellular NB-IoT, atau Wi-Fi Mesh ke gateway edge, memproses ambang darurat secara mandiri tanpa tergantung koneksi internet penuh.',
      benefit: 'Keandalan tinggi di area perkebunan terpencil yang minim sinyal seluler konvensional.'
    },
    {
      title: '3. Engine Kecerdasan Buatan (AI Reasoning & Computer Vision)',
      description: 'Model multimodal (seperti Gemini 3.8 Flash) dan CNN mendeteksi tanda awal patogen tanaman dari citra daun, menghitung kurva evapotranspirasi dinamis (Penman-Monteith), dan memprediksi estimasi panen dengan akurasi tinggi.',
      benefit: 'Diagnosis dini infeksi jamur/hama sebelum menyebar ke seluruh blok lahan.'
    },
    {
      title: '4. Aktuasi Otomatis & Pertanian Presisi (Precision Actuation)',
      description: 'Sistem pengontrol katup solenoid (irigasi tetes/sprinkler) terhubung langsung dengan AI untuk mengalirkan air dan nutrisi cair (fertigasi) dengan dosis gram/liter yang sesuai kebutuhan fisiologis tanaman.',
      benefit: 'Efisiensi air 30%–50%, penghematan pupuk kimia 20%–35%, dan minim resiko leaching nutrisi.'
    }
  ],
  metricsBenchmark: [
    { label: 'Efisiensi Penggunaan Air', value: '30% - 50%', note: 'Dibandingkan sistem siram manual/terjadwal konvensional' },
    { label: 'Penghematan Pupuk Kimia', value: '20% - 35%', note: 'Melalui fertigasi berdasar pembacaan NPK sensorik' },
    { label: 'Peningkatan Hasil Panen (Yield)', value: '+15% - 28%', note: 'Berkat pencegahan stres air dan defisiensi nutrisi' },
    { label: 'Deteksi Dini Patogen', value: 'Akurasi 94%+', note: 'Pengurangan kerugian gagal panen akibat wabah hawar daun' }
  ]
};
