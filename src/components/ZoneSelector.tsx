import React from 'react';
import { FarmZone } from '../types/farm';

interface ZoneSelectorProps {
  zones: FarmZone[];
  selectedZone: FarmZone;
  onSelectZone: (zone: FarmZone) => void;
  isSimulating: boolean;
  onToggleSimulate: () => void;
}

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({
  zones,
  selectedZone,
  onSelectZone,
  isSimulating,
  onToggleSimulate,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
      {/* Zone Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-400 mr-1 uppercase tracking-wider">
          Zona Lahan:
        </span>
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZone.id;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-400 border border-neutral-700/60 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <span>{zone.name.split(' - ')[0]}</span>
              <span className="text-[11px] opacity-70">({zone.crop.split(' ')[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Live Simulation Controls & Metadata */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-xs text-neutral-400 hidden sm:flex items-center gap-2">
          <span>{selectedZone.areaHectares} Ha</span>
          <span aria-hidden="true">·</span>
          <span>{selectedZone.stage}</span>
        </div>

        <button
          onClick={onToggleSimulate}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 border ${
            isSimulating
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-amber-400 animate-pulse' : 'bg-neutral-500'}`}></span>
          <span>{isSimulating ? 'Simulasi Sensor Aktif' : 'Mulai Simulasi IoT'}</span>
        </button>
      </div>
    </div>
  );
};
