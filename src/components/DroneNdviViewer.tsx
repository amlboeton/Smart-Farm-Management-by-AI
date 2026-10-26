import React, { useState } from 'react';
import { FarmZone } from '../types/farm';

interface DroneNdviViewerProps {
  zone: FarmZone;
}

export const DroneNdviViewer: React.FC<DroneNdviViewerProps> = ({ zone }) => {
  const [activeLayer, setActiveLayer] = useState<'rgb' | 'ndvi' | 'thermal'>('ndvi');
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number; ndvi: number; label: string } | null>({
    x: 48,
    y: 36,
    ndvi: 0.82,
    label: 'Sektor Barat Laut (Kerapatan Kanopi Sangat Baik)',
  });

  const inspectionPoints = [
    { x: 28, y: 32, ndvi: 0.84, label: 'Sektor A1 - Indeks Vegetasi Tinggi' },
    { x: 55, y: 45, ndvi: 0.79, label: 'Sektor A2 - Laju Fotosintesis Normal' },
    { x: 74, y: 62, ndvi: 0.52, label: 'Sektor A3 - Indikasi Stres Air Ringan' },
    { x: 38, y: 75, ndvi: 0.38, label: 'Sektor A4 - Saluran Drainase / Tanah Terbuka' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center gap-2">
              <span>Remote Sensing & UAV Telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Multispectral NIR + Red Edge</span>
              <span aria-hidden="true">·</span>
              <span>GSD: 1.8 cm/px</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Survei Drone Multispektral & Pemetaan Kesehatan Kanopi (NDVI)
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Memanfaatkan sensor pantulan Near-Infrared (NIR) untuk mengukur Normalized Difference Vegetation Index (NDVI). Mengidentifikasi stres klorofil, serangan hama tersembunyi, dan ketidakseragaman pertumbuhan tanaman jauh sebelum terlihat kasat mata.
            </p>
          </div>

          {/* Layer Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800 self-start md:self-auto">
            <button
              onClick={() => setActiveLayer('rgb')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeLayer === 'rgb' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Foto RGB Udara
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeLayer === 'ndvi' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Peta Spektrum NDVI
            </button>
            <button
              onClick={() => setActiveLayer('thermal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeLayer === 'thermal' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Termal Kanopi IR
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Map Canvas with false color overlays */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="relative aspect-16/10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
            {/* Base Drone Orthomosaic Image */}
            <img
              src="/src/assets/images/field_drone_ndvi_1792959250550.jpg"
              alt="Peta ortomosaik lahan"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* False Color Overlays */}
            {activeLayer === 'ndvi' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/35 via-lime-500/20 to-amber-500/30 mix-blend-color pointer-events-none"></div>
            )}
            {activeLayer === 'thermal' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/40 via-purple-600/30 to-amber-600/40 mix-blend-color pointer-events-none"></div>
            )}

            {/* Clickable Inspection Pins */}
            {inspectionPoints.map((pt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPoint(pt)}
                style={{ top: `${pt.y}%`, left: `${pt.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-transform hover:scale-125 ${
                  selectedPoint?.label === pt.label
                    ? 'bg-emerald-400 text-neutral-950 border-white ring-4 ring-emerald-400/30 z-20 scale-110'
                    : 'bg-neutral-900/90 text-white border-neutral-400 hover:border-emerald-300 z-10'
                }`}
                title={pt.label}
              >
                P{idx + 1}
              </button>
            ))}

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-lg border border-neutral-800 text-[10px] text-neutral-300">
              <div className="font-semibold mb-1 text-white">
                {activeLayer === 'ndvi' ? 'Indeks Kerapatan Vegetasi (NDVI)' : activeLayer === 'thermal' ? 'Suhu Kanopi (°C)' : 'Peta Citra Visual 24-bit'}
              </div>
              {activeLayer === 'ndvi' ? (
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-amber-400">&lt; 0.4 Stres</span>
                  <div className="w-20 h-2 rounded bg-gradient-to-r from-amber-500 via-lime-400 to-emerald-600"></div>
                  <span className="text-emerald-400">&gt; 0.8 Subur</span>
                </div>
              ) : activeLayer === 'thermal' ? (
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-indigo-400">22°C Dingin</span>
                  <div className="w-20 h-2 rounded bg-gradient-to-r from-indigo-600 via-purple-500 to-amber-500"></div>
                  <span className="text-amber-400">32°C Panas</span>
                </div>
              ) : (
                <span className="text-neutral-400">Resolusi GSD 1.8 cm per piksel sensor Sony RX1R</span>
              )}
            </div>

            {/* Drone status tag */}
            <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-neutral-300 border border-neutral-800">
              Misi Terakhir: {zone.ndviStats.lastDroneFlight}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Statistical Distribution & Selected Sektor Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* NDVI Health Distribution */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
            <span className="text-xs font-semibold text-white block">Distribusi Kanopi Lahan</span>

            <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-1">Rata-rata Indeks NDVI Blok</div>
              <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400">
                {zone.ndviStats.averageNdvi}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">Biomassa hijau sehat terverifikasi</div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Vegetasi Sangat Sehat (NDVI &gt; 0.70)</span>
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">{zone.ndviStats.vigorousPercent}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${zone.ndviStats.vigorousPercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Pertumbuhan Sedang (0.40 - 0.70)</span>
                  <span className="font-mono tabular-nums text-amber-400 font-bold">{zone.ndviStats.moderatePercent}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${zone.ndviStats.moderatePercent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Stres Air / Vegetasi Renggang (&lt; 0.40)</span>
                  <span className="font-mono tabular-nums text-rose-400 font-bold">{zone.ndviStats.stressedPercent}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${zone.ndviStats.stressedPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sektor Detail Pin Inspector */}
          {selectedPoint && (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2">
              <div className="text-neutral-400 text-[11px]">Inspeksi Titik Terpilih:</div>
              <div className="font-semibold text-white">{selectedPoint.label}</div>
              <div className="flex items-center justify-between py-1 border-t border-neutral-800">
                <span className="text-neutral-400">Skor NDVI Sensor:</span>
                <span className="text-emerald-400 font-mono font-bold tabular-nums">{selectedPoint.ndvi}</span>
              </div>
              <div className="text-[11px] text-neutral-400 leading-relaxed">
                {selectedPoint.ndvi >= 0.75
                  ? 'Klorofil aktif, indeks penyerapan nitrogen daun mencukupi fase generatif.'
                  : 'Perlu diperiksa kelembaban tanah di zona ini atau potensi kebocoran drip lateral.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
