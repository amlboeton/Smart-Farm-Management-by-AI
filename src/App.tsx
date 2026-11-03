import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { ZoneSelector } from './components/ZoneSelector';
import { TelemetryGrid } from './components/TelemetryGrid';
import { DiseaseDiagnosticLab } from './components/DiseaseDiagnosticLab';
import { IrrigationController } from './components/IrrigationController';
import { DroneNdviViewer } from './components/DroneNdviViewer';
import { AgronomistChat } from './components/AgronomistChat';
import { WeatherForecastWidget } from './components/WeatherForecastWidget';
import { FieldGeospatialMap } from './components/FieldGeospatialMap';
import { KnowledgeSection } from './components/KnowledgeSection';
import { GoogleDriveSyncBanner } from './components/GoogleDriveSyncBanner';
import { DriveExportModal } from './components/DriveExportModal';
import { INITIAL_ZONES, WEATHER_FORECAST, PT_AGRICOLE_LOCATION, normalizeFarmZone } from './data/mockFarmData';
import { FarmZone } from './types/farm';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from './utils/storage';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { syncReportToGoogleDrive, UploadResult, GOOGLE_DRIVE_FOLDER_URL } from './services/googleDriveService';
import { generateMonthlyReport, generateDailyReport } from './utils/reportAggregator';

export default function App() {
  const [zones, setZones] = useState<FarmZone[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('agripulse_zones_v1');
        localStorage.removeItem('agripulse_zones_v2');
        localStorage.removeItem('agripulse_selected_zone_id_v1');
        localStorage.removeItem('agripulse_selected_zone_id_v2');
      } catch {}
    }
    const raw = getStoredItem<FarmZone[]>(STORAGE_KEYS.ZONES, INITIAL_ZONES);
    const sanitized = (Array.isArray(raw) ? raw : INITIAL_ZONES)
      .filter((z) => z && z.id !== 'zone-c' && !z.crop?.toLowerCase().includes('kopi') && !z.name?.toLowerCase().includes('kopi'))
      .map(normalizeFarmZone);
    return sanitized.length > 0 ? sanitized : INITIAL_ZONES.map(normalizeFarmZone);
  });

  const [selectedZoneId, setSelectedZoneId] = useState<string>(() => {
    const raw = getStoredItem<string>(STORAGE_KEYS.SELECTED_ZONE_ID, 'zone-a');
    return raw === 'zone-c' ? 'zone-a' : raw;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return getStoredItem<string>(STORAGE_KEYS.ACTIVE_TAB, 'dashboard');
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Google Drive & Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync zones and preferences to local storage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ZONES, zones);
  }, [zones]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.SELECTED_ZONE_ID, selectedZoneId);
  }, [selectedZoneId]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const rawSelectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0] || INITIAL_ZONES[0];
  const selectedZone = normalizeFarmZone(rawSelectedZone);
  const todayWeather = WEATHER_FORECAST[0];

  // IoT sensor live stream simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((z) => {
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

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (e: any) {
      console.error('Login error:', e);
      alert('Gagal menghubungkan akun Google. Pastikan jendela pop-up diizinkan.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
  };

  const handleQuickSyncToDrive = async () => {
    if (!accessToken) {
      await handleLogin();
      return;
    }

    const confirmed = window.confirm(
      `Kirim ringkasan presentasi terbaru untuk ${selectedZone.name} ke folder Google Drive 1P62-KOsYtJA...?`
    );
    if (!confirmed) return;

    setIsSyncing(true);
    try {
      // Generate presentation-ready reports
      const monthlyReport = generateMonthlyReport(selectedZone);
      const dailyReport = generateDailyReport(selectedZone);

      const resMonthly = await syncReportToGoogleDrive(monthlyReport, accessToken);
      await syncReportToGoogleDrive(dailyReport, accessToken);

      const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      setLastSyncTime(timeNow);
      if (resMonthly.spreadsheetUrl) {
        setLastUploadedUrl(resMonthly.spreadsheetUrl);
      }
      alert(`Berhasil tersinkronisasi ke Google Drive!\nSpreadsheet disimpan pada subfolder "${resMonthly.folderName}".`);
    } catch (err: any) {
      console.error('Sync failed:', err);
      alert(`Gagal menyinkronkan ke Google Drive: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadSuccess = (res: UploadResult) => {
    setLastSyncTime(res.uploadedAt + ' WIB');
    if (res.spreadsheetUrl) {
      setLastUploadedUrl(res.spreadsheetUrl);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKnowledge={() => setShowKnowledgeModal(true)}
      />

      {/* Google Drive Cloud Storage Banner (replaces local storage indicator) */}
      <GoogleDriveSyncBanner
        user={user}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenExportModal={() => setShowExportModal(true)}
        onQuickSync={handleQuickSyncToDrive}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        lastUploadedUrl={lastUploadedUrl}
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

            {/* IoT Real-time Telemetry Grid with PT Agricole Station Banner */}
            <div className="space-y-3">
              {/* PT Agricole Base Station & Protocol Status */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-mono text-sm font-bold">
                    IoT
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="text-emerald-400 font-semibold">{selectedZone?.location?.companyName || PT_AGRICOLE_LOCATION.companyName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-neutral-300">
                        GPS: {(selectedZone?.location?.coordinates?.lat ?? PT_AGRICOLE_LOCATION.coordinates.lat).toFixed(6)}, {(selectedZone?.location?.coordinates?.lng ?? PT_AGRICOLE_LOCATION.coordinates.lng).toFixed(6)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Elevasi {selectedZone?.location?.altitudeMeters ?? PT_AGRICOLE_LOCATION.altitudeMeters} mdpl</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                      <span>Stasiun Telemetri: {selectedZone?.telemetryNetwork?.gatewayId || 'GW-AGRICOLE-01'}</span>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Protokol: {selectedZone?.telemetryNetwork?.protocol || 'LoRaWAN AS923'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('geospatial')}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-neutral-950 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>🛰️ Buka Peta & Satelit</span>
                    <span className="text-[10px]">→</span>
                  </button>
                  <a
                    href={`https://www.google.com/maps?q=${selectedZone?.location?.coordinates?.lat ?? PT_AGRICOLE_LOCATION.coordinates.lat},${selectedZone?.location?.coordinates?.lng ?? PT_AGRICOLE_LOCATION.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-colors flex items-center gap-1"
                  >
                    <span>📍 Google Maps</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white tracking-tight uppercase tracking-wider">
                  Telemetri Sensorik Lapangan (Real-time IoT)
                </h2>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>Sinyal: {selectedZone?.telemetryNetwork?.rssiDbm ?? -78} dBm / {selectedZone?.telemetryNetwork?.snrDb ?? 9.4} dB</span>
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

            {/* Presentation Export & Specialized AI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-left hover:border-emerald-400 transition-colors group"
              >
                <div className="text-emerald-400 text-xs font-semibold mb-1">Google Drive Export</div>
                <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Bahan Presentasi →
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Ekspor otomatis laporan Harian, Mingguan, & Bulanan ke folder Google Drive Anda.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('geospatial')}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left hover:border-emerald-500/50 transition-colors group"
              >
                <div className="text-emerald-400 text-xs font-semibold mb-1">Geospasial & LoRaWAN</div>
                <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Peta Kebun & Node IoT →
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Pantau koordinat PT Agricole (-6.753266, 107.017472), satelit, dan Google Grounding terdekat.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('diagnosis')}
                className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 text-left hover:border-emerald-500/50 transition-colors group"
              >
                <div className="text-emerald-400 text-xs font-semibold mb-1">Computer Vision</div>
                <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Diagnosa Daun AI →
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
                  Irigasi & Fertigasi →
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
                  Drone NDVI Kanopi →
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Tinjau peta kerapatan vegetasi, variasi biomassa, dan deteksi dini stres perakaran tanaman.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab: Geospatial Map & IoT Field Telemetry (PT Agricole) */}
        {activeTab === 'geospatial' && (
          <FieldGeospatialMap selectedZone={selectedZone} />
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

      {/* Drive Export Presentation Modal */}
      <DriveExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        selectedZone={selectedZone}
        accessToken={accessToken}
        onLoginRequest={handleLogin}
        onUploadSuccess={handleUploadSuccess}
      />

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
            <a
              href={GOOGLE_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              Folder Google Drive (1P62-KOsYtJA...) ↗
            </a>
            <span>·</span>
            <button
              onClick={() => setShowKnowledgeModal(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Arsitektur & Pilar Smart Farm
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
