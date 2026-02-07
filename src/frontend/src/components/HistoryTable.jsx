import React from 'react';
import { History, ChevronRight } from 'lucide-react';

const HistoryTable = ({ history, onRowClick }) => {
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-900/40 text-risk-high border border-risk-high';
      case 'medium':
        return 'bg-orange-900/40 text-risk-medium border border-risk-medium';
      case 'low':
        return 'bg-green-900/40 text-risk-low border border-risk-low';
      default:
        return 'bg-dark-700 text-white';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center gap-2">
        <History size={24} />
        Analysis History
      </h2>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold">Domain</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold">Score</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold">Classification</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold">Risk Level</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold">Timestamp</th>
              <th className="text-left py-3 px-4 text-neon-cyan font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick(item)}
                className="border-b border-dark-700 hover:bg-dark-700/50 cursor-pointer transition-all duration-200"
              >
                <td className="py-3 px-4 text-white font-mono">{item.domain}</td>
                <td className="py-3 px-4">
                  <span className="font-mono font-semibold text-neon-cyan">
                    {item.final_score.toFixed(2)}
                  </span>
                </td>
                <td className="py-3 px-4">{item.classification}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeColor(item.risk_level)}`}>
                    {item.risk_level === 'high' ? '🔴 High Risk' :
                     item.risk_level === 'medium' ? '🟠 Medium Risk' :
                     '🟢 Low Risk'}
                  </span>
                </td>
                <td className="py-3 px-4 text-dark-400 text-sm">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <ChevronRight size={18} className="text-dark-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
