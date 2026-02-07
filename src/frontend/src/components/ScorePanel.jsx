import React from 'react';
import { TrendingUp, AlertTriangle, Shield } from 'lucide-react';

const ScorePanel = ({ result, mlResult, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'rule', label: 'Rule-Based Model' },
    { id: 'ml', label: 'ML Models' },
    { id: 'final', label: 'Final Analysis' }
  ];

  const currentTab = activeTab || 'rule';

  const handleTabChange = (id) => {
    if (onTabChange) {
      onTabChange(id);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'text-risk-high';
      case 'medium':
        return 'text-risk-medium';
      case 'low':
        return 'text-risk-low';
      default:
        return 'text-white';
    }
  };

  const getRiskBg = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-900/20 border-risk-high shadow-glow-red';
      case 'medium':
        return 'bg-orange-900/20 border-risk-medium shadow-glow-orange';
      case 'low':
        return 'bg-green-900/20 border-risk-low shadow-glow-green';
      default:
        return 'bg-dark-700';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return <AlertTriangle size={32} className="text-risk-high animate-pulse" />;
      case 'medium':
        return <AlertTriangle size={32} className="text-risk-medium animate-pulse-slow" />;
      case 'low':
        return <Shield size={32} className="text-risk-low" />;
      default:
        return <TrendingUp size={32} className="text-neon-cyan" />;
    }
  };

  const getPredictionConfig = (value) => {
    if (value === 1) {
      return {
        label: 'Malicious',
        text: 'text-risk-high',
        container: 'border-risk-high bg-red-900/20'
      };
    }

    return {
      label: 'Benign',
      text: 'text-risk-low',
      container: 'border-risk-low bg-green-900/20'
    };
  };

  const rfConfig = mlResult ? getPredictionConfig(Number(mlResult.rf)) : null;
  const gbConfig = mlResult ? getPredictionConfig(Number(mlResult.gb)) : null;

  const finalData = mlResult
    ? (() => {
        const rfVote = Number(mlResult.rf);
        const gbVote = Number(mlResult.gb);
        const votes = rfVote + gbVote;
        const score = Math.round((votes / 2) * 100);
        let riskLevel = 'low';
        if (votes === 1) {
          riskLevel = 'medium';
        }
        if (votes === 2) {
          riskLevel = 'high';
        }
        const verdict = votes >= 1 ? 'Malicious' : 'Benign';
        const descriptor = votes === 2
          ? 'Both models flag this domain as malicious.'
          : votes === 1
            ? 'One model flags this domain as malicious.'
            : 'Both models classify this domain as benign.';
        return {
          rfVote,
          gbVote,
          votes,
          score,
          riskLevel,
          verdict,
          descriptor
        };
      })()
    : null;

  const baseRiskLevel = result?.risk_level || 'low';
  const activeRiskLevel = currentTab === 'final' && finalData ? finalData.riskLevel : baseRiskLevel;

  const renderRuleContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-7xl font-bold mb-4 gradient-text">
            {result.final_score}
          </div>
          <p className="text-dark-400 text-center mb-4">Risk Score (0-100)</p>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                result.risk_level === 'high' ? 'bg-risk-high' :
                result.risk_level === 'medium' ? 'bg-risk-medium' :
                'bg-risk-low'
              }`}
              style={{ width: `${Math.min(result.final_score, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-start gap-6">
          <div>
            <p className="text-dark-400 text-sm mb-2">Domain</p>
            <p className="text-2xl font-mono font-semibold text-neon-cyan">{result.domain}</p>
          </div>

          <div className="flex items-center gap-4">
            {getRiskIcon(result.risk_level)}
            <div>
              <div className={`text-2xl font-bold ${getRiskColor(result.risk_level)}`}>
                {result.classification}
              </div>
              <div className="text-dark-400 text-sm capitalize">{result.risk_level} Risk</div>
            </div>
          </div>

          <div className="inline-block status-badge" style={{
            backgroundColor: result.risk_level === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                           result.risk_level === 'medium' ? 'rgba(249, 115, 22, 0.2)' :
                           'rgba(34, 197, 94, 0.2)',
            borderColor: result.risk_level === 'high' ? '#ef4444' :
                        result.risk_level === 'medium' ? '#f97316' :
                        '#22c55e'
          }}>
            <span style={{
              color: result.risk_level === 'high' ? '#ef4444' :
                     result.risk_level === 'medium' ? '#f97316' :
                     '#22c55e'
            }}>
              {result.classification.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-dark-700">
        <p className="text-xs text-dark-500">
          Analysis completed: {new Date(result.timestamp).toLocaleString()}
        </p>
      </div>
    </>
  );

  const renderMlContent = () => {
    if (!mlResult || !rfConfig || !gbConfig) {
      return (
        <div className="text-dark-400 text-sm">
          Machine learning predictions are not yet available for this domain.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-dark-800/60 border border-dark-600">
          <h4 className="text-lg font-semibold text-neon-cyan mb-4">Prediction Summary</h4>
          <div className="space-y-4">
            <div className={`rounded-xl border px-4 py-3 bg-dark-700/60 ${rfConfig.container}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs tracking-wide uppercase text-dark-400">Random Forest</span>
                <span className="text-xs font-mono text-dark-400">{Number(mlResult.rf)}</span>
              </div>
              <div className={`text-lg font-semibold ${rfConfig.text}`}>{rfConfig.label}</div>
            </div>
            <div className={`rounded-xl border px-4 py-3 bg-dark-700/60 ${gbConfig.container}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs tracking-wide uppercase text-dark-400">Gradient Boosting</span>
                <span className="text-xs font-mono text-dark-400">{Number(mlResult.gb)}</span>
              </div>
              <div className={`text-lg font-semibold ${gbConfig.text}`}>{gbConfig.label}</div>
            </div>
          </div>
        </div>

        <div className="card bg-dark-800/60 border border-dark-600">
          <h4 className="text-lg font-semibold text-neon-cyan mb-4">Interpretation</h4>
          <p className="text-dark-300 text-sm leading-relaxed">
            The machine learning models analyze the same domain features and provide binary
            predictions. A value of 1 indicates a malicious classification, while 0 indicates a
            benign assessment.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-dark-400">
            <div>
              <p className="uppercase text-xs tracking-wide text-dark-500">Malicious Votes</p>
              <p className="text-xl font-semibold text-white">{Number(mlResult.rf) + Number(mlResult.gb)}</p>
            </div>
            <div>
              <p className="uppercase text-xs tracking-wide text-dark-500">Benign Votes</p>
              <p className="text-xl font-semibold text-white">{2 - (Number(mlResult.rf) + Number(mlResult.gb))}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFinalContent = () => {
    if (!finalData) {
      return (
        <div className="text-dark-400 text-sm">
          Run the machine learning prediction to view the final analysis.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-7xl font-bold mb-4 gradient-text">{finalData.score}</div>
          <p className="text-dark-400 text-center mb-4">Ensemble Risk Score (0-100)</p>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                finalData.riskLevel === 'high' ? 'bg-risk-high' :
                finalData.riskLevel === 'medium' ? 'bg-risk-medium' :
                'bg-risk-low'
              }`}
              style={{ width: `${finalData.score}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-start gap-6">
          <div className="flex items-center gap-4">
            {getRiskIcon(finalData.riskLevel)}
            <div>
              <div className={`text-2xl font-bold ${getRiskColor(finalData.riskLevel)}`}>
                {finalData.verdict}
              </div>
              <div className="text-dark-400 text-sm capitalize">{finalData.riskLevel} Risk</div>
            </div>
          </div>

          <div className="inline-block status-badge" style={{
            backgroundColor: finalData.riskLevel === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                           finalData.riskLevel === 'medium' ? 'rgba(249, 115, 22, 0.2)' :
                           'rgba(34, 197, 94, 0.2)',
            borderColor: finalData.riskLevel === 'high' ? '#ef4444' :
                         finalData.riskLevel === 'medium' ? '#f97316' :
                         '#22c55e'
          }}>
            <span style={{
              color: finalData.riskLevel === 'high' ? '#ef4444' :
                     finalData.riskLevel === 'medium' ? '#f97316' :
                     '#22c55e'
            }}>
              {finalData.verdict.toUpperCase()}
            </span>
          </div>

          <div className="text-dark-300 text-sm leading-relaxed">{finalData.descriptor}</div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="card bg-dark-800/60 border border-dark-600">
              <p className="uppercase text-xs tracking-wide text-dark-500 mb-1">Random Forest</p>
              <p className="text-lg font-semibold text-white">{finalData.rfVote}</p>
            </div>
            <div className="card bg-dark-800/60 border border-dark-600">
              <p className="uppercase text-xs tracking-wide text-dark-500 mb-1">Gradient Boosting</p>
              <p className="text-lg font-semibold text-white">{finalData.gbVote}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`card mb-8 border-2 ${getRiskBg(activeRiskLevel)}`}>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentTab === tab.id
                ? 'bg-neon-cyan text-dark-900 border-neon-cyan font-semibold'
                : 'bg-dark-800 border-dark-600 text-dark-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {currentTab === 'rule' && renderRuleContent()}
      {currentTab === 'ml' && renderMlContent()}
      {currentTab === 'final' && renderFinalContent()}
    </div>
  );
};

export default ScorePanel;
