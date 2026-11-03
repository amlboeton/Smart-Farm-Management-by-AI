import { FarmZone, WeatherDay } from '../types/farm';

export const PT_AGRICOLE_LOCATION = {
  name: 'Kebun PT Agricole Indonesia Makmur',
  companyName: 'PT Agricole Indonesia Makmur',
  coordinates: {
    lat: -6.7532660826354585,
    lng: 107.01747234233768,
  },
  region: 'Kec. Sukaresmi / Cipanas, Kab. Cianjur, Jawa Barat 43254',
  altitudeMeters: 1085,
};

export const INITIAL_ZONES: FarmZone[] = [
  {
    id: 'zone-a',
    name: 'Blok A - Lapangan Terbuka Jagung Hibrida PT Agricole',
    category: 'Open Field',
    crop: 'Jagung Hibrida P32 Singa',
    variety: 'Zea mays var. indentata',
    plantingDate: '12 September 2026',
    harvestTarget: '28 November 2026',
    areaHectares: 14.5,
    stage: 'Fase Pembungaan (R1 Silking)',
    healthScore: 92,
    image: '/src/assets/images/hero_smart_farm_aerial_1792959250082.jpg',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'LoRaWAN AS923',
      gatewayId: 'GW-AGRICOLE-01 (Tower Sentral Kebun)',
      nodeId: 'NODE-AGRICOLE-A1-TDR',
      frequencyMhz: 923.2,
      rssiDbm: -78,
      snrDb: 9.4,
      packetLossPercent: 0.1,
      batteryPercent: 96,
      lastUplink: '3 detik yang lalu',
    },
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
    name: 'Blok B - Smart Greenhouse Hidroponik Tomat Beef PT Agricole',
    category: 'Greenhouse',
    crop: 'Tomat Beef & Paprika Merah',
    variety: 'Solanum lycopersicum & Capsicum annuum',
    plantingDate: '01 Agustus 2026',
    harvestTarget: '15 November 2026',
    areaHectares: 2.8,
    stage: 'Fase Pembuahan & Pematangan',
    healthScore: 96,
    image: '/src/assets/images/greenhouse_iot_smart_1792959251639.jpg',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'Cellular NB-IoT Band 8',
      gatewayId: 'TELKOMSEL-NBIOT-CIANJUR-BTS',
      nodeId: 'NODE-AGRICOLE-B1-SHT4X',
      frequencyMhz: 880.0,
      rssiDbm: -71,
      snrDb: 14.2,
      packetLossPercent: 0.0,
      batteryPercent: 98,
      lastUplink: '1 detik yang lalu',
    },
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
];

export function normalizeFarmZone(rawZone: any): FarmZone {
  const fallback = rawZone?.id === 'zone-b' ? INITIAL_ZONES[1] : INITIAL_ZONES[0];
  if (!rawZone || typeof rawZone !== 'object') return fallback;

  return {
    ...fallback,
    ...rawZone,
    location: {
      name: rawZone.location?.name || PT_AGRICOLE_LOCATION.name,
      companyName: rawZone.location?.companyName || PT_AGRICOLE_LOCATION.companyName,
      coordinates: {
        lat: rawZone.location?.coordinates?.lat ?? PT_AGRICOLE_LOCATION.coordinates.lat,
        lng: rawZone.location?.coordinates?.lng ?? PT_AGRICOLE_LOCATION.coordinates.lng,
      },
      region: rawZone.location?.region || PT_AGRICOLE_LOCATION.region,
      altitudeMeters: rawZone.location?.altitudeMeters ?? PT_AGRICOLE_LOCATION.altitudeMeters,
    },
    telemetryNetwork: {
      protocol: rawZone.telemetryNetwork?.protocol || (rawZone.id === 'zone-b' ? 'Cellular NB-IoT Band 8' : 'LoRaWAN AS923'),
      gatewayId: rawZone.telemetryNetwork?.gatewayId || (rawZone.id === 'zone-b' ? 'TELKOMSEL-NBIOT-CIANJUR-BTS' : 'GW-AGRICOLE-01 (Tower Sentral Kebun)'),
      nodeId: rawZone.telemetryNetwork?.nodeId || (rawZone.id === 'zone-b' ? 'NODE-AGRICOLE-B1-SHT4X' : 'NODE-AGRICOLE-A1-TDR'),
      frequencyMhz: typeof rawZone.telemetryNetwork?.frequencyMhz === 'number'
        ? rawZone.telemetryNetwork.frequencyMhz
        : (rawZone.id === 'zone-b' ? 880.0 : 923.2),
      rssiDbm: typeof rawZone.telemetryNetwork?.rssiDbm === 'number' ? rawZone.telemetryNetwork.rssiDbm : -78,
      snrDb: typeof rawZone.telemetryNetwork?.snrDb === 'number' ? rawZone.telemetryNetwork.snrDb : 9.4,
      packetLossPercent: typeof rawZone.telemetryNetwork?.packetLossPercent === 'number' ? rawZone.telemetryNetwork.packetLossPercent : 0.1,
      batteryPercent: typeof rawZone.telemetryNetwork?.batteryPercent === 'number' ? rawZone.telemetryNetwork.batteryPercent : 96,
      lastUplink: rawZone.telemetryNetwork?.lastUplink || '3 detik yang lalu',
    },
    sensors: {
      ...fallback.sensors,
      ...(rawZone.sensors || {}),
    },
    irrigation: {
      ...fallback.irrigation,
      ...(rawZone.irrigation || {}),
    },
    ndviStats: {
      ...fallback.ndviStats,
      ...(rawZone.ndviStats || {}),
    },
  };
}


export const PRELOADED_LEAF_SAMPLES = [
  {
    id: 'sample-corn-rust',
    title: 'Hawar Daun Jagung (Southern Corn Leaf Blight)',
    crop: 'Jagung Hibrida',
    zone: 'Blok A - Lapangan Terbuka PT Agricole',
    image: '/src/assets/images/crop_leaf_sample_1792959251114.jpg',
    symptoms: 'Bercak memanjang kecokelatan dengan tepi gelap dan halo klorotik pada daun bagian tengah.',
    expectedDisease: 'Bipolaris maydis (Hawar Daun Jagung / Southern Corn Leaf Blight)',
  },
  {
    id: 'sample-tomato-blight',
    title: 'Bercak Kering Tomat (Early Blight Alternaria)',
    crop: 'Tomat Beef',
    zone: 'Blok B - Greenhouse PT Agricole',
    image: '/src/assets/images/crop_leaf_sample_1792959251114.jpg',
    symptoms: 'Lesi konsentris berbentuk lingkaran mirip target panahan dengan nekrosis jaringan daun.',
    expectedDisease: 'Alternaria solani (Early Blight / Bercak Kering Daun)',
  },
];

export const WEATHER_FORECAST: WeatherDay[] = [
  { day: 'Hari Ini', tempMax: 28, tempMin: 18, condition: 'Cerah Berawan Sejuk', rainProbability: 25, et0: 4.2, windSpeedKmh: 8 },
  { day: 'Senin', tempMax: 27, tempMin: 18, condition: 'Hujan Sore Cipanas', rainProbability: 70, et0: 3.1, windSpeedKmh: 12 },
  { day: 'Selasa', tempMax: 26, tempMin: 17, condition: 'Kabut & Hujan Ringan', rainProbability: 75, et0: 2.6, windSpeedKmh: 14 },
  { day: 'Rabu', tempMax: 28, tempMin: 18, condition: 'Cerah Berawan', rainProbability: 20, et0: 4.5, windSpeedKmh: 7 },
  { day: 'Kamis', tempMax: 29, tempMin: 19, condition: 'Cerah Khas Pegunungan', rainProbability: 15, et0: 4.8, windSpeedKmh: 6 },
  { day: 'Jumat', tempMax: 27, tempMin: 18, condition: 'Berawan Lembab', rainProbability: 40, et0: 3.8, windSpeedKmh: 9 },
  { day: 'Sabtu', tempMax: 26, tempMin: 17, condition: 'Hujan Pegunungan', rainProbability: 60, et0: 3.2, windSpeedKmh: 11 },
];

export const SMART_FARM_KNOWLEDGE = {
  overview: `AI-Powered Smart Farm Management Platform di kebun PT Agricole Indonesia Makmur (Koordinat: -6.753266, 107.017472, Cianjur Jawa Barat) adalah ekosistem agrikultur digital terintegrasi berbasis LoRaWAN / NB-IoT telemetri, Google Search & Maps Grounding, dan Gemini Multimodal AI.`,
  corePillars: [
    {
      title: '1. Lapisan Sensorik & Akuisisi Data (IoT & Remote Sensing)',
      description: 'Sensor tanah in-situ mengukur kelembaban volumetrik, EC, pH, dan NPK real-time. Didukung stasiun cuaca kanopi Cipanas dan pencitraan drone NDVI.',
      benefit: 'Transparansi kondisi riil tanah dan mikroklimat lahan PT Agricole Indonesia Makmur.'
    },
    {
      title: '2. Jaringan LoRaWAN & NB-IoT Telemetri',
      description: 'Transmisi nirkabel jarak jauh berdaya rendah (AS923 923.2 MHz & NB-IoT Band 8) dari node sensor ke gateway sentral tanpa khawatir blank spot.',
      benefit: 'Uptime transmisi data 99.9% dengan konsumsi daya baterai solar panel hingga 3 tahun.'
    },
    {
      title: '3. Engine Kecerdasan Buatan (Gemini 3.8 Flash, Search & Maps Grounding)',
      description: 'Model AI multimodal mendeteksi patogen daun, mengoptimalkan evapotranspirasi ET₀, serta terhubung langsung dengan Google Search (harga komoditas pasar) dan Google Maps (geospasial logistik).',
      benefit: 'Diagnosis dini infeksi jamur dan wawasan harga pasar pasar induk terverifikasi live.'
    },
    {
      title: '4. Aktuasi Otomatis & Pertanian Presisi (Precision Actuation)',
      description: 'Pengontrol katup solenoid dan injeksi fertigasi presisi mengalirkan nutrisi terukur ke blok Jagung dan Greenhouse Tomat.',
      benefit: 'Efisiensi air 38.2% dan penghematan pupuk hara NPK hingga 28.5%.'
    }
  ],
  metricsBenchmark: [
    { label: 'Efisiensi Penggunaan Air', value: '38.2%', note: 'Terukur di kebun PT Agricole vs sistem siram konvensional' },
    { label: 'Penghematan Pupuk Kimia', value: '28.5%', note: 'Variable Rate Fertigation berbasis sensor NPK' },
    { label: 'Peningkatan Hasil Panen', value: '+22.4%', note: 'Proyeksi hasil panen hortikultura & jagung' },
    { label: 'Latensi Telemetri LoRaWAN', value: '< 2 Detik', note: 'Gateway sentral tower kebun PT Agricole' }
  ]
};
