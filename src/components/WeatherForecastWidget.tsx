import React from 'react';
import { WeatherDay } from '../types/farm';

interface WeatherForecastWidgetProps {
  forecast: WeatherDay[];
}

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({ forecast }) => {
  return (
    <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-white">Prakiraan Agro-Meteorologi 7 Hari</span>
          <span className="text-[11px] text-neutral-400 block">Indeks Evapotranspirasi (ET₀) & Potensi Hujan</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">Microclimate Station #04</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {forecast.map((day, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
              idx === 0
                ? 'bg-emerald-500/10 border-emerald-500/40'
                : 'bg-neutral-950/60 border-neutral-800/80'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold ${idx === 0 ? 'text-emerald-400' : 'text-neutral-300'}`}>
                  {day.day}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">{day.windSpeedKmh} km/h</span>
              </div>
              <div className="text-[11px] text-neutral-400 truncate mb-2">{day.condition}</div>
            </div>

            <div className="pt-2 border-t border-neutral-800/80 space-y-1">
              <div className="flex justify-between font-mono tabular-nums">
                <span className="text-white font-bold">{day.tempMax}°</span>
                <span className="text-neutral-500">{day.tempMin}°</span>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Hujan:</span>
                <span className={day.rainProbability > 50 ? 'text-sky-400 font-mono font-bold' : 'font-mono'}>
                  {day.rainProbability}%
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>ET₀:</span>
                <span className="font-mono text-neutral-300">{day.et0} mm</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
