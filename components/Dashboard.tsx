
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// Added ShieldAlert to fix missing import error
import { ShieldCheck, Zap, Globe, Lock, AlertTriangle, ShieldAlert } from 'lucide-react';

const DATA = [
  { name: 'Discord', count: 12, color: '#5865F2' },
  { name: 'GitHub', count: 8, color: '#333' },
  { name: 'Telegram', count: 5, color: '#0088cc' },
  { name: 'Env Files', count: 14, color: '#f59e0b' },
  { name: 'Generic Keys', count: 20, color: '#dc2626' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-100 leading-tight">
            Stop leaking secrets <br />
            <span className="text-red-500 italic">before they hit git.</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl">
            LeakHunter is a lightweight, local-first security scanner designed to find sensitive credentials in your project files. No cloud, no uploads, total privacy.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center space-x-4">
              <Zap className="text-yellow-500 w-8 h-8" />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Performance</p>
                <p className="text-zinc-100 font-semibold">Recursive Fast Scan</p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center space-x-4">
              <ShieldCheck className="text-green-500 w-8 h-8" />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold">Privacy</p>
                <p className="text-zinc-100 font-semibold">100% Offline</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-zinc-200">Common Secret Leaks</h3>
            <span className="text-xs text-zinc-500">Based on industry reports</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Globe className="w-6 h-6 text-blue-500" />}
          title="Air-Gapped Operation"
          description="Never connects to the internet. Scans happen directly on your CPU using local file system APIs."
        />
        <FeatureCard 
          icon={<Lock className="w-6 h-6 text-purple-500" />}
          title="Regex-Powered Detection"
          description="Sophisticated patterns for Discord, GitHub, Telegram, AWS, and generic high-entropy strings."
        />
        <FeatureCard 
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          title="Sensitive File Discovery"
          description="Detects .env, SQL backups, SSH keys, and config files that should never be in version control."
        />
      </div>

      {/* Why Use It Section */}
      <div className="bg-red-950/10 border border-red-900/30 p-8 rounded-2xl">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center">
            <ShieldAlert className="w-6 h-6 mr-3 text-red-500" />
            Why LeakHunter?
          </h3>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Every day, thousands of secrets are accidentally pushed to GitHub. Once a secret is public, even for a second, it is compromised. LeakHunter serves as your local pre-commit defense, catching mistakes before they leave your machine.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Prevention is cheaper than rotation",
              "Maintain regulatory compliance",
              "Audit external dependencies",
              "Zero configuration needed",
              "Open source & transparent logic"
            ].map((text, i) => (
              <li key={i} className="flex items-center text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition-colors group">
    <div className="bg-zinc-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-zinc-100 font-bold mb-2">{title}</h4>
    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
  </div>
);

export default Dashboard;
