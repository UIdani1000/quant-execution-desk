'use client';

import { useEffect, useState } from 'react';

interface LogItem {
  id: string;
  timestamp: string;
  asset: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

// 📡 CENTRALIZED NETWORK BRIDGE GATEWAY (Looks for Vercel Environment Variables first)
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export function TradingLog() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  async function fetchLiveLogs() {
    try {
      // 🎯 FIXED: Uses dynamic bridge endpoint for seamless switching between localhost and ngrok
      const res = await fetch(`${apiBase}/api/strategy-status`);
      if (!res.ok) return;
      const data = await res.json();
      
      const generatedLogs: LogItem[] = [];
      const timeString = new Date().toLocaleTimeString();

      Object.keys(data).forEach((key) => {
        const assetData = data[key];
        if (assetData.sniper_5m === "Filter Restrained") {
          generatedLogs.push({
            id: `${key}-restrained`,
            timestamp: timeString,
            asset: key,
            message: `[GUARD] Core indicators activated. Execution locked out due to weak volume/momentum conditions.`,
            type: 'warning'
          });
        } else if (assetData.sniper_5m === "Sniper Ready") {
          generatedLogs.push({
            id: `${key}-ready`,
            timestamp: timeString,
            asset: key,
            message: `[SIGNAL] All structural dimensions verified. Direct entry parameters initialized.`,
            type: 'success'
          });
        }
      });

      // Maintain a maximum scrollback of 5 items
      setLogs((prev) => {
        const combined = [...generatedLogs, ...prev];
        const unique = combined.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
        return unique.slice(0, 5);
      });

    } catch (e) {
      console.error("Logger polling failure:", e);
    }
  }

  useEffect(() => {
    fetchLiveLogs();
    const interval = setInterval(fetchLiveLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Comprehensive Trading Log</h3>
        <button onClick={() => setLogs([])} className="text-xs text-muted-foreground hover:text-foreground underline transition-colors">
          Clear Terminal
        </button>
      </div>

      <div className="bg-background/60 rounded-lg p-4 font-mono text-xs space-y-2 border border-border/40 max-h-[220px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-zinc-600 italic">Listening for system triggers... Terminal ready.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start border-b border-border/10 pb-1.5 last:border-0">
              <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
              <span className="text-cyan-400 shrink-0 font-bold">[{log.asset}]</span>
              <span className={log.type === 'warning' ? 'text-amber-400/90' : log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}