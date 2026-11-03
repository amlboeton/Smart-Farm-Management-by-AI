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

export const PT_AGRICOLE_LAND_INFO = {
  totalAreaHectares: 10.9,
  boundaryPolygonNote: 'Garis poligon hijau menandai batas resmi lahan PT Agricole Indonesia Makmur (10,9 Ha)',
  droneVisual3dUrl: '/assets/aistudio/Agricole_3D_8f635ebb.jpeg',
  boundaryOrthomosaicUrl: '/assets/aistudio/image_7e3cc4dd.png',
  greenhouseAreaHectares: 3.2,
  openFieldAreaHectares: 7.7,
  commodities: {
    greenhouse: ['Tomat Beef', 'Tomat Ceri'],
    openField: ['Selada Romaine', 'Baby Spinach', 'Jagung Hokaido'],
  },
};

export const INITIAL_ZONES: FarmZone[] = [
  {
    id: 'zone-gh-beef',
    name: 'Greenhouse 1 - Tomat Beef PT Agricole',
    category: 'Greenhouse',
    crop: 'Tomat Beef',
    variety: 'Solanum lycopersicum (Beefsteak Tomato)',
    plantingDate: '05 Agustus 2026',
    harvestTarget: '18 November 2026',
    areaHectares: 1.8,
    stage: 'Fase Pembuahan & Pematangan',
    healthScore: 96,
    image: '/assets/aistudio/Agricole_3D_8f635ebb.jpeg',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'Cellular NB-IoT Band 8',
      gatewayId: 'TELKOMSEL-NBIOT-CIANJUR-BTS',
      nodeId: 'NODE-AGRICOLE-GH1-SHT4X',
      frequencyMhz: 880.0,
      rssiDbm: -72,
      snrDb: 14.5,
      packetLossPercent: 0.0,
      batteryPercent: 98,
      lastUplink: '1 detik yang lalu',
    },
    sensors: {
      soilMoisture: 64,
      soilTemp: 23.5,
      soilPh: 6.2,
      nitrogen: 215,
      phosphorus: 58,
      potassium: 290,
      ambientTemp: 25.4,
      ambientHumidity: 70,
      solarRadiation: 560,
      vpd: 0.85,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 38,
      dailyVolumeLiters: 1420,
      lastIrrigationTime: 'Hari ini, 10:30 WIB',
      nextScheduledTime: 'Hari ini, 14:15 WIB',
      targetMoisturePercent: 65,
    },
    ndviStats: {
      averageNdvi: 0.89,
      vigorousPercent: 91,
      moderatePercent: 7,
      stressedPercent: 2,
      lastDroneFlight: '28 Oktober 2026, 09:15 WIB',
    },
  },
  {
    id: 'zone-gh-ceri',
    name: 'Greenhouse 2 - Tomat Ceri PT Agricole',
    category: 'Greenhouse',
    crop: 'Tomat Ceri',
    variety: 'Solanum lycopersicum var. cerasiforme (Sweet Cherry)',
    plantingDate: '15 Agustus 2026',
    harvestTarget: '25 November 2026',
    areaHectares: 1.4,
    stage: 'Fase Pembungaan & Pembesaran Buah',
    healthScore: 95,
    image: '/assets/aistudio/Agricole_3D_8f635ebb.jpeg',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'Cellular NB-IoT Band 8',
      gatewayId: 'TELKOMSEL-NBIOT-CIANJUR-BTS',
      nodeId: 'NODE-AGRICOLE-GH2-SHT4X',
      frequencyMhz: 880.0,
      rssiDbm: -70,
      snrDb: 15.1,
      packetLossPercent: 0.0,
      batteryPercent: 99,
      lastUplink: '2 detik yang lalu',
    },
    sensors: {
      soilMoisture: 61,
      soilTemp: 23.9,
      soilPh: 6.3,
      nitrogen: 195,
      phosphorus: 52,
      potassium: 265,
      ambientTemp: 25.8,
      ambientHumidity: 69,
      solarRadiation: 580,
      vpd: 0.92,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 32,
      dailyVolumeLiters: 1180,
      lastIrrigationTime: 'Hari ini, 11:00 WIB',
      nextScheduledTime: 'Hari ini, 15:00 WIB',
      targetMoisturePercent: 62,
    },
    ndviStats: {
      averageNdvi: 0.87,
      vigorousPercent: 88,
      moderatePercent: 10,
      stressedPercent: 2,
      lastDroneFlight: '28 Oktober 2026, 09:15 WIB',
    },
  },
  {
    id: 'zone-of-greens',
    name: 'Open Field 1 - Selada Romaine & Baby Spinach PT Agricole',
    category: 'Open Field',
    crop: 'Selada Romaine & Baby Spinach',
    variety: 'Lactuca sativa var. longifolia & Spinacia oleracea',
    plantingDate: '28 September 2026',
    harvestTarget: '10 November 2026',
    areaHectares: 3.5,
    stage: 'Fase Pertumbuhan Daun Vigor (Vegetatif Aktif)',
    healthScore: 93,
    image: '/assets/aistudio/image_7e3cc4dd.png',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'LoRaWAN AS923',
      gatewayId: 'GW-AGRICOLE-01 (Tower Sentral Kebun)',
      nodeId: 'NODE-AGRICOLE-OF1-TDR',
      frequencyMhz: 923.2,
      rssiDbm: -76,
      snrDb: 10.2,
      packetLossPercent: 0.1,
      batteryPercent: 95,
      lastUplink: '3 detik yang lalu',
    },
    sensors: {
      soilMoisture: 48,
      soilTemp: 25.1,
      soilPh: 6.6,
      nitrogen: 165,
      phosphorus: 42,
      potassium: 210,
      ambientTemp: 27.2,
      ambientHumidity: 74,
      solarRadiation: 720,
      vpd: 1.05,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 85,
      dailyVolumeLiters: 3100,
      lastIrrigationTime: 'Hari ini, 06:15 WIB',
      nextScheduledTime: 'Hari ini, 16:00 WIB',
      targetMoisturePercent: 55,
    },
    ndviStats: {
      averageNdvi: 0.82,
      vigorousPercent: 84,
      moderatePercent: 12,
      stressedPercent: 4,
      lastDroneFlight: '28 Oktober 2026, 08:30 WIB',
    },
  },
  {
    id: 'zone-of-jagung',
    name: 'Open Field 2 - Jagung Hokaido PT Agricole',
    category: 'Open Field',
    crop: 'Jagung Hokaido',
    variety: 'Zea mays saccharata (Hokkaido Super Sweet)',
    plantingDate: '01 September 2026',
    harvestTarget: '20 November 2026',
    areaHectares: 4.2,
    stage: 'Fase Pembungaan & Pengisian Bulir (R2 Blister)',
    healthScore: 94,
    image: '/assets/aistudio/image_7e3cc4dd.png',
    location: PT_AGRICOLE_LOCATION,
    telemetryNetwork: {
      protocol: 'LoRaWAN AS923',
      gatewayId: 'GW-AGRICOLE-01 (Tower Sentral Kebun)',
      nodeId: 'NODE-AGRICOLE-OF2-TDR',
      frequencyMhz: 923.2,
      rssiDbm: -79,
      snrDb: 9.1,
      packetLossPercent: 0.1,
      batteryPercent: 94,
      lastUplink: '4 detik yang lalu',
    },
    sensors: {
      soilMoisture: 43,
      soilTemp: 26.5,
      soilPh: 6.5,
      nitrogen: 148,
      phosphorus: 40,
      potassium: 198,
      ambientTemp: 28.6,
      ambientHumidity: 66,
      solarRadiation: 790,
      vpd: 1.18,
    },
    irrigation: {
      valveStatus: 'AUTO',
      flowRateLpm: 110,
      dailyVolumeLiters: 4300,
      lastIrrigationTime: 'Hari ini, 05:45 WIB',
      nextScheduledTime: 'Hari ini, 16:30 WIB',
      targetMoisturePercent: 50,
    },
    ndviStats: {
      averageNdvi: 0.80,
      vigorousPercent: 80,
      moderatePercent: 15,
      stressedPercent: 5,
      lastDroneFlight: '28 Oktober 2026, 08:30 WIB',
    },
  },
];

export function normalizeFarmZone(rawZone: any): FarmZone {
  // Map legacy ids if present
  let matchId = rawZone?.id;
  if (matchId === 'zone-a') matchId = 'zone-of-jagung';
  if (matchId === 'zone-b') matchId = 'zone-gh-beef';

  const found = INITIAL_ZONES.find((z) => z.id === matchId) || INITIAL_ZONES[0];
  if (!rawZone || typeof rawZone !== 'object') return found;

  return {
    ...found,
    ...rawZone,
    id: found.id,
    name: rawZone.name && !rawZone.name.includes('Kopi') && !rawZone.name.includes('P32') ? rawZone.name : found.name,
    crop: rawZone.crop && !rawZone.crop.includes('Kopi') && !rawZone.crop.includes('P32') ? rawZone.crop : found.crop,
    variety: found.variety,
    areaHectares: found.areaHectares,
    category: found.category,
    image: found.image,
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
      protocol: rawZone.telemetryNetwork?.protocol || found.telemetryNetwork.protocol,
      gatewayId: rawZone.telemetryNetwork?.gatewayId || found.telemetryNetwork.gatewayId,
      nodeId: rawZone.telemetryNetwork?.nodeId || found.telemetryNetwork.nodeId,
      frequencyMhz: typeof rawZone.telemetryNetwork?.frequencyMhz === 'number'
        ? rawZone.telemetryNetwork.frequencyMhz
        : found.telemetryNetwork.frequencyMhz,
      rssiDbm: typeof rawZone.telemetryNetwork?.rssiDbm === 'number' ? rawZone.telemetryNetwork.rssiDbm : found.telemetryNetwork.rssiDbm,
      snrDb: typeof rawZone.telemetryNetwork?.snrDb === 'number' ? rawZone.telemetryNetwork.snrDb : found.telemetryNetwork.snrDb,
      packetLossPercent: typeof rawZone.telemetryNetwork?.packetLossPercent === 'number' ? rawZone.telemetryNetwork.packetLossPercent : 0.1,
      batteryPercent: typeof rawZone.telemetryNetwork?.batteryPercent === 'number' ? rawZone.telemetryNetwork.batteryPercent : 96,
      lastUplink: rawZone.telemetryNetwork?.lastUplink || '3 detik yang lalu',
    },
    sensors: {
      ...found.sensors,
      ...(rawZone.sensors || {}),
    },
    irrigation: {
      ...found.irrigation,
      ...(rawZone.irrigation || {}),
    },
    ndviStats: {
      ...found.ndviStats,
      ...(rawZone.ndviStats || {}),
    },
  };
}

export const PRELOADED_LEAF_SAMPLES = [
  {
    id: 'sample-tomato-beef',
    title: 'Bercak Kering Daun Tomat Beef (Early Blight)',
    crop: 'Tomat Beef',
    zone: 'Greenhouse 1 - Tomat Beef PT Agricole',
    image: '/assets/aistudio/Agricole_3D_8f635ebb.jpeg',
    symptoms: 'Lesi konsentris kecokelatan mirip lingkaran target dengan halo klorotik pada kanopi tengah.',
    expectedDisease: 'Alternaria solani (Early Blight Tomat)',
  },
  {
    id: 'sample-tomato-ceri',
    title: 'Bercak Bakteri Tomat Ceri (Bacterial Spot)',
    crop: 'Tomat Ceri',
    zone: 'Greenhouse 2 - Tomat Ceri PT Agricole',
    image: '/assets/aistudio/Agricole_3D_8f635ebb.jpeg',
    symptoms: 'Bintik hitam basah berair pada helai daun muda dan tangkai kelopak buah ceri.',
    expectedDisease: 'Xanthomonas campestris pv. vesicatoria',
  },
  {
    id: 'sample-romaine-mildew',
    title: 'Embun Bulu Selada Romaine (Downy Mildew)',
    crop: 'Selada Romaine',
    zone: 'Open Field 1 - Selada Romaine & Baby Spinach PT Agricole',
    image: '/assets/aistudio/image_7e3cc4dd.png',
    symptoms: 'Bercak kekuningan bersudut di permukaan atas daun, dengan lapisan spora putih di bagian bawah.',
    expectedDisease: 'Bremia lactucae (Downy Mildew Selada)',
  },
  {
    id: 'sample-baby-spinach',
    title: 'Bercak Daun & Defisiensi Magnesium Baby Spinach',
    crop: 'Baby Spinach',
    zone: 'Open Field 1 - Selada Romaine & Baby Spinach PT Agricole',
    image: '/assets/aistudio/image_7e3cc4dd.png',
    symptoms: 'Klorosis antar-tulang daun bawah (interveinal chlorosis) disertai tepi helai melengkung.',
    expectedDisease: 'Defisiensi Unsur Hara Magnesium (Mg) / Cladosporium',
  },
  {
    id: 'sample-corn-hokkaido',
    title: 'Hawar Daun Jagung Hokaido (Southern Corn Leaf Blight)',
    crop: 'Jagung Hokaido',
    zone: 'Open Field 2 - Jagung Hokaido PT Agricole',
    image: '/assets/aistudio/image_7e3cc4dd.png',
    symptoms: 'Lesi memanjang kecokelatan sejajar tulang daun dengan nekrosis bertahap.',
    expectedDisease: 'Bipolaris maydis (Hawar Daun Jagung Hokaido)',
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
  overview: `AI-Powered Smart Farm Management Platform di kebun PT Agricole Indonesia Makmur (Koordinat: -6.753266, 107.017472, Cipanas, Cianjur, Jawa Barat). Lahan terpetakan seluas 10,9 Ha (dikelilingi batas garis hijau survei drone), terdiri dari 3,2 Ha Kompleks Smart Greenhouse (Tomat Beef & Tomat Ceri) serta 7,7 Ha Open Field (Selada Romaine, Baby Spinach, dan Jagung Hokaido). Terintegrasi dengan LoRaWAN / NB-IoT telemetri, Google Search & Maps Grounding, dan Gemini Multimodal AI.`,
  corePillars: [
    {
      title: '1. Pemetaan Geospasial Drone 3D & Batas Lahan 10,9 Ha',
      description: 'Rekonstruksi fotogrametri 3D mesh udara dan ortomosaik multispektral dengan poligon batas lahan resmi 10,9 Ha. Menampilkan elevasi kontur perbukitan Cipanas (1.085 mdpl), saluran drainase, serta blok greenhouse dan terasering terbuka.',
      benefit: 'Akurasi perencanaan zonasi tanam, kalkulasi kebutuhan irigasi per hektar, dan audit batas lahan tanpa sengketa.'
    },
    {
      title: '2. Jaringan Sensorik In-Situ LoRaWAN & NB-IoT Telemetri',
      description: 'Sensor tanah TDR 3-in-1 (kelembaban, EC, pH, NPK) di open field via LoRaWAN AS923 (923.2 MHz) serta sensor iklim mikro SHT4x di greenhouse via Cellular NB-IoT Band 8.',
      benefit: 'Uptime data telemetri 99.9%, interval sampling 3.5 detik, tanpa blank spot di pegunungan Cipanas.'
    },
    {
      title: '3. Engine AI Multimodal (Gemini 3.8 Flash, Search & Maps)',
      description: 'Model AI multimodal mendeteksi penyakit daun tanaman (tomat beef, tomat ceri, selada romaine, baby spinach, jagung hokaido), menghitung ET₀, serta terhubung live ke Google Search dan Maps.',
      benefit: 'Diagnosis patogen cepat dan informasi harga panen komoditas pasar induk terupdate.'
    },
    {
      title: '4. Aktuasi Otomatis & Pertanian Presisi (Precision Actuation)',
      description: 'Pengontrol katup solenoid dan injeksi fertigasi presisi mengalirkan nutrisi terukur ke greenhouse tomat dan bedengan terbuka sayuran/jagung.',
      benefit: 'Efisiensi air 38.2% dan penghematan pupuk hara NPK hingga 28.5%.'
    }
  ],
  metricsBenchmark: [
    { label: 'Total Luas Lahan', value: '10,9 Ha', note: 'Terverifikasi survei ortofoto batas hijau drone' },
    { label: 'Efisiensi Air Irigasi', value: '38.2%', note: 'Irigasi tetes presisi otomatis vs siram konvensional' },
    { label: 'Penghematan Pupuk Kimia', value: '28.5%', note: 'Variable Rate Fertigation berbasis sensor NPK' },
    { label: 'Latensi Telemetri LoRaWAN', value: '< 2 Detik', note: 'Gateway sentral tower kebun PT Agricole' }
  ]
};
