import React from 'react';
import { FarmZone } from '../types/farm';

interface TelemetryGridProps {
  zone: FarmZone;
  onTriggerQuickIrrigation?: () => void;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ zone, onTriggerQuickIrrigation }) => {
  const { sensors, irrigation } = zone;

  const moistureStatus =
    sensors.soilMoisture < 40
      ? { label: 'Di Bawah Ambang Kritis', textClass: 'text-amber-400' }
      : sensors.soilMoisture > 75
      ? { label: 'Kelembaban Jenuh', textClass: 'text-sky-400' }
      : { label: 'Optimal Terkendali', textClass: 'text-emerald-400' };

  const phStatus =
    sensors.soilPh < 6.0
      ? { label: 'Cenderung Asam', textClass: 'text-amber-400' }
      : sensors.soilPh > 7.2
      ? { label: 'Cenderung Basa', textClass: 'text-amber-400' }
      : { label: 'pH Seimbang', textClass: 'text-emerald-400' };

  const vpdStatus =
    sensors.vpd < 0.5
      ? { label: 'Risiko Jamur Tinggi (Transpirasi Lambat)', textClass: 'text-amber-400' }
      : sensors.vpd > 1.4
      ? { label: 'Stres Air / Penguapan Tinggi', textClass: 'text-amber-400' }
      : { label: 'Transpirasi Ideal', textClass: 'text-emerald-400' };

  return (
    <div className="space-y-4">
      {/* Active Alert Banner if moisture is low */}
      {sensors.soilMoisture < 40 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <span className="font-semibold">Peringatan Sensor Kelembaban:</span>
            <span>
              Kadar air tanah di {zone.name.split(' - ')[0]} tercatat {sensors.soilMoisture}% (di bawah target {irrigation.targetMoisturePercent}%).
            </span>
          </div>
          {onTriggerQuickIrrigation && (
            <button
              onClick={onTriggerQuickIrrigation}
              className="px-3 py-1 bg-amber-500 text-neutral-950 font-semibold rounded hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              Aktifkan Siklus Irigasi Presisi
            </button>
          )}
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Soil Moisture */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
              <span>Kelembaban Tanah Volumetrik</span>
              <span className="text-[11px] font-mono text-neutral-500">Target: {irrigation.targetMoisturePercent}%</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white my-1">
              {sensors.soilMoisture}
              <span className="text-base text-neutral-400 font-normal ml-1">%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800 text-[11px] flex items-center justify-between">
            <span className={moistureStatus.textClass}>{moistureStatus.label}</span>
            <span className="text-neutral-500">Ambang: 40-65%</span>
          </div>
        </div>

        {/* Soil Temperature & Ambient Temp */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
              <span>Suhu Tanah & Udara</span>
              <span className="text-[11px] font-mono text-neutral-500">Udara: {sensors.ambientTemp}°C</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white my-1">
              {sensors.soilTemp.toFixed(1)}
              <span className="text-base text-neutral-400 font-normal ml-1">°C</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800 text-[11px] flex items-center justify-between">
            <span className="text-emerald-400">Termal Perakaran Nominal</span>
            <span className="text-neutral-500">Ideal: 20-28°C</span>
          </div>
        </div>

        {/* Soil pH Level */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
              <span>Derajat Keasaman Tanah (pH)</span>
              <span className="text-[11px] font-mono text-neutral-500">Sensor Ion-ISFET</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white my-1">
              {sensors.soilPh.toFixed(1)}
              <span className="text-base text-neutral-400 font-normal ml-1">pH</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800 text-[11px] flex items-center justify-between">
            <span className={phStatus.textClass}>{phStatus.label}</span>
            <span className="text-neutral-500">Ideal: 6.0-6.8</span>
          </div>
        </div>

        {/* VPD (Vapor Pressure Deficit) */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs text-neutral-400 mb-1 flex items-center justify-between">
              <span>Vapor Pressure Deficit (VPD)</span>
              <span className="text-[11px] font-mono text-neutral-500">RH: {sensors.ambientHumidity}%</span>
            </div>
            <div className="text-3xl font-bold font-mono tabular-nums text-white my-1">
              {sensors.vpd.toFixed(2)}
              <span className="text-base text-neutral-400 font-normal ml-1">kPa</span>
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800 text-[11px] flex items-center justify-between">
            <span className={vpdStatus.textClass}>{vpdStatus.label}</span>
            <span className="text-neutral-500">Ideal: 0.8-1.2</span>
          </div>
        </div>
      </div>

      {/* Secondary Telemetry: NPK Macronutrients & Solar Radiation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NPK Breakdown */}
        <div className="md:col-span-2 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-white">Status Hara Makro Tanah (NPK Sensorik)</div>
              <div className="text-[11px] text-neutral-400">Kandungan unsur hara tanah tersedia (mg/kg dry soil)</div>
            </div>
            <div className="text-[11px] font-mono text-emerald-400">Optical Spectrometry</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-0.5">Nitrogen (N)</div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                {sensors.nitrogen} <span className="text-xs font-normal text-neutral-500">mg/kg</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Pembentukan Daun & Protein</div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-0.5">Fosfor (P)</div>
              <div className="text-xl font-bold font-mono tabular-nums text-sky-400">
                {sensors.phosphorus} <span className="text-xs font-normal text-neutral-500">mg/kg</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Pengakaran & Energi ATP</div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-0.5">Kalium (K)</div>
              <div className="text-xl font-bold font-mono tabular-nums text-purple-400">
                {sensors.potassium} <span className="text-xs font-normal text-neutral-500">mg/kg</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Kekuatan Batang & Bobot Buah</div>
            </div>
          </div>
        </div>

        {/* Solar Radiation & Climate */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-white mb-1">Radiasi Sinar Matahari</div>
            <div className="text-[11px] text-neutral-400 mb-3">Fluks radiasi fotosintesis (PAR Pyranometer)</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
              {sensors.solarRadiation}
              <span className="text-xs font-normal text-neutral-400 ml-1">W/m²</span>
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Potensi Fotosintesis</span>
            <span className="text-emerald-400">Optimal Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};
