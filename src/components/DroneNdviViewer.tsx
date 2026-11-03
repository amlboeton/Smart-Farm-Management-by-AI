import React, { useState } from 'react';
import { FarmZone } from '../types/farm';
import { PT_AGRICOLE_LAND_INFO } from '../data/mockFarmData';

interface DroneNdviViewerProps {
  zone: FarmZone;
}

export const DroneNdviViewer: React.FC<DroneNdviViewerProps> = ({ zone }) => {
  const [activeLayer, setActiveLayer] = useState<'drone_3d' | 'boundary_ortho' | 'ndvi' | 'thermal'>('drone_3d');
  const [selectedHotspot, setSelectedHotspot] = useState<{
    id: string;
    x: number;
    y: number;
    label: string;
    category: string;
    commodity: string;
    area: string;
    description: string;
    telemetry: string;
  } | null>({
    id: 'gh-beef-ceri',
    x: 49,
    y: 33,
    label: 'Kompleks Greenhouse Sentral',
    category: 'Greenhouse (3,2 Ha)',
    commodity: 'Tomat Beef & Tomat Ceri',
    area: '1,8 Ha (Beef) + 1,4 Ha (Ceri)',
    description: 'Greenhouse terlindung UV plastik 200 mikron hidroponik substrat cocopeat dengan sistem mikroklimat SHT4x.',
    telemetry: 'Cellular NB-IoT Band 8 (RSSI -71 dBm)',
  });

  const hotspots = [
    {
      id: 'gh-beef-ceri',
      x: 49,
      y: 33,
      label: 'Kompleks Greenhouse Sentral',
      category: 'Greenhouse (3,2 Ha)',
      commodity: 'Tomat Beef & Tomat Ceri',
      area: '1,8 Ha (Beef) + 1,4 Ha (Ceri)',
      description: 'Deretan rumah kaca hidroponik terlindung plastik UV dengan kontrol fertigasi tetes otomatis dan sensor suhu kanopi.',
      telemetry: 'Cellular NB-IoT Band 8 (NODE-AGRICOLE-GH1)',
    },
    {
      id: 'of-greens',
      x: 74,
      y: 35,
      label: 'Sektor Open Field Sayuran Daun',
      category: 'Open Field (3,5 Ha)',
      commodity: 'Selada Romaine & Baby Spinach',
      area: '3,5 Ha',
      description: 'Bedengan mulsa perak-hitam dengan irigasi mikrosprinkler adaptif untuk menjaga kelembaban daun di cuaca sejuk Cipanas.',
      telemetry: 'LoRaWAN AS923 (NODE-AGRICOLE-OF1)',
    },
    {
      id: 'of-corn',
      x: 72,
      y: 68,
      label: 'Sektor Open Field Jagung Hokaido',
      category: 'Open Field (4,2 Ha)',
      commodity: 'Jagung Hokaido Super Sweet',
      area: '4,2 Ha',
      description: 'Terasering lereng pegunungan bergradien optimal untuk drainase akar jagung manis hibrida Hokaido.',
      telemetry: 'LoRaWAN AS923 (NODE-AGRICOLE-OF2)',
    },
    {
      id: 'gw-tower',
      x: 39,
      y: 20,
      label: 'Base Station LoRaWAN & Hub Pompa Irigasi',
      category: 'Infrastruktur IoT',
      commodity: 'Gateway GW-AGRICOLE-01',
      area: 'Tower Sentral Kebun',
      description: 'Tower antena monopole 15 meter berdaya solar panel menjangkau radius 12 km ke seluruh batas 10,9 Ha lahan.',
      telemetry: '923.2 MHz AS923 · Paket Loss 0.0%',
    },
    {
      id: 'boundary-perimeter',
      x: 24,
      y: 52,
      label: 'Batas Poligon Hijau Lahan (10,9 Ha)',
      category: 'Batas Sah Properti',
      commodity: 'Perimeter Lahan PT Agricole',
      area: 'Total 10,9 Hektar',
      description: 'Garis batas hijau hasil pemetaan fotogrametri udara drone RTK, mencakup perbukitan, greenhouse, dan open field.',
      telemetry: 'Batas Sah Bersertifikat',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex flex-wrap items-center gap-2">
              <span className="text-emerald-400 font-semibold">Fotogrametri Drone & UAV Telemetri</span>
              <span aria-hidden="true">·</span>
              <span>Total Luas: 10,9 Ha (Batas Garis Hijau)</span>
              <span aria-hidden="true">·</span>
              <span>GSD: 1.8 cm/px</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-neutral-300">-6.753266, 107.017472</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Survei Drone Udara & Visual 3D Lahan PT Agricole Indonesia Makmur
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-3xl leading-relaxed">
              Visualisasi fotogrametri 3D dari penerbangan drone dengan batas poligon hijau seluas 10,9 Ha. Menampilkan klaster <strong className="text-white">Smart Greenhouse (Tomat Beef & Tomat Ceri)</strong> seluas 3,2 Ha dan <strong className="text-white">Open Field (Selada Romaine, Baby Spinach, Jagung Hokaido)</strong> seluas 7,7 Ha.
            </p>
          </div>

          {/* Layer Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800 self-start lg:self-auto shrink-0">
            <button
              onClick={() => setActiveLayer('drone_3d')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeLayer === 'drone_3d' ? 'bg-emerald-500 text-neutral-950 font-bold shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>🛸 Visual 3D Drone</span>
            </button>
            <button
              onClick={() => setActiveLayer('boundary_ortho')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeLayer === 'boundary_ortho' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span>🟩 Batas Lahan 10,9 Ha</span>
            </button>
            <button
              onClick={() => setActiveLayer('ndvi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeLayer === 'ndvi' ? 'bg-lime-500/20 text-lime-300 border border-lime-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Spektrum NDVI
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
        {/* Left 8 Cols: Canvas Display */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="relative aspect-16/10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 group">
            {/* 1. Visual 3D Drone Layer */}
            {activeLayer === 'drone_3d' && (
              <img
                src={PT_AGRICOLE_LAND_INFO.droneVisual3dUrl}
                alt="Visual 3D rekonstruksi drone kebun PT Agricole"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            )}

            {/* 2. Boundary Orthomosaic with Green Line */}
            {activeLayer === 'boundary_ortho' && (
              <img
                src={PT_AGRICOLE_LAND_INFO.boundaryOrthomosaicUrl}
                alt="Peta ortofoto batas poligon hijau 10,9 Ha PT Agricole"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            )}

            {/* 3. NDVI Multispectral with Color Gradients */}
            {activeLayer === 'ndvi' && (
              <>
                <img
                  src={PT_AGRICOLE_LAND_INFO.droneVisual3dUrl}
                  alt="Citra NDVI Lahan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/40 via-lime-400/25 to-amber-500/30 mix-blend-color pointer-events-none"></div>
              </>
            )}

            {/* 4. Thermal Infrared Layer */}
            {activeLayer === 'thermal' && (
              <>
                <img
                  src={PT_AGRICOLE_LAND_INFO.droneVisual3dUrl}
                  alt="Citra Termal Kanopi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/50 via-purple-600/35 to-amber-500/40 mix-blend-color pointer-events-none"></div>
              </>
            )}

            {/* Interactive Pins on Canvas (Active on drone_3d and boundary_ortho) */}
            {(activeLayer === 'drone_3d' || activeLayer === 'boundary_ortho') && (
              <>
                {hotspots.map((h, idx) => {
                  const isSelected = selectedHotspot?.id === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHotspot(h)}
                      style={{ top: `${h.y}%`, left: `${h.x}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                        isSelected
                          ? 'w-8 h-8 bg-emerald-400 text-neutral-950 border-white ring-4 ring-emerald-400/40 z-20 scale-110 shadow-lg'
                          : 'w-6 h-6 bg-neutral-900/90 text-white border-neutral-400 hover:border-emerald-300 hover:scale-125 z-10'
                      }`}
                      title={h.label}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </>
            )}

            {/* Layer Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-lg border border-neutral-800 text-[11px] text-neutral-300 space-y-1 max-w-xs">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {activeLayer === 'drone_3d' && 'Model 3D Rekonstruksi Drone'}
                {activeLayer === 'boundary_ortho' && 'Batas Poligon Hijau (10,9 Ha)'}
                {activeLayer === 'ndvi' && 'Indeks Kerapatan Klorofil (NDVI)'}
                {activeLayer === 'thermal' && 'Suhu Kanopi Inframerah (°C)'}
              </div>

              {activeLayer === 'boundary_ortho' ? (
                <div className="text-[10px] text-neutral-400">
                  <span className="text-emerald-400 font-bold">Garis Hijau:</span> Batas sah lahan seluas 10,9 Ha PT Agricole Indonesia Makmur.
                </div>
              ) : activeLayer === 'drone_3d' ? (
                <div className="text-[10px] text-neutral-400">
                  Klik pin nomor 1-5 untuk menginspeksi greenhouse, open field, dan infrastruktur.
                </div>
              ) : activeLayer === 'ndvi' ? (
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-amber-400">&lt; 0.4 Stres</span>
                  <div className="w-16 h-2 rounded bg-gradient-to-r from-amber-500 via-lime-400 to-emerald-600"></div>
                  <span className="text-emerald-400">&gt; 0.8 Subur</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-indigo-400">22°C</span>
                  <div className="w-16 h-2 rounded bg-gradient-to-r from-indigo-600 via-purple-500 to-amber-500"></div>
                  <span className="text-amber-400">32°C</span>
                </div>
              )}
            </div>

            {/* Top Right Live Tag */}
            <div className="absolute top-3 right-3 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-neutral-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>10,9 Ha Terpetakan</span>
            </div>
          </div>

          {/* Quick Hotspot Button Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-neutral-400 text-[11px] font-medium mr-1">Titik Survei:</span>
            {hotspots.map((h, idx) => (
              <button
                key={h.id}
                onClick={() => setSelectedHotspot(h)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                  selectedHotspot?.id === h.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {idx + 1}. {h.commodity.split(' ')[0]} ({h.category.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Land Distribution & Selected Sektor Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* 10.9 Ha Farm Area Breakdown Card */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                Zonasi Komoditas Lahan 10,9 Ha
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Terpetakan
              </span>
            </div>

            {/* Total Area Stat */}
            <div className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-neutral-400">Total Luas Lahan (Garis Hijau)</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">10,9 Ha</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Koordinat: -6.753266, 107.017472 · Elevasi 1.085 mdpl (Cipanas)
              </p>
            </div>

            {/* Commodities Breakdown Bar */}
            <div className="space-y-3 text-xs">
              {/* Greenhouse */}
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    Greenhouse (3,2 Ha)
                  </span>
                  <span className="font-mono text-sky-400 font-bold">29.4%</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  • <strong>Tomat Beef:</strong> 1,8 Ha (Hidroponik fertigasi)
                </div>
                <div className="text-[11px] text-neutral-300">
                  • <strong>Tomat Ceri:</strong> 1,4 Ha (Sweet cherry hidroponik)
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '29.4%' }}></div>
                </div>
              </div>

              {/* Open Field */}
              <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 space-y-1.5">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Open Field (7,7 Ha)
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">70.6%</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  • <strong>Selada Romaine & Baby Spinach:</strong> 3,5 Ha
                </div>
                <div className="text-[11px] text-neutral-300">
                  • <strong>Jagung Hokaido:</strong> 4,2 Ha (Hokkaido sweet corn)
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '70.6%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sektor Detail Pin Inspector */}
          {selectedHotspot && (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-[11px]">Inspeksi Sektor Drone:</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedHotspot.category}
                </span>
              </div>
              <div className="font-bold text-white text-sm">{selectedHotspot.label}</div>
              
              <div className="space-y-1 py-1 border-y border-neutral-800 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Komoditas:</span>
                  <span className="text-neutral-200 font-semibold">{selectedHotspot.commodity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Luas Sektor:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedHotspot.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Telemetri IoT:</span>
                  <span className="text-sky-300 font-mono">{selectedHotspot.telemetry}</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

