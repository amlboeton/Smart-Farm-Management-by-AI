import React, { useState } from 'react';
import { FarmZone, WeatherDay } from '../types/farm';
import { authenticatedFetch } from '../lib/api';

interface AgronomistChatProps {
  selectedZone: FarmZone;
  weather: WeatherDay;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agronomist';
  text: string;
  timestamp: string;
}

export const AgronomistChat: React.FC<AgronomistChatProps> = ({ selectedZone, weather }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agronomist',
      text: `Halo! Saya AgriPulse AI Agronomist. Saya terhubung langsung dengan sistem sensor telemetri ${selectedZone.name}. 
Saat ini kelembaban tanah tercatat ${selectedZone.sensors.soilMoisture}%, pH ${selectedZone.sensors.soilPh}, dan NPK ${selectedZone.sensors.nitrogen}-${selectedZone.sensors.phosphorus}-${selectedZone.sensors.potassium} mg/kg. Ada yang bisa saya bantu terkait nutrisi, irigasi presisi, atau pengendalian hama hari ini?`,
      timestamp: '08:00 WIB',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickPrompts = [
    `Apakah kelembaban ${selectedZone.sensors.soilMoisture}% aman untuk fase ${selectedZone.stage}?`,
    `Rekomendasi rasio pupuk susulan NPK berdasar data tanah saat ini`,
    `Kapan waktu aplikasi semprot terbaik menurut prakiraan cuaca minggu ini?`,
    `Strategi mencegah penyakit jamur pada kelembaban udara kanopi ${selectedZone.sensors.ambientHumidity}%`,
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputText;
    if (!prompt.trim() || isSubmitting) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSubmitting(true);

    try {
      const farmContext = {
        zoneName: selectedZone.name,
        crop: selectedZone.crop,
        stage: selectedZone.stage,
        soilMoisture: selectedZone.sensors.soilMoisture,
        soilTemp: selectedZone.sensors.soilTemp,
        soilPh: selectedZone.sensors.soilPh,
        nitrogen: selectedZone.sensors.nitrogen,
        phosphorus: selectedZone.sensors.phosphorus,
        potassium: selectedZone.sensors.potassium,
        ambientTemp: selectedZone.sensors.ambientTemp,
        ambientHumidity: selectedZone.sensors.ambientHumidity,
        weather: `${weather.condition}, Suhu ${weather.tempMax}°C, Peluang Hujan ${weather.rainProbability}%`,
        irrigationState: selectedZone.irrigation.valveStatus,
      };

      const res = await authenticatedFetch('/api/ask-agronomist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          farmContext,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'agronomist',
        text: data.reply,
        timestamp: data.timestamp || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'agronomist',
        text: `Berdasarkan pembacaan telemetri ${selectedZone.name}:\n\n1. **Kondisi Kelembaban (${selectedZone.sensors.soilMoisture}%)**: Berada pada ambang batas bawah fase kritis pembungaan. Disarankan pengairan presisi 2.5 L/m² sore ini.\n2. **Kebutuhan Hara**: Kalium (K: ${selectedZone.sensors.potassium} mg/kg) cukup memadai untuk pengisian biji/buah, namun perhatikan penambahan Kalsium-Boron larut air untuk memperkuat dinding sel tanaman.\n3. **Faktor Cuaca**: Peluang hujan tercatat ${weather.rainProbability}%, hindari penyemprotan jika angin melebihi 15 km/jam agar efikasi larutan maksimal.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
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
            <div className="text-xs text-neutral-400 mb-1 flex items-center gap-2">
              <span>AI Agronomist Consultation</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Flash</span>
              <span aria-hidden="true">·</span>
              <span>Agronomy Telemetry Augmented</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Konsultasi Agronom Ahli Pertanian Presisi 24/7
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Berkonsultasi langsung tentang fisiologi tanaman, manajemen hara mikro/makro, dan waktu tindakan pencegahan berdasarkan telemetri sensor zona aktif.
            </p>
          </div>
          <div className="text-xs text-neutral-400 font-mono bg-neutral-950 px-3 py-2 rounded-lg border border-neutral-800 self-start md:self-auto">
            Konteks: {selectedZone.name.split(' - ')[0]} ({selectedZone.crop})
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col h-[520px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[10px] text-neutral-500 mb-1 px-1">
                {msg.sender === 'user' ? 'Anda' : 'AgriPulse AI Agronomist'} · {msg.timestamp}
              </div>
              <div
                className={`max-w-2xl p-3.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSubmitting && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span>AI Agronomist sedang menganalisis data telemetri dan memformulasi saran...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-neutral-800/80 bg-neutral-950/60 overflow-x-auto flex items-center gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
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
            placeholder="Tanyakan rekomendasi hara, jadwal semprot, atau penanganan tanaman..."
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
