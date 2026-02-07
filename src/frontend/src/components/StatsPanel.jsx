import React from 'react';
import { TrendingUp, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const StatsPanel = ({ stats }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neon-cyan mb-4 flex items-center gap-2">
        <TrendingUp size={20} />
        Dashboard Statistics
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <p className="text-dark-400 text-xs mb-1">Total Analyses</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>

        <div className="p-3 bg-red-900/20 rounded-lg border border-risk-high">
          <p className="text-risk-high text-xs mb-1 flex items-center gap-1">
            <AlertTriangle size={14} /> Fast-Flux
          </p>
          <p className="text-2xl font-bold text-risk-high">{stats.fast_flux_count}</p>
        </div>

        <div className="p-3 bg-orange-900/20 rounded-lg border border-risk-medium">
          <p className="text-risk-medium text-xs mb-1 flex items-center gap-1">
            <AlertCircle size={14} /> Suspicious
          </p>
          <p className="text-2xl font-bold text-risk-medium">{stats.suspicious_count}</p>
        </div>

        <div className="p-3 bg-green-900/20 rounded-lg border border-risk-low">
          <p className="text-risk-low text-xs mb-1 flex items-center gap-1">
            <CheckCircle size={14} /> Benign
          </p>
          <p className="text-2xl font-bold text-risk-low">{stats.benign_count}</p>
        </div>

        <div className="col-span-2 p-3 bg-dark-700/50 rounded-lg border border-dark-600">
          <p className="text-dark-400 text-xs mb-1">Average Score</p>
          <p className="text-2xl font-bold text-neon-cyan">{stats.avg_score?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
