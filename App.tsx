
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FileScanner from './components/FileScanner';
import CodeOutput from './components/CodeOutput';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'code'>('dashboard');

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-300">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="mb-12">
          <Disclaimer />
        </div>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'scanner' && <FileScanner />}
        {activeTab === 'code' && <CodeOutput />}
      </main>

      <footer className="border-t border-zinc-800 py-12 text-center text-zinc-500 text-sm">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Security Policy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Legal</a>
        </div>
        <p>© 2026 LeakHunter Open Source Project. Strictly Local & Offline.</p>
      </footer>
    </div>
  );
};

export default App;
