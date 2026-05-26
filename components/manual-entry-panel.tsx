'use client';

import { useState } from 'react';

export function ManualEntryPanel() {
  const [asset, setAsset] = useState('XAUUSD');
  const [volume, setVolume] = useState('0.01');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function handleExecute(side: 'BUY' | 'SELL') {
    const lotSize = parseFloat(volume);
    if (isNaN(lotSize) || lotSize <= 0) {
      setStatus('Invalid volume execution metric.');
      return;
    }

    setLoading(true);
    setStatus(`Transmitting instantaneous ${side} order...`);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/manual-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, side, volume: lotSize })
      });

      const data = await res.json();
      setStatus(data.message);
    } catch (error) {
      setStatus('Transmission link communication failure.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-foreground">Instant Execution Desk</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Bypass strategy rules to deploy direct market orders</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Select Asset Pair</label>
          <select
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 text-foreground cursor-pointer"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
          >
            <option value="XAUUSD">Gold (XAUUSD)</option>
            <option value="XAGUSD">Silver (XAGUSD)</option>
            <option value="BTCUSDT">Bitcoin (BTCUSDT)</option>
            <option value="ETHUSDT">Ethereum (ETHUSDT)</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground block mb-1.5 font-medium">Execution Volume (Lots)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className="w-full bg-background border border-border rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 text-foreground"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleExecute('BUY')}
            disabled={loading}
            className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 text-xs font-bold py-3 rounded-lg transition-all cursor-pointer active:scale-[0.98]"
          >
            BUY / LONG
          </button>
          <button
            onClick={() => handleExecute('SELL')}
            disabled={loading}
            className="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black border border-rose-500/20 text-xs font-bold py-3 rounded-lg transition-all cursor-pointer active:scale-[0.98]"
          >
            SELL / SHORT
          </button>
        </div>

        {status && (
          <p className="text-[10px] font-mono text-amber-400 mt-2 text-center bg-background/50 py-1.5 px-2 rounded border border-border/30">
            ⚡ {status}
          </p>
        )}
      </div>
    </div>
  );
}