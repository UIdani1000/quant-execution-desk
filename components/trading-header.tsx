'use client';

import { useState } from 'react';

export function TradingHeader() {
  const [isHalted, setIsHalted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleToggleBreaker() {
    const nextState = !isHalted;
    setLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:5000/api/toggle-killswitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState })
      });
      
      if (res.ok) {
        setIsHalted(nextState);
      }
    } catch (error) {
      console.error("Failed to transmit safety circuit breaker state:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <h1 className="font-bold text-base tracking-tight text-foreground">QUANT_CORE v1.2</h1>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">HFX Pro-Liquidity Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleToggleBreaker}
          disabled={loading}
          className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all cursor-pointer shadow-sm active:scale-95 ${
            isHalted 
              ? 'bg-rose-500 hover:bg-rose-600 text-black border-rose-600 animate-bounce' 
              : 'bg-background hover:bg-rose-500/10 text-rose-400 border-rose-500/30 hover:border-rose-500/50'
          }`}
        >
          {loading ? 'PROCESSING CHANNELS...' : isHalted ? '🛑 ENGINE HALTED' : '⚡ MASTER KILL-SWITCH'}
        </button>
      </div>
    </header>
  );
}