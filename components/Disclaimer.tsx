
import React from 'react';
import { AlertCircle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-xl flex items-start space-x-4">
      <div className="bg-red-900/30 p-2 rounded-lg mt-0.5">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
      <div className="flex-1">
        <h5 className="text-red-400 font-bold text-sm mb-1">Educational & Security Disclaimer</h5>
        <p className="text-red-200/60 text-xs leading-relaxed">
          LeakHunter is designed for legal, defensive security audits and educational purposes. It scans only local files and does not access the internet. Users are responsible for ensuring they have permission to scan target directories. This tool does not guarantee 100% detection; manual audit is always recommended.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
