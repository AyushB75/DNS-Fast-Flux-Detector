import React from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';

const DomainInput = ({ domain, setDomain, onAnalyze, onClear, loading, error }) => {
  return (
    <div className="mb-8">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-neon-cyan">
          Domain Analysis
        </h2>
        
        <form onSubmit={onAnalyze} className="space-y-4">
          <div>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g., example.com)"
              className="input-field"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-risk-high rounded-lg text-risk-high">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Domain'
              )}
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={loading}
              className="btn-secondary px-6"
            >
              <X size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainInput;
