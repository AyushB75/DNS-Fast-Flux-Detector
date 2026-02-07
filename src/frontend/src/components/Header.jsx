import React from 'react';
import { Shield, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-dark-700 bg-dark-800/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg">
              <Shield size={28} className="text-dark-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Fast Flux Detector
              </h1>
              <p className="text-dark-400 text-sm">
                Hybrid Rule-Based Fast-Flux Identification Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg border border-dark-600">
            <Zap size={16} className="text-neon-yellow animate-pulse" />
            <span className="text-sm text-dark-300">Live Analytics</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
