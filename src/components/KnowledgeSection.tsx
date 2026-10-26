import React from 'react';
import { SMART_FARM_KNOWLEDGE } from '../data/mockFarmData';

interface KnowledgeSectionProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ onClose, isModal = false }) => {
  return (
    <div className={`text-neutral-200 ${isModal ? 'max-w-4xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <span>Knowledge Base</span>
            <span aria-hidden="true">·</span>
            <span>Precision Agriculture 5.0</span>
            <span aria-hidden="true">·</span>
            <span>IoT & Generative AI</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Apa itu AI-Powered Smart Farm Management Platform?
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed max-w-3xl">
            {SMART_FARM_KNOWLEDGE.overview}
          </p>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            aria-label="Tutup panduan"
          >
            ✕
          </button>
        )}
      </div>

      {/* Benchmark KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {SMART_FARM_KNOWLEDGE.metricsBenchmark.map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-neutral-900 border border-neutral-800">
            <div className="text-xs text-neutral-400 mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">{kpi.value}</div>
            <div className="text-xs text-neutral-500 mt-1">{kpi.note}</div>
          </div>
        ))}
      </div>

      {/* 4 Pilar Arsitektur */}
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          01. Arsitektur 4-Pilar Platform Smart Farm
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SMART_FARM_KNOWLEDGE.corePillars.map((pillar, idx) => (
            <div key={idx} className="p-5 rounded-lg bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">{pillar.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">{pillar.description}</p>
              </div>
              <div className="pt-3 border-t border-neutral-800/80 text-xs text-neutral-400">
                <span className="text-neutral-500">Dampak Langsung:</span> {pillar.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perbandingan: Tradisional vs Smart Farm */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-white tracking-tight mb-4">
          02. Matriks Komparasi: Pertanian Konvensional vs AI Smart Farm
        </h3>
        <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-800/60 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-medium">Aspek Pertanian</th>
                <th className="py-3 px-4 font-medium text-neutral-400">Pendekatan Konvensional</th>
                <th className="py-3 px-4 font-medium text-emerald-400">AI-Powered Smart Farm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Manajemen Pengairan (Irigasi)</td>
                <td className="py-3 px-4 text-neutral-400">Jadwal tetap berdasarkan intuisi kalender; rentan over-irrigation atau kekeringan tersembunyi.</td>
                <td className="py-3 px-4 text-emerald-300">Presisi berbasis sensor kelembaban volumetrik, data evapotranspirasi (ET₀), dan prediksi peluang hujan.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Deteksi Hama & Penyakit</td>
                <td className="py-3 px-4 text-neutral-400">Inspeksi manual acak; sering terlambat disadari saat patogen jamur/bakteri telah menginfeksi area luas.</td>
                <td className="py-3 px-4 text-emerald-300">Computer Vision multimodal (Gemini Flash) menganalisis lesi daun dalam hitungan detik dengan rekomendasi obat terukur.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Pemupukan & Nutrisi Tanah (NPK)</td>
                <td className="py-3 px-4 text-neutral-400">Dosis seragam di seluruh hektar; berisiko kelebihan nitrogen yang mencemari air tanah dan memboroskan biaya.</td>
                <td className="py-3 px-4 text-emerald-300">Variable Rate Application (VRA) disesuaikan dengan zona defisiensi spesifik yang ditunjukkan sensor IoT NPK.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Pemantauan Kanopi Lahan Luas</td>
                <td className="py-3 px-4 text-neutral-400">Berjalan kaki di pematang lahan; mustahil mendeteksi stres klorofil mikro di tengah hamparan.</td>
                <td className="py-3 px-4 text-emerald-300">Survei drone multispektral otomatis dengan peta indeks vegetasi NDVI (Normalized Difference Vegetation Index).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Konsultasi Agronomi</td>
                <td className="py-3 px-4 text-neutral-400">Menunggu jadwal kunjungan penyuluh lapangan yang terbatas dan waktu respons lama.</td>
                <td className="py-3 px-4 text-emerald-300">AI Agronomist 24/7 yang memahami konteks telemetri lahan secara instan dan memberikan solusi kuratif.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementasi Praktis di Platform Ini */}
      <div className="mt-10 p-5 rounded-lg bg-neutral-900 border border-neutral-800">
        <h3 className="text-base font-semibold text-white mb-2">
          03. Cara Menjelajahi Platform AgriPulse Ini
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed mb-4">
          Aplikasi ini mendemonstrasikan secara langsung komponen operasional dari AI-Powered Smart Farm:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-semibold">•</span>
            <span><strong>Dashboard IoT:</strong> Pantau telemetri real-time tanah (moisture, NPK, pH) dan iklim mikro (VPD, solar radiasi).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-semibold">•</span>
            <span><strong>Diagnosis AI:</strong> Uji patologi daun menggunakan Gemini Vision untuk mengidentifikasi penyakit dan dosis pengobatan.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-semibold">•</span>
            <span><strong>Irigasi Otomatis:</strong> Simulasikan controller katup presisi dengan kalkulasi penghematan air liter per meter persegi.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-semibold">•</span>
            <span><strong>Drone NDVI:</strong> Tinjau peta kesehatan kanopi vegetasi multispektral resolusi tinggi.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
