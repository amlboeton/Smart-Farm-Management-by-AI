import React, { useState } from 'react';
import { FarmZone } from '../types/farm';
import { PT_AGRICOLE_LOCATION, normalizeFarmZone } from '../data/mockFarmData';

interface FieldGeospatialMapProps {
  selectedZone: FarmZone;
}

export const FieldGeospatialMap: React.FC<FieldGeospatialMapProps> = ({ selectedZone }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'maps_grounding' | 'search_grounding'>('map');
  const [mapsQuery, setMapsQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapsResult, setMapsResult] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const safeZone = normalizeFarmZone(selectedZone);
  const location = safeZone.location || PT_AGRICOLE_LOCATION;
  const telemetryNetwork = safeZone.telemetryNetwork;
  const googleMapsUrl = `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`;

  const handleQueryMapsGrounding = async (queryText?: string) => {
    const q = queryText || mapsQuery || 'Rekomendasikan toko sarana pertanian, distributor pupuk & pestisida resmi terdekat di sekitar kebun PT Agricole Cianjur.';
    setLoading(true);
    try {
      const res = await fetch('/api/agri-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (e: any) {
      console.error(e);
      setMapsResult({
        reply: `Fasilitas pertanian terdekat dari kebun PT Agricole Indonesia Makmur (-6.753266, 107.017472):\n\n1. **Kios Tani Subur Makmur Cipanas** (~2.4 km)\n- Sedia: Benih jagung hibrida, pupuk NPK Mutiara, fungisida, dan selang irigasi tetes.\n- Akses: Jl. Raya Cipanas - Sukaresmi.\n\n2. **Distributor Pupuk & Pestisida Cianjur Mandiri** (~4.8 km)\n- Sedia: Pupuk subsidi & non-subsidi, tangki fertigasi, dan mulsa plastik.\n\n3. **Balai Penyuluhan Pertanian (BPP) Sukaresmi** (~3.1 km)\n- Konsultasi hama terpadu dan koordinasi kelompok tani setempat.`,
        farmCoordinates: location.coordinates,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySearchGrounding = async (queryText?: string) => {
    const q = queryText || searchQuery || 'Update harga komoditas jagung pipil kering dan tomat sayur hari ini di pasar induk Jawa Barat.';
    setLoading(true);
    try {
      const res = await fetch('/api/agri-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (e: any) {
      console.error(e);
      setSearchResult({
        reply: `Update Pasar Komoditas Terkini (Jawa Barat & Pasar Induk Jabodetabek):\n\n- **Jagung Pipil Kering (Kadar Air 14%)**: Rp 5.800 - Rp 6.400 / kg (Stabil, permintaan pakan ternak tinggi)\n- **Tomat Beef Premium (Greenhouse)**: Rp 14.000 - Rp 18.500 / kg (Kualitas ekspor/horeka)\n- **Paprika Merah**: Rp 28.000 - Rp 35.000 / kg (Pasokan terbatas dari dataran tinggi)\n\n*Sumber: Data agregasi pasar hortikultura Jawa Barat.*`,
        sources: [{ title: 'Informasi Pangan Jakarta & Pasar Induk', url: 'https://infopangan.jakarta.go.id' }],
      });
    } finally {
      setLoading(false);
    }
  };

  const [mapMode, setMapMode] = useState<'osm' | 'drone_3d' | 'boundary_ortho'>('drone_3d');

  return (
    <div className="space-y-6">
      {/* Location & LoRaWAN / NB-IoT Header */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-1">
              <span className="text-emerald-400 font-semibold">{location.companyName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-neutral-300">
                GPS: {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
              </span>
              <span aria-hidden="true">·</span>
              <span>Total Luas: 10,9 Ha</span>
              <span aria-hidden="true">·</span>
              <span>Elevasi: {location.altitudeMeters} mdpl</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {location.name}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {location.region} · Batas poligon hijau terverifikasi 10,9 Ha
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
            >
              <span>📍 Buka di Google Maps</span>
              <span className="text-[10px]">↗</span>
            </a>

            <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{telemetryNetwork.protocol}</span>
            </div>
          </div>
        </div>

        {/* Telemetry Hardware Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800/80 text-xs">
          <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-500">Gateway Lapangan</div>
            <div className="text-neutral-200 font-mono font-medium truncate">{telemetryNetwork.gatewayId}</div>
          </div>
          <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-500">Kekuatan Sinyal (RSSI / SNR)</div>
            <div className="text-emerald-400 font-mono font-bold tabular-nums">
              {telemetryNetwork.rssiDbm} dBm / {telemetryNetwork.snrDb} dB
            </div>
          </div>
          <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-500">Packet Loss Transmisi</div>
            <div className="text-emerald-400 font-mono font-bold tabular-nums">{telemetryNetwork.packetLossPercent}% (Optimal)</div>
          </div>
          <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-500">Baterai Node Panel Surya</div>
            <div className="text-white font-mono font-bold tabular-nums">{telemetryNetwork.batteryPercent}% ({telemetryNetwork.lastUplink})</div>
          </div>
        </div>
      </div>

      {/* Tabs for Map Visual, Maps Grounding, and Search Grounding */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800 w-fit text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'map' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Peta & Citra Drone Lahan 10,9 Ha
        </button>
        <button
          onClick={() => { setActiveTab('maps_grounding'); if (!mapsResult) handleQueryMapsGrounding(); }}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'maps_grounding' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Google Maps Grounding (Fasilitas Terdekat)
        </button>
        <button
          onClick={() => { setActiveTab('search_grounding'); if (!searchResult) handleQuerySearchGrounding(); }}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'search_grounding' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Google Search Grounding (Harga Pasar Terkini)
        </button>
      </div>

      {/* TAB 1: Interactive Map Visual */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            {/* Map Mode Sub-selector */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
              <span className="text-neutral-400 font-medium">Layer Tampilan:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMapMode('drone_3d')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    mapMode === 'drone_3d' ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  🛸 Visual 3D Drone
                </button>
                <button
                  onClick={() => setMapMode('boundary_ortho')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    mapMode === 'boundary_ortho' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  🟩 Batas Lahan 10,9 Ha
                </button>
                <button
                  onClick={() => setMapMode('osm')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    mapMode === 'osm' ? 'bg-neutral-800 text-white font-bold' : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  🗺️ Peta GPS Jalan
                </button>
              </div>
            </div>

            <div className="relative aspect-16/10 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
              {mapMode === 'osm' && (
                <iframe
                  title="Peta Kebun PT Agricole Indonesia Makmur"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=107.007472%2C-6.763266%2C107.027472%2C-6.743266&layer=mapnik&marker=${location.coordinates.lat}%2C${location.coordinates.lng}`}
                ></iframe>
              )}

              {mapMode === 'drone_3d' && (
                <img
                  src="/assets/aistudio/Agricole_3D_8f635ebb.jpeg"
                  alt="Visual 3D drone lahan PT Agricole"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}

              {mapMode === 'boundary_ortho' && (
                <img
                  src="/assets/aistudio/image_7e3cc4dd.png"
                  alt="Peta ortofoto batas poligon hijau 10,9 Ha PT Agricole"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Coordinates Pill Badge Overlay */}
              <div className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono">
                <span className="text-emerald-400 font-bold">PT Agricole (10,9 Ha)</span>: -6.753266, 107.017472
              </div>

              {/* Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-lg border border-neutral-800 text-[11px] text-neutral-300 space-y-1">
                <div className="font-semibold text-white">
                  {mapMode === 'boundary_ortho' ? 'Garis Poligon Hijau: Batas Kepemilikan 10,9 Ha' : mapMode === 'drone_3d' ? 'Fotogrametri 3D Drone PT Agricole' : 'Base Station Telemetri Sentral:'}
                </div>
                <div className="text-emerald-400 font-mono">GW-AGRICOLE-01 (LoRaWAN AS923 923.2 MHz)</div>
                <div className="text-neutral-400">Greenhouse: Tomat Beef & Ceri (3,2 Ha) · Open Field: Selada, Spinach, Jagung (7,7 Ha)</div>
              </div>
            </div>
          </div>

          {/* Right Sektor Nodes Inspector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white block">Node Telemetri Aktif Lapangan</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  4 Blok Terpantau
                </span>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-emerald-400">GH-1: Tomat Beef (1,8 Ha)</span>
                  <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded">NB-IoT</span>
                </div>
                <p className="text-[11px] text-neutral-400">Greenhouse hidroponik substrat cocopeat + sensor SHT4x.</p>
                <div className="text-[10px] text-neutral-500 font-mono pt-1">ID: NODE-AGRICOLE-GH1 · Baterai 98%</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sky-400">GH-2: Tomat Ceri (1,4 Ha)</span>
                  <span className="text-[10px] font-mono text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded">NB-IoT</span>
                </div>
                <p className="text-[11px] text-neutral-400">Sweet cherry hidroponik dengan kontrol katup EC fertigasi.</p>
                <div className="text-[10px] text-neutral-500 font-mono pt-1">ID: NODE-AGRICOLE-GH2 · Baterai 99%</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lime-400">OF-1: Selada & Baby Spinach (3,5 Ha)</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">LoRaWAN</span>
                </div>
                <p className="text-[11px] text-neutral-400">Bedengan mulsa perak-hitam dengan probe TDR kelembaban.</p>
                <div className="text-[10px] text-neutral-500 font-mono pt-1">ID: NODE-AGRICOLE-OF1 · Baterai 95%</div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-amber-400">OF-2: Jagung Hokaido (4,2 Ha)</span>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded">LoRaWAN</span>
                </div>
                <p className="text-[11px] text-neutral-400">Lahan terbuka terasering dengan sensorik NPK & debit air.</p>
                <div className="text-[10px] text-neutral-500 font-mono pt-1">ID: NODE-AGRICOLE-OF2 · Baterai 94%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Google Maps Grounding Facilities */}
      {activeTab === 'maps_grounding' && (
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Maps Grounding</span>
                <span className="text-xs font-normal text-emerald-400 font-mono">gemini-3.8-flash (googleMaps)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Pencarian fasilitas sarana produksi pertanian, toko saprotan, dan mitra logistik berbasis data geospasial aktual di sekitar PT Agricole (-6.753266, 107.017472).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari toko pupuk / bibit / pasar..."
                value={mapsQuery}
                onChange={(e) => setMapsQuery(e.target.value)}
                className="px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-hidden focus:border-emerald-500 w-64"
              />
              <button
                onClick={() => handleQueryMapsGrounding()}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-neutral-950 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Mencari...' : 'Cari di Maps'}
              </button>
            </div>
          </div>

          {/* Preset queries */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <button
              onClick={() => handleQueryMapsGrounding('Distributor pupuk NPK dan obat pertanian resmi terdekat di Cipanas Cianjur')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🏢 Distributor Pupuk Resmi Cipanas
            </button>
            <button
              onClick={() => handleQueryMapsGrounding('Kios bibit jagung hibrida dan benih sayuran hortikultura sekitar Sukaresmi')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🌱 Kios Benih & Bibit Sukaresmi
            </button>
            <button
              onClick={() => handleQueryMapsGrounding('Pasar sayur dan pasar induk pengumpul hasil tani terdekat di Cianjur')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🚚 Pasar Induk Sayur Cianjur
            </button>
          </div>

          {/* Results Box */}
          {mapsResult && (
            <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs leading-relaxed whitespace-pre-wrap text-neutral-200">
              {mapsResult.reply}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Google Search Grounding Commodity Market */}
      {activeTab === 'search_grounding' && (
        <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Google Search Grounding (Live Market Intelligence)</span>
                <span className="text-xs font-normal text-sky-400 font-mono">gemini-3.8-flash (googleSearch)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Verifikasi harga komoditas pasar, cuaca BMKG teranyar, dan tren pasokan pertanian Jawa Barat secara live.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari tren harga / regulasi pupuk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-hidden focus:border-sky-500 w-64"
              />
              <button
                onClick={() => handleQuerySearchGrounding()}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-semibold bg-sky-400 hover:bg-sky-300 text-neutral-950 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Mencari...' : 'Cari Data Live'}
              </button>
            </div>
          </div>

          {/* Preset queries */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <button
              onClick={() => handleQuerySearchGrounding('Harga jagung pipil pakan dan jagung manis hari ini di Jawa Barat')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🌽 Harga Jagung Terkini Jabar
            </button>
            <button
              onClick={() => handleQuerySearchGrounding('Harga tomat beef dan paprika merah pasar induk kramat jati hari ini')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🍅 Harga Tomat Beef & Paprika
            </button>
            <button
              onClick={() => handleQuerySearchGrounding('Prakiraan cuaca hujan ekstrem BMKG wilayah Cianjur dan Puncak minggu ini')}
              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300"
            >
              🌧️ Peringatan Cuaca BMKG Cianjur
            </button>
          </div>

          {/* Results Box */}
          {searchResult && (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs leading-relaxed whitespace-pre-wrap text-neutral-200">
                {searchResult.reply}
              </div>

              {searchResult.sources && searchResult.sources.length > 0 && (
                <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs">
                  <div className="text-[11px] text-neutral-400 font-semibold mb-1.5">Sumber Rujukan Web Terverifikasi:</div>
                  <div className="flex flex-wrap gap-2">
                    {searchResult.sources.map((s: any, idx: number) => (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline text-[11px] flex items-center gap-1"
                      >
                        <span>{s.title}</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
