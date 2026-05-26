'use client';

import { useState, useEffect } from 'react';
import { TradingHeader } from '@/components/trading-header';
import { ManualEntryPanel } from '@/components/manual-entry-panel';
import { PositionsTable } from '@/components/positions-table';
import { TradingLog } from '@/components/trading-log';
import { BrokerAuthPanel } from '@/components/broker-auth-panel';
import { PerformanceMetrics } from '@/components/performance-metrics';

interface AssetConfig {
  use_rsi_filter: boolean;
  use_atr_filter: boolean;
}

interface AssetStrategy {
  price: number;
  trend_1h: string;
  structure_15m: string;
  sniper_5m: string;
  allowed: boolean;
  config: AssetConfig;
}

interface StrategyState { [key: string]: AssetStrategy; }
interface AccountMetrics { balance: number; equity: number; profit: number; margin_level: number; }
interface PerformanceData { win_rate: number; profit_factor: number; total_trades: number; avg_win: number; avg_loss: number; max_drawdown: number; }

// 📡 CENTRALIZED NETWORK BRIDGE GATEWAY (Looks for Vercel Environment Variables first)
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function Dashboard() {
  const [liveStrategies, setLiveStrategies] = useState<StrategyState>({
    XAUUSD: { price: 0.0, trend_1h: "Loading...", structure_15m: "Loading...", sniper_5m: "Loading...", allowed: false, config: { use_rsi_filter: true, use_atr_filter: true } },
    XAGUSD: { price: 0.0, trend_1h: "Loading...", structure_15m: "Loading...", sniper_5m: "Loading...", allowed: false, config: { use_rsi_filter: true, use_atr_filter: true } },
    BTCUSDT: { price: 0.0, trend_1h: "Loading...", structure_15m: "Loading...", sniper_5m: "Loading...", allowed: false, config: { use_rsi_filter: false, use_atr_filter: false } },
    ETHUSDT: { price: 0.0, trend_1h: "Loading...", structure_15m: "Loading...", sniper_5m: "Loading...", allowed: false, config: { use_rsi_filter: false, use_atr_filter: true } },
  });

  const [metrics, setMetrics] = useState<AccountMetrics>({ balance: 0, equity: 0, profit: 0, margin_level: 100 });
  const [activePositions, setActivePositions] = useState<any[]>([]);
  
  const [perfMetrics, setPerfMetrics] = useState<PerformanceData>({
    win_rate: 0,
    profit_factor: 0,
    total_trades: 0,
    avg_win: 0,
    avg_loss: 0,
    max_drawdown: 0
  });

  async function fetchDashboardData() {
    try {
      // 1. Fetch live technical analysis and strategy signals via secure tunnel
      const stratRes = await fetch(`${apiBase}/api/strategy-status`);
      if (stratRes.ok) {
        const stratData = await stratRes.json();
        setLiveStrategies(stratData);
      }
      
      // 2. Fetch live account balance financials via secure tunnel
      const metricRes = await fetch(`${apiBase}/api/account-metrics`);
      if (metricRes.ok) {
        const metricData = await metricRes.json();
        setMetrics({
          balance: Number(metricData.balance) || 0,
          equity: Number(metricData.equity) || 0,
          profit: Number(metricData.profit) || 0,
          margin_level: Number(metricData.margin_level) || 0
        });
      }

      // 3. Fetch active broker terminal exposure via secure tunnel
      const posRes = await fetch(`${apiBase}/api/active-positions`);
      if (posRes.ok) {
        const posData = await posRes.json();
        setActivePositions(posData);
      }

      // 4. Fetch strategy edge performance intelligence from history logs
      const perfRes = await fetch(`${apiBase}/api/performance-metrics`);
      if (perfRes.ok) {
        const perfData = await perfRes.json();
        setPerfMetrics(perfData);
      }
    } catch (error) {
      console.error("Data tracking pipe offline:", error);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 2000); // 2-second high-speed layout refresh
    return () => clearInterval(interval);
  }, []);

  async function handleToggleFilter(assetKey: string, filterType: 'use_rsi_filter' | 'use_atr_filter', currentVal: boolean) {
    try {
      const response = await fetch(`${apiBase}/api/update-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_key: assetKey,
          filter_type: filterType,
          value: !currentVal
        })
      });
      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Failed executing switcher matrix payload updates:", error);
    }
  }

  const assetDisplayArray = [
    { key: 'XAUUSD', label: 'Gold', price: liveStrategies.XAUUSD.price, data: liveStrategies.XAUUSD, format: (p: number) => p.toFixed(2) },
    { key: 'XAGUSD', label: 'Silver', price: liveStrategies.XAGUSD.price, data: liveStrategies.XAGUSD, format: (p: number) => p.toFixed(2) },
    { key: 'BTCUSDT', label: 'Bitcoin', price: liveStrategies.BTCUSDT.price, data: liveStrategies.BTCUSDT, format: (p: number) => p.toLocaleString() },
    { key: 'ETHUSDT', label: 'Ethereum', price: liveStrategies.ETHUSDT.price, data: liveStrategies.ETHUSDT, format: (p: number) => p.toLocaleString() },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TradingHeader />

      <main className="mx-auto px-6 py-8">
        <div className="space-y-8">
          
          {/* 📊 CORE FINANCIAL CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Balance</p>
              <h3 className="text-2xl font-bold mt-2">${metrics.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Equity</p>
              <h3 className="text-2xl font-bold mt-2">${metrics.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Floating Profit/Loss</p>
              <h3 className={`text-2xl font-bold mt-2 ${metrics.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.profit >= 0 ? '+' : ''}${metrics.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Margin Level</p>
              <h3 className="text-2xl font-bold mt-2 text-cyan-400">{metrics.margin_level.toFixed(1)}%</h3>
            </div>
          </section>

          {/* 📈 PERFORMANCE STATS INTELLIGENCE ROW */}
          <section>
            <PerformanceMetrics data={perfMetrics} />
          </section>

          {/* 🎛️ CONTROL PANEL SWITCH GRIDS */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Strategy Engine Control Panel</h2>
              <p className="text-sm text-muted-foreground mt-1">Manage algorithmic filters live per asset</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {assetDisplayArray.map((asset) => (
                <div key={asset.key} className="bg-card rounded-xl border border-border p-5 space-y-5 shadow-sm">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg text-foreground">{asset.label}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{asset.key}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md font-mono font-medium">
                        ${asset.format(asset.price)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-b border-border/60 py-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1H Trend:</span>
                      <span className={`font-semibold ${asset.data.trend_1h.includes('BULLISH') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.data.trend_1h}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">15M Pullback:</span>
                      <span className="text-foreground font-medium">{asset.data.structure_15m}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">5M Sniper:</span>
                      <span className={`font-semibold ${asset.data.sniper_5m.includes('Ready') ? 'text-emerald-400' : asset.data.sniper_5m.includes('Restrained') ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {asset.data.sniper_5m}
                      </span>
                    </div>
                  </div>

                  <div className="bg-background/40 p-3 rounded-lg border border-border/40 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">Active Guards</p>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium cursor-pointer" htmlFor={`rsi-${asset.key}`}>1H RSI Filter</label>
                      <input
                        id={`rsi-${asset.key}`}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        checked={asset.data.config.use_rsi_filter}
                        onChange={() => handleToggleFilter(asset.key, 'use_rsi_filter', asset.data.config.use_rsi_filter)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium cursor-pointer" htmlFor={`atr-${asset.key}`}>15M ATR Volatility</label>
                      <input
                        id={`atr-${asset.key}`}
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                        checked={asset.data.config.use_atr_filter}
                        onChange={() => handleToggleFilter(asset.key, 'use_atr_filter', asset.data.config.use_atr_filter)}
                      />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* ⚡ ACCESS MANAGEMENT MATRIX AND POSITIONS LAYOUT */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <BrokerAuthPanel />
                <ManualEntryPanel />
              </div>
              <div className="lg:col-span-3">
                <PositionsTable positions={activePositions} />
              </div>
            </div>
          </section>

          {/* 💻 LOG TERMINAL WINDOW */}
          <section>
            <TradingLog />
          </section>
        </div>
      </main>
    </div>
  );
}