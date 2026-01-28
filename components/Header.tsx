
import React from 'react';
import { Search, ShieldAlert, Code2, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'scanner' | 'code';
  setActiveTab: (tab: 'dashboard' | 'scanner' | 'code') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <ShieldAlert className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">LEAKHUNTER</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold -mt-1">Security Sentinel</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <TabButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Overview"
          />
          <TabButton 
            active={activeTab === 'scanner'} 
            onClick={() => setActiveTab('scanner')}
            icon={<Search className="w-4 h-4" />}
            label="Live Sandbox"
          />
          <TabButton 
            active={activeTab === 'code'} 
            onClick={() => setActiveTab('code')}
            icon={<Code2 className="w-4 h-4" />}
            label="Python CLI Source"
          />
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center bg-green-950/20 px-3 py-1 rounded-full border border-green-900/50">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">OFFLINE SECURE</span>
          </div>
        </div>
      </div>
    </header>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
      active 
        ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700' 
        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default Header;
