import React, { useState, useEffect, useRef } from 'react';
import { FarmZone, WeatherDay, ChatMessage } from '../types/farm';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../utils/storage';
import { PT_AGRICOLE_LOCATION, normalizeFarmZone } from '../data/mockFarmData';

interface AgronomistChatProps {
  selectedZone: FarmZone;
  weather: WeatherDay;
}

export const AgronomistChat: React.FC<AgronomistChatProps> = ({ selectedZone, weather }) => {
  const safeZone = normalizeFarmZone(selectedZone);

  const defaultWelcomeMessage: ChatMessage = {
    id: 'welcome-01',
    role: 'model',
    text: `Halo! Saya AgriPulse AI, Kepala Agronom & Konsultan Pertanian Presisi untuk kebun PT Agricole Indonesia Makmur (Koordinat: -6.753266, 107.017472, Cipanas, Cianjur).

Saya terhubung langsung ke gateway telemetri LoRaWAN (${safeZone.telemetryNetwork.gatewayId}) dan sensor zona aktif ${safeZone.name}:
- Kelembaban Tanah: ${safeZone.sensors.soilMoisture}% (Target: ${safeZone.irrigation.targetMoisturePercent}%)
- Suhu Perakaran: ${safeZone.sensors.soilTemp}°C | Suhu Udara: ${safeZone.sensors.ambientTemp}°C
- pH Tanah: ${safeZone.sensors.soilPh} | VPD: ${safeZone.sensors.vpd} kPa
- Hara N-P-K: ${safeZone.sensors.nitrogen}-${safeZone.sensors.phosphorus}-${safeZone.sensors.potassium} mg/kg
- Sinyal LoRa: ${safeZone.telemetryNetwork.rssiDbm} dBm (Optimal)

Anda juga dapat mengaktifkan mode Google Search Grounding untuk cek harga pasar live, atau Google Maps Grounding untuk fasilitas sarana tani terdekat. Apa yang ingin Anda diskusikan hari ini?`,
    timestamp: '08:00 WIB',
    groundingType: 'standard',
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return getStoredItem<ChatMessage[]>(STORAGE_KEYS.AGRONOMIST_MESSAGES, [defaultWelcomeMessage]);
  });

  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groundingMode, setGroundingMode] = useState<'standard' | 'search' | 'maps'>('standard');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to local storage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.AGRONOMIST_MESSAGES, messages);
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const quickPrompts = [
    `Analisis kelembaban ${safeZone.sensors.soilMoisture}% tanah di iklim sejuk Cipanas untuk ${safeZone.crop}`,
    `Rekomendasi rasio pupuk susulan NPK berdasar data sensor saat ini`,
    `Cek harga pasar terkini komoditas ${safeZone.crop.split(' ')[0]} di Jawa Barat`,
    `Toko distributor pupuk resmi dan saprotan terdekat dari kebun PT Agricole`,
  ];

  const handleClearHistory = () => {
    const freshWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'model',
      text: `Riwayat percakapan telah dibersihkan. Saya siap membantu operasional agrikultur kebun PT Agricole Indonesia Makmur (-6.753266, 107.017472).`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      groundingType: 'standard',
    };
    setMessages([freshWelcome]);
  };

  const handleSendMessage = async (textToSend?: string, forcedMode?: 'standard' | 'search' | 'maps') => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isSubmitting) return;

    const currentMode = forcedMode || groundingMode;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      groundingType: currentMode,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsSubmitting(true);

    try {
      const farmContext = {
        company: safeZone.location?.companyName || PT_AGRICOLE_LOCATION.companyName,
        coordinates: safeZone.location?.coordinates || PT_AGRICOLE_LOCATION.coordinates,
        zoneName: safeZone.name,
        crop: safeZone.crop,
        stage: safeZone.stage,
        soilMoisture: safeZone.sensors.soilMoisture,
        targetMoisture: safeZone.irrigation.targetMoisturePercent,
        soilTemp: safeZone.sensors.soilTemp,
        soilPh: safeZone.sensors.soilPh,
        nitrogen: safeZone.sensors.nitrogen,
        phosphorus: safeZone.sensors.phosphorus,
        potassium: safeZone.sensors.potassium,
        ambientTemp: safeZone.sensors.ambientTemp,
        ambientHumidity: safeZone.sensors.ambientHumidity,
        vpd: safeZone.sensors.vpd,
        solarRadiation: safeZone.sensors.solarRadiation,
        valveStatus: safeZone.irrigation.valveStatus,
        flowRate: safeZone.irrigation.flowRateLpm,
        telemetryProtocol: safeZone.telemetryNetwork?.protocol || 'LoRaWAN AS923',
        weather: `${weather.condition}, Suhu ${weather.tempMax}°C, Peluang Hujan ${weather.rainProbability}%`,
      };

      const res = await fetch('/api/chat-multiturn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: newHistory.slice(-10), // pass recent multi-turn context
          message: prompt,
          farmContext,
          groundingMode: currentMode,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: data.timestamp || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        groundingType: data.groundingType,
        groundingSources: data.sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: `Berdasarkan data telemetri LoRaWAN di kebun PT Agricole Indonesia Makmur:\n\n1. **Kondisi Sensor**: Kelembaban tanah saat ini ${selectedZone.sensors.soilMoisture}% dengan pH ${selectedZone.sensors.soilPh}. Di iklim sejuk Cipanas (elevasi 1.085 mdpl), laju evapotranspirasi berkisar 3.2 - 4.2 mm/hari.\n2. **Rekomendasi**: Pertahankan jadwal pengairan otomatis saat VPD kanopi berada di atas 1.2 kPa untuk menjaga turgor daun optimal.\n3. **Catatan Cuaca**: Peluang hujan sore ${weather.rainProbability}%, irigasi dapat ditunda jika curah hujan melebihi 10 mm.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        groundingType: 'standard',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <span>Gemini 3.8 Flash Chatbot</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Turn Memory</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono">LoRaWAN AS923 Connected</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              AI Agronomist Chatbot — PT Agricole Indonesia Makmur
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Asisten agronomist berbasis model Gemini dengan riwayat obrolan berkelanjutan (multi-turn), didukung grounding pencarian Google Search (harga pasar) dan Google Maps (geospasial sekitar kebun).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleClearHistory}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 px-2.5 py-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors"
              title="Bersihkan riwayat percakapan"
            >
              Reset Chat
            </button>
            <div className="text-xs text-neutral-400 font-mono bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
              Lokasi: -6.753266, 107.017472
            </div>
          </div>
        </div>

        {/* Mode Grounding Selector Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400 text-[11px]">Mode Grounding:</span>
          <button
            onClick={() => setGroundingMode('standard')}
            className={`px-2.5 py-1 rounded transition-colors ${
              groundingMode === 'standard'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            🌱 Standar Agronomi IoT
          </button>
          <button
            onClick={() => setGroundingMode('search')}
            className={`px-2.5 py-1 rounded transition-colors ${
              groundingMode === 'search'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            🔍 Google Search Grounding (Harga Pasar Live)
          </button>
          <button
            onClick={() => setGroundingMode('maps')}
            className={`px-2.5 py-1 rounded transition-colors ${
              groundingMode === 'maps'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            📍 Google Maps Grounding (Fasilitas Sekitar Cianjur)
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col h-[540px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-neutral-500 mb-1 px-1 flex items-center gap-1.5">
                <span>{msg.role === 'user' ? 'Anda' : 'AgriPulse AI (PT Agricole)'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
                {msg.groundingType === 'search' && (
                  <span className="text-sky-400 bg-sky-950/60 px-1 py-0.2 rounded text-[9px] font-mono">
                    Search Grounded
                  </span>
                )}
                {msg.groundingType === 'maps' && (
                  <span className="text-amber-400 bg-amber-950/60 px-1 py-0.2 rounded text-[9px] font-mono">
                    Maps Grounded
                  </span>
                )}
              </div>
              <div
                className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-bl-xs'
                }`}
              >
                {msg.text}

                {/* Grounding Sources (if available from Google Search) */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] space-y-1">
                    <div className="text-neutral-400 font-semibold">Sumber Rujukan Web:</div>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingSources.map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
                        >
                          <span>{source.title}</span>
                          <span className="text-[9px]">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isSubmitting && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span>
                {groundingMode === 'search'
                  ? 'AI sedang mencari data harga & pasar live di Google Search...'
                  : groundingMode === 'maps'
                  ? 'AI sedang mencari data lokasi terdekat di Google Maps...'
                  : 'AI sedang menganalisis telemetri kebun PT Agricole...'}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-neutral-800/80 bg-neutral-950/60 overflow-x-auto flex items-center gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                const mode = q.includes('harga') ? 'search' : q.includes('terdekat') ? 'maps' : 'standard';
                setGroundingMode(mode);
                handleSendMessage(q, mode);
              }}
              disabled={isSubmitting}
              className="px-2.5 py-1 text-[11px] bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 rounded border border-neutral-700/60 whitespace-nowrap shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-neutral-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={
              groundingMode === 'search'
                ? 'Tanyakan harga pasar live atau tren komoditas di Google Search...'
                : groundingMode === 'maps'
                ? 'Tanyakan kios pupuk atau distributor terdekat di Google Maps...'
                : 'Konsultasikan nutrisi tanaman, irigasi presisi, atau hama kebun PT Agricole...'
            }
            className="flex-1 px-4 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSubmitting || !inputText.trim()}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
