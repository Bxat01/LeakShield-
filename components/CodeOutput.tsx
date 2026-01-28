
import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, Terminal } from 'lucide-react';
import { PYTHON_TEMPLATE } from '../constants';

const CodeOutput: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([PYTHON_TEMPLATE], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "leakhunter.py";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100">Python CLI Tool</h2>
          <p className="text-zinc-400">Stable v1.0.0 • Offline Ready</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg transition-colors border border-zinc-700"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Source'}</span>
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-900/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .py</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#050505] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                <span className="ml-2 text-xs text-zinc-500 font-mono">leakhunter.py</span>
              </div>
              <Terminal className="w-4 h-4 text-zinc-600" />
            </div>
            <pre className="p-6 overflow-x-auto text-xs md:text-sm font-mono text-zinc-400 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-700">
              <code>{PYTHON_TEMPLATE}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h4 className="font-bold text-zinc-100 mb-4">Installation</h4>
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">LeakHunter requires no external dependencies. Just standard Python 3.x.</p>
              <div className="bg-[#050505] p-3 rounded-lg border border-zinc-800">
                <code className="text-xs text-green-400 font-mono">python --version</code>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h4 className="font-bold text-zinc-100 mb-4">Usage Guide</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs text-zinc-500 font-bold uppercase">Basic Scan</p>
                <div className="bg-[#050505] p-3 rounded-lg border border-zinc-800">
                  <code className="text-xs text-zinc-300 font-mono">python leakhunter.py ./my-project</code>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-zinc-500 font-bold uppercase">Current Directory</p>
                <div className="bg-[#050505] p-3 rounded-lg border border-zinc-800">
                  <code className="text-xs text-zinc-300 font-mono">python leakhunter.py .</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-2xl">
            <h4 className="font-bold text-blue-400 mb-2 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2" />
              Extensions
            </h4>
            <p className="text-xs text-blue-300/80 leading-relaxed">
              To add your own patterns, simply update the <code className="text-blue-200">PATTERNS</code> dictionary in the script. You can add AWS keys, Stripe tokens, or company-specific formats easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;
