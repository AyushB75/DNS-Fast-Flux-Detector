import React from 'react';
import { Activity, TrendingUp, Globe, Clock, MapPin, Zap } from 'lucide-react';

const RuleCards = ({ rules }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'high_risk':
        return { border: 'rule-card-high', icon: 'text-risk-high' };
      case 'medium_risk':
        return { border: 'rule-card-medium', icon: 'text-risk-medium' };
      case 'low_risk':
        return { border: 'rule-card-low', icon: 'text-risk-low' };
      default:
        return { border: '', icon: 'text-dark-400' };
    }
  };

  const getRuleIcon = (name) => {
    switch (name) {
      case 'IP_Count':
        return <Zap size={20} />;
      case 'Median_TTL':
        return <Clock size={20} />;
      case 'TTL_Var':
        return <Activity size={20} />;
      case 'ASN_Diversity':
        return <Globe size={20} />;
      case 'Geo_Diversity':
        return <MapPin size={20} />;
      case 'Domain_Age':
        return <TrendingUp size={20} />;
      case 'Mannheim_Rule':
        return <Activity size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-neon-cyan">Detection Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rules.map((rule, idx) => {
          const colors = getStatusColor(rule.status);
          return (
            <div key={idx} className={`card ${colors.border}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 bg-dark-700 rounded-lg ${colors.icon}`}>
                  {getRuleIcon(rule.name)}
                </div>
                <span className="text-xs px-2 py-1 bg-dark-700 rounded text-dark-400 capitalize">
                  {rule.threshold_tier || 'N/A'}
                </span>
              </div>

              <h3 className="font-semibold text-sm mb-1 truncate">
                {rule.name.replace(/_/g, ' ')}
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-dark-500 text-xs">Value</p>
                  <p className="font-mono font-semibold text-neon-cyan">
                    {typeof rule.value === 'number' ? rule.value.toFixed(2) : rule.value}
                  </p>
                </div>

                <div>
                  <p className="text-dark-500 text-xs">Score Contribution</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">
                      {rule.score}/{rule.max_weight}
                    </span>
                    <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          rule.status === 'high_risk' ? 'bg-risk-high' :
                          rule.status === 'medium_risk' ? 'bg-risk-medium' :
                          'bg-risk-low'
                        }`}
                        style={{
                          width: `${(rule.score / rule.max_weight) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-700">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    rule.status === 'high_risk' ? 'bg-red-900/40 text-risk-high' :
                    rule.status === 'medium_risk' ? 'bg-orange-900/40 text-risk-medium' :
                    'bg-green-900/40 text-risk-low'
                  }`}>
                    {rule.status === 'high_risk' ? '⚠️ High Risk' :
                     rule.status === 'medium_risk' ? '⚡ Medium Risk' :
                     '✓ Low Risk'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RuleCards;
