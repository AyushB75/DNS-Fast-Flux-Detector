import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu } from 'lucide-react';

const FEATURE_CONFIG = [
  { key: 'ip_count', label: 'IP Count' },
  { key: 'ttl_median', label: 'Median TTL' },
  { key: 'asn_count', label: 'ASN Diversity' },
  { key: 'country_count', label: 'Geo Diversity' },
  { key: 'domain_age_days', label: 'Domain Age (Days)' }
];

const FEATURE_COLORS = ['#00ffff', '#38bdf8', '#818cf8', '#c084fc', '#22d3ee'];

const MlVisualizationSection = ({ features, predictions }) => {
  if (!features || !predictions) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-neon-cyan flex items-center gap-2">
          <Cpu size={24} />
          ML Analytics & Visualizations
        </h2>
        <div className="card text-sm text-dark-400">
          Run a prediction to view machine learning analytics.
        </div>
      </div>
    );
  }

  const featureData = FEATURE_CONFIG.map((config, index) => {
    const rawValue = Number(features[config.key] ?? 0);
    return {
      key: config.key,
      name: config.label,
      value: Number.isNaN(rawValue) ? 0 : rawValue,
      color: FEATURE_COLORS[index % FEATURE_COLORS.length]
    };
  });

  const scoreByFeature = featureData.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color
  }));

  const totalMagnitude = featureData.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const contributionData = featureData
    .map((item) => ({
      name: item.name,
      value: totalMagnitude ? Number(((Math.abs(item.value) / totalMagnitude) * 100).toFixed(2)) : 0,
      color: item.color
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const rfVote = Number(predictions.rf || 0);
  const gbVote = Number(predictions.gb || 0);
  const maliciousVotes = rfVote + gbVote;
  const benignVotes = 2 - maliciousVotes;

  const riskDistribution = [
    { name: 'Malicious Vote', value: maliciousVotes, color: '#ef4444' },
    { name: 'Benign Vote', value: benignVotes, color: '#22c55e' }
  ].filter((item) => item.value > 0);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-neon-cyan flex items-center gap-2">
        <Cpu size={24} />
        ML Analytics & Visualizations
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Score by Feature</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreByFeature}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
                cursor={{ fill: 'rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {scoreByFeature.map((entry, index) => (
                  <Cell key={`score-bar-${entry.name}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Model Vote Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}`}
                outerRadius={100}
                dataKey="value"
              >
                {riskDistribution.map((entry) => (
                  <Cell key={`risk-cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Feature Contribution Breakdown (%)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={contributionData} layout="vertical" margin={{ top: 5, right: 30, left: 300, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={290} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {contributionData.map((entry) => (
                  <Cell key={`contrib-${entry.name}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MlVisualizationSection;
