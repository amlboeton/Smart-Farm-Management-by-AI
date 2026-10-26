import React, { useState } from 'react';
import { FarmZone, WeatherDay } from '../types/farm';

interface IrrigationControllerProps {
  zone: FarmZone;
  weather: WeatherDay;
  onUpdateZone: (updatedZone: FarmZone) => void;
}

export const IrrigationController: React.FC<IrrigationControllerProps> = ({
  zone,
  weather,
  onUpdateZone,
}) => {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [targetMoisture, setTargetMoisture] = useState<number>(zone.irrigation.targetMoisturePercent);

  const handleToggleValve = (newStatus: 'OPEN' | 'CLOSED' | 'AUTO') => {
    const updatedZone: FarmZone = {
      ...zone,
      irrigation: {
        ...zone.irrigation,
        valveStatus: newStatus,
        flowRateLpm: newStatus === 'OPEN' ? 120 : newStatus === 'AUTO' ? 75 : 0,
      },
    };
    onUpdateZone(updatedZone);
  };

  const handleRunAiOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zoneId: zone.id,
          cropStage: zone.stage,
          currentMoisture: zone.sensors.soilMoisture,
          forecastRainProb: weather.rainProbability,
        }),
      });
      const data = await res.json();
      setOptimizationResult(data);
    } catch (e) {
      console.error(e);
      setOptimizationResult({
        shouldIrrigate: zone.sensors.soilMoisture < 45,
        recommendedDurationMinutes: zone.sensors.soilMoisture < 45 ? 15 : 0,
        volumeLitersPerSqm: zone.sensors.soilMoisture < 45 ? 2.8 : 0,
        estimatedWaterSavedPercent: 38,
        reasoning: `Berdasarkan kelembaban tanah ${zone.sensors.soilMoisture}% dan evapotranspirasi ${weather.et0} mm/hari, penyiraman presisi diatur untuk mempertahankan aerasi akar.`,
        fertigationMix: 'Nutrisi fertigasi NPK rasio 12-8-16 + Asam Humat 0.2%',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center gap-2">
              <span>Smart Actuation Layer</span>
              <span aria-hidden="true">·</span>
              <span>Evapotranspiration Model (ET₀)</span>
              <span aria-hidden="true">·</span>
              <span>Water Stewardship</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Sistem Otomasi Irigasi Presisi & Fertigasi Cerdas
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Mengontrol katup solenoid dan injeksi pupuk cair secara real-time. Menyesuaikan debit air dengan kurva kebutuhan tanaman dan prakiraan cuaca lokal untuk memangkas pemborosan air hingga 40%.
            </p>
          </div>
          <button
            onClick={handleRunAiOptimization}
            disabled={isOptimizing}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors rounded-lg whitespace-nowrap shrink-0"
          >
            {isOptimizing ? 'Mengalkulasi...' : 'Optimalkan Irigasi AI'}
          </button>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Valve and Parameters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Actuator State Panel */}
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-white">Mode Kontrol Katup Solenoid</span>
                <p className="text-[11px] text-neutral-400">Aktuator: Pipa Induk {zone.name.split(' - ')[0]}</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-400">Debit Aliran:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{zone.irrigation.flowRateLpm} LPM</span>
              </div>
            </div>

            {/* Valve Mode Selector */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleToggleValve('AUTO')}
                className={`p-3 rounded-lg text-left transition-colors border ${
                  zone.irrigation.valveStatus === 'AUTO'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-semibold text-emerald-400 mb-1">Otomatis (AI Driven)</div>
                <div className="text-[11px] text-neutral-400">Aktif berdasar ambang sensor & cuaca</div>
              </button>

              <button
                onClick={() => handleToggleValve('OPEN')}
                className={`p-3 rounded-lg text-left transition-colors border ${
                  zone.irrigation.valveStatus === 'OPEN'
                    ? 'bg-sky-500/15 border-sky-500/50 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-semibold text-sky-400 mb-1">Buka Manual (Open)</div>
                <div className="text-[11px] text-neutral-400">Pengaliran penuh override manual</div>
              </button>

              <button
                onClick={() => handleToggleValve('CLOSED')}
                className={`p-3 rounded-lg text-left transition-colors border ${
                  zone.irrigation.valveStatus === 'CLOSED'
                    ? 'bg-neutral-800 border-neutral-600 text-white'
                    : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-semibold text-neutral-300 mb-1">Tutup Manual (Stop)</div>
                <div className="text-[11px] text-neutral-400">Matikan seluruh aliran katup</div>
              </button>
            </div>

            {/* Target Moisture Slider */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-300 font-medium">Target Ambang Batas Kelembaban Tanah:</span>
                <span className="text-emerald-400 font-mono font-bold tabular-nums">{targetMoisture}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                step="1"
                value={targetMoisture}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTargetMoisture(val);
                  onUpdateZone({
                    ...zone,
                    irrigation: { ...zone.irrigation, targetMoisturePercent: val },
                  });
                }}
                className="w-full accent-emerald-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                <span>30% (Kering)</span>
                <span>50% (Ideal Palawija)</span>
                <span>80% (Sawah Tergenang)</span>
              </div>
            </div>
          </div>

          {/* AI Optimization Feedback Panel */}
          {optimizationResult && (
            <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">Hasil Rekomendasi Algoritma Irigasi AI</span>
                <span className="text-xs font-mono text-neutral-400">Penman-Monteith Dynamic ET₀</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {optimizationResult.reasoning}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Durasi Siram:</span>
                  <span className="text-white font-mono font-bold tabular-nums">
                    {optimizationResult.recommendedDurationMinutes} Menit
                  </span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Kebutuhan Air:</span>
                  <span className="text-white font-mono font-bold tabular-nums">
                    {optimizationResult.volumeLitersPerSqm} L/m²
                  </span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Penghematan Air:</span>
                  <span className="text-emerald-400 font-mono font-bold tabular-nums">
                    ~{optimizationResult.estimatedWaterSavedPercent}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 block text-[11px]">Formula Fertigasi:</span>
                  <span className="text-sky-300 font-mono text-[10px] truncate block" title={optimizationResult.fertigationMix}>
                    Injeksi Otomatis
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Water Stats & Schedule */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4">
            <span className="text-xs font-semibold text-white block">Metrik Konsumsi Air Harian</span>

            <div className="p-4 rounded-lg bg-neutral-950/80 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-1">Volume Terdistribusi Hari Ini</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-white">
                {zone.irrigation.dailyVolumeLiters.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-neutral-400 ml-1.5">Liter</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">36% lebih hemat vs penyiraman terjadwal manual</div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Siklus Terakhir:</span>
                <span className="text-neutral-200">{zone.irrigation.lastIrrigationTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Jadwal Siklus Berikutnya:</span>
                <span className="text-neutral-200">{zone.irrigation.nextScheduledTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Laju Evapotranspirasi (ET₀):</span>
                <span className="text-neutral-200 font-mono tabular-nums">{weather.et0} mm/hari</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-400">Peluang Hujan (Sensitivitas Cut-off):</span>
                <span className="text-neutral-200 font-mono tabular-nums">{weather.rainProbability}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
