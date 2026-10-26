import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ZoneSelector } from './components/ZoneSelector';
import { TelemetryGrid } from './components/TelemetryGrid';
import { DiseaseDiagnosticLab } from './components/DiseaseDiagnosticLab';
import { IrrigationController } from './components/IrrigationController';
import { DroneNdviViewer } from './components/DroneNdviViewer';
import { AgronomistChat } from './components/AgronomistChat';
import { WeatherForecastWidget } from './components/WeatherForecastWidget';
import { KnowledgeSection } from './components/KnowledgeSection';
import { INITIAL_ZONES, WEATHER_FORECAST } from './data/mockFarmData';
import { FarmZone } from './types/farm';

export default function App() {
  const [zones, setZones] = useState<FarmZone[]>(INITIAL_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('zone-a');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const todayWeather = WEATHER_FORECAST[0];

  // IoT sensor live stream simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((z) => {
          // slight natural jitter in sensor values
          const moistureDelta = (Math.random() - 0.5) * 0.4;
          const tempDelta = (Math.random() - 0.5) * 0.15;
          const vpdDelta = (Math.random() - 0.5) * 0.02;

          const newMoisture = Math.max(25, Math.min(85, +(z.sensors.soilMoisture + moistureDelta).toFixed(1)));
          const newSoilTemp = +(z.sensors.soilTemp + tempDelta).toFixed(1);
          const newVpd = +(z.sensors.vpd + vpdDelta).toFixed(2);

          return {
            ...z,
            sensors: {
              ...z.sensors,
              soilMoisture: newMoisture,
              soilTemp: newSoilTemp,
              vpd: newVpd,
            },
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleUpdateZone = (updatedZone: FarmZone) => {
    setZones((prev) => prev.map((z) => (z.id === updatedZone.id ? updatedZone : z)));
  };

  const handleTriggerQuickIrrigation = () => {
    handleUpdateZone({
      ...selectedZone,
      irrigation: {
        ...selectedZone.irrigation,
        valveStatus: 'OPEN',
        flowRateLpm: 120,
      },
    });
    setActiveTab('irrigation');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKnowledge={() => setShowKnowledgeModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Farm Zone Selector & Telemetry Simulator Toggle */}
        <ZoneSelector
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={(zone) => setSelectedZoneId(zone.id)}
          isSimulating={isSimulating}
          onToggleSimulate={() => setIsSimulating(!isSimulating)}
        />

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Agricultural Snapshot */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* Left Narrative */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                      <span>{selectedZone.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedZone.crop}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedZone.areaHectares} Hektar Terpantau</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {selectedZone.name}
                    </h1>
                    <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                      Pemantauan agronomi berbasis AI, sensorik tanah beresolusi tinggi, irigasi adaptif, dan proteksi tanaman presisi untuk memaksimalkan hasil panen dan efisiensi sumber daya.
                    </p>
                  </div>

                  {/* Key Cycle Metadata Strip */}
                  <div className="grid grid-cols-3 gap-3 pt-6 mt-4 border-t border-neutral-800/80 text-xs">
                    <div>
                      <div className="text-[11px] text-neutral-500">Fase Tanaman</div>
                      <div className="text-neutral-200 font-medium truncate">{selectedZone.stage}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-500">Estimasi Panen</div>
                      <div className="text-neutral-200 font-medium truncate">{selectedZone.harvestTarget}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-neutral-500">Indeks Vigor Kanopi</div>
                      <div className="text-emerald-400 font-mono font-bold tabular-nums">
                        {selectedZone.ndviStats.averageNdvi} NDVI
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Aerial Photography Visual */}
                <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full">
                  <img
                    src={selectedZone.image}
                    alt={selectedZone.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent lg:hidden"></div>
                </div>
              </div>
            </div>

            {/* IoT Real-time Telemetry Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">
                  Telemetri Sensorik Lapangan (Real-time IoT)
                </h2>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>Protokol: LoRaWAN / NB-IoT</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-emerald-400">Pembaruan 3.5s</span>
                </div>
              </div>
              <TelemetryGrid
                zone={selectedZone}
                onTriggerQuickIrrigation={handleTriggerQuickIrrigation}
              />
            </div>

            {/* Weather & Evapotranspiration Forecast */}
            <WeatherForecastWidget forecast={WEATHER_FORECAST} />

            {/* Quick Navigation Cards to specialized AI modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('diagnosis')}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left hover:border-emerald-500/50 transition-colors group"
              >
                <div className="text-emerald-400 text-xs font-semibold mb-1">Computer Vision</div>
                <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Laboratorium Diagnosa Daun AI →
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Pindai lesi jamur, klorosis, dan hawar daun menggunakan model multimodal Gemini 3.8 Flash.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('irrigation')}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left hover:border-emerald-500/50 transition-colors group"
              >
                <div className="text-sky-400 text-xs font-semibold mb-1">Precision Actuation</div>
                <div className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  Irigasi Presisi & Fertigasi →
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Kalkulasi kebutuhan air dinamis (ET₀) dan otomatisasi katup solenoid hemat air hingga 40%.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('drone')}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left hover:border-emerald-500/50 transition-colors group"
              >
                <div className="text-amber-400 text-xs font-semibold mb-1">Multispectral UAV</div>
                <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Inspeksi Kanopi Drone NDVI →
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Tinjau peta kerapatan vegetasi, variasi biomassa, dan deteksi dini stres perakaran di seluruh hamparan.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: AI Leaf Disease Diagnostic Lab */}
        {activeTab === 'diagnosis' && (
          <DiseaseDiagnosticLab selectedZone={selectedZone} />
        )}

        {/* Tab 3: Precision Irrigation & Fertigation */}
        {activeTab === 'irrigation' && (
          <IrrigationController
            zone={selectedZone}
            weather={todayWeather}
            onUpdateZone={handleUpdateZone}
          />
        )}

        {/* Tab 4: Drone Multispectral NDVI */}
        {activeTab === 'drone' && (
          <DroneNdviViewer zone={selectedZone} />
        )}

        {/* Tab 5: AI Agronomist Consultation */}
        {activeTab === 'agronomist' && (
          <AgronomistChat selectedZone={selectedZone} weather={todayWeather} />
        )}
      </main>

      {/* Knowledge Base Modal */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <KnowledgeSection onClose={() => setShowKnowledgeModal(false)} isModal={true} />
          </div>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-neutral-800 mt-12 py-6 text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>AgriPulse · AI-Powered Smart Farm Management Platform</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowKnowledgeModal(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Arsitektur & Pilar Smart Farm
            </button>
            <span>·</span>
            <span>Precision Agriculture 5.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
