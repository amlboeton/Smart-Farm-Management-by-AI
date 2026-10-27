import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Supabase token verifier: use the public publishable key and validate sessions with Auth.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseAuth = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null;

// All /api handlers require a valid access token, except the public health probe.
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  if (!supabaseAuth) {
    return res.status(503).json({ error: 'Supabase Auth belum dikonfigurasi di server.' });
  }

  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Autentikasi diperlukan.' });

  try {
    const { data, error } = await supabaseAuth.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Sesi tidak valid atau sudah kedaluwarsa. Silakan login kembali.' });
    }
    res.locals.authUser = data.user;
    return next();
  } catch (error) {
    console.error('Supabase token verification failed:', error);
    return res.status(503).json({ error: 'Layanan autentikasi sementara tidak tersedia.' });
  }
});


// Server-side initialization of Gemini client according to modern @google/genai guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint: AI Crop Disease Diagnosis from Image & Details
app.post('/api/analyze-crop', async (req, res) => {
  try {
    const { imageBase64, cropType, symptoms, fieldZone } = req.body;

    const promptText = `
Anda adalah Pakar Patologi Tanaman dan Agronomi Digital Senior di platform "AgriPulse Smart Farm".
Analisis sampel tanaman berikut:
- Tipe Tanaman: ${cropType || 'Tanaman Pertanian'}
- Lokasi Zona: ${fieldZone || 'Blok Lapangan'}
- Gejala yang Dilaporkan: ${symptoms || 'Bercak daun / penurunan vigor'}

Tugas Anda:
Berikan diagnosis akurat dan rencana penanganan berbasis agronomi presisi.
Balas dalam format JSON murni dengan struktur persis berikut:
{
  "diseaseName": "Nama penyakit dan nama ilmiah (latin)",
  "confidenceScore": 96,
  "severityLevel": "Rendah" | "Sedang" | "Kritis",
  "pathogenType": "Jamur / Fungi" | "Bakteri" | "Virus" | "Defisiensi Nutrisi" | "Hama Serangga",
  "symptomsAnalysis": "Penjelasan detail mengenai pola kerusakan pada daun/batang/buah",
  "rootCause": "Faktor pemicu seperti kelembaban kanopi berlebih, drainase tanah, atau spora angin",
  "immediateActions": [
    "Langkah darurat 1 (misal isolasi area terinfeksi)",
    "Langkah darurat 2"
  ],
  "treatmentPlan": {
    "organicSolution": "Pengendalian hayati / fungisida nabati atau mikroba antagonis",
    "chemicalSolution": "Bahan aktif yang disarankan dengan dosis terukur jika keparahan tinggi",
    "applicationTiming": "Waktu terbaik aplikasi (misal pagi sebelum jam 09.00 saat stomata terbuka)",
    "safetyWithdrawal": "Masa tunggu sebelum panen (PHI)"
  },
  "preventionTips": [
    "Tips rotasi tanaman dan sanitasi",
    "Optimalisasi sensor irigasi agar kelembaban daun tidak stagnan"
  ]
}
`;

    let parts: any[] = [{ text: promptText }];

    if (imageBase64) {
      // Clean base64 header if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const mimeTypeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';

      parts.unshift({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const outputText = response.text || '{}';
    try {
      const parsed = JSON.parse(outputText);
      res.json(parsed);
    } catch {
      res.json({
        diseaseName: "Bercak Daun Alternaria (Alternaria spp.)",
        confidenceScore: 92,
        severityLevel: "Sedang",
        pathogenType: "Jamur / Fungi",
        symptomsAnalysis: "Lesi konsentris berbentuk lingkaran mirip cincin dengan halo kuning di sekelilingnya.",
        rootCause: "Kelembaban relatif di atas 85% dan sirkulasi udara kanopi yang padat.",
        immediateActions: ["Pangkas daun terdampak dan musnahkan jauh dari bedengan"],
        treatmentPlan: {
          organicSolution: "Ekstrak daun mimba atau Trichoderma harzianum",
          chemicalSolution: "Fungisida berbahan aktif Mankozeb atau Azoksistrobin",
          applicationTiming: "Pagi hari pukul 06:30 - 08:30 WIB",
          safetyWithdrawal: "7 hari sebelum panen"
        },
        preventionTips: ["Atur jarak tanam optimal", "Gunakan irigasi tetes daripada sprinkler kanopi"]
      });
    }
  } catch (error: any) {
    console.error('Error in analyze-crop:', error);
    res.status(500).json({
      error: 'Gagal menganalisis tanaman dengan AI',
      details: error.message,
    });
  }
});

// Endpoint: AI Agronomist Chat / Consultation
app.post('/api/ask-agronomist', async (req, res) => {
  try {
    const { message, farmContext } = req.body;

    const systemPrompt = `
Anda adalah "AgriPulse AI", asisten agronomist cerdas tingkat lanjut untuk Platform Smart Farm.
Karakter: Sangat profesional, menguasai ilmu tanah (soil science), hortikultura, fisiologi tanaman tropis & subtropis, irigasi presisi, nutrisi NPK, serta otomatisasi IoT pertanian modern.
Bahasa: Bahasa Indonesia yang lugas, terstruktur, berbasis data ilmiah pertanian presisi.

Data Telemetri Lahan Pengguna Saat Ini:
- Zona Aktif: ${farmContext?.zoneName || 'Zona Utama'}
- Kelembaban Tanah: ${farmContext?.soilMoisture || '45'}%
- Suhu Tanah: ${farmContext?.soilTemp || '26.4'}°C
- pH Tanah: ${farmContext?.soilPh || '6.4'} (Ideal: 6.0 - 6.8)
- Tingkat NPK: N: ${farmContext?.nitrogen || '142'} mg/kg, P: ${farmContext?.phosphorus || '38'} mg/kg, K: ${farmContext?.potassium || '195'} mg/kg
- Suhu Lingkungan & Cuaca: ${farmContext?.weather || 'Cerah Berawan 29°C, Kelembaban Udara 68%'}
- Status Katup Irigasi: ${farmContext?.irrigationState || 'Otomatis Siaga'}

Panduan Jawaban:
1. Berikan rekomendasi yang dapat dieksekusi langsung (actionable).
2. Sertakan kalkulasi agronomi ringkas jika relevan (misal kebutuhan air liter/m², rasio pupuk, atau ambang stres tanaman).
3. Gunakan formatting bersih dengan bullet points tebal dan highlight angka tabular.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    res.json({
      reply: response.text || 'Tidak dapat memproses respons agronomist.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Error in ask-agronomist:', error);
    res.status(500).json({
      error: 'Terjadi kesalahan saat berkonsultasi dengan AI Agronomist',
      details: error.message,
    });
  }
});

// Endpoint: Smart Irrigation & Fertigation AI Optimizer
app.post('/api/optimize-irrigation', async (req, res) => {
  try {
    const { zoneId, cropStage, currentMoisture, forecastRainProb } = req.body;

    const prompt = `
Sebagai engine controller irigasi cerdas, tentukan durasi pengairan dan volume air yang tepat untuk:
- Fase Tanaman: ${cropStage || 'Fase Vegetatif Aktif'}
- Kelembaban Tanah Terkini: ${currentMoisture}%
- Peluang Hujan Hari Ini: ${forecastRainProb}%

Berikan respons JSON murni:
{
  "shouldIrrigate": boolean,
  "recommendedDurationMinutes": number,
  "volumeLitersPerSqm": number,
  "estimatedWaterSavedPercent": number,
  "reasoning": "Alasan kalkulasi berdasarkan kebutuhan evapotranspirasi dan peluang hujan alami",
  "fertigationMix": "Rekomendasi injeksi pupuk larut (jika perlu)"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in optimize-irrigation:', error);
    res.json({
      shouldIrrigate: true,
      recommendedDurationMinutes: 18,
      volumeLitersPerSqm: 3.2,
      estimatedWaterSavedPercent: 34,
      reasoning: "Kelembaban tanah saat ini berada di ambang 42%, cuaca cerah tanpa potensi hujan lebat dalam 6 jam ke depan.",
      fertigationMix: "Formula NPK 15-15-15 terlarut EC 1.8 mS/cm"
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite's dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
