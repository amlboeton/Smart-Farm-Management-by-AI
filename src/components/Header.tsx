import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenKnowledge: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenKnowledge }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="text-lg font-bold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
          AgriPulse
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('diagnosis')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeTab === 'diagnosis' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Diagnosis AI
          </button>
          <button
            onClick={() => setActiveTab('irrigation')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeTab === 'irrigation' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Irigasi & Fertigasi
          </button>
          <button
            onClick={() => setActiveTab('drone')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeTab === 'drone' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Drone NDVI
          </button>
          <button
            onClick={() => setActiveTab('agronomist')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-100 ${
              activeTab === 'agronomist' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Tanya Agronom
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenKnowledge}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-md whitespace-nowrap shrink-0"
          >
            Arsitektur Smart Farm
          </button>
        </div>
      </div>
    </header>
  );
};
