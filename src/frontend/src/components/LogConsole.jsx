import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

const LogConsole = ({ logs }) => {
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-neon-cyan flex items-center gap-2">
        <Terminal size={24} />
        Log Output
      </h2>

      <div className="card">
        <div
          ref={consoleRef}
          className="terminal bg-black border border-neon-green/30"
        >
          {logs.length === 0 ? (
            <div className="text-dark-500 text-sm">
              $ waiting for analysis...
            </div>
          ) : (
            <div className="font-mono text-sm space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="text-neon-green whitespace-pre-wrap break-words">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogConsole;
