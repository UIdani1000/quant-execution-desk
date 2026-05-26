'use client';

interface MetricsProps {
  data: {
    win_rate: number;
    profit_factor: number;
    total_trades: number;
    avg_win: number;
    avg_loss: number;
    max_drawdown: number;
  };
}

export function PerformanceMetrics({ data }: MetricsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="font-semibold text-lg text-foreground">Strategy Performance Intelligence</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Real-time edge verification metrics from closed trades</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Win Rate</p>
          <h4 className={`text-xl font-bold mt-1.5 ${data.win_rate >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {data.win_rate}%
          </h4>
        </div>

        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Profit Factor</p>
          <h4 className={`text-xl font-bold mt-1.5 ${data.profit_factor >= 1.5 ? 'text-emerald-400' : data.profit_factor >= 1.0 ? 'text-cyan-400' : 'text-rose-400'}`}>
            {data.profit_factor.toFixed(2)}
          </h4>
        </div>

        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Trades</p>
          <h4 className="text-xl font-bold mt-1.5 text-foreground font-mono">{data.total_trades}</h4>
        </div>

        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Avg Win</p>
          <h4 className="text-xl font-bold mt-1.5 text-emerald-400 font-mono">
            +${data.avg_win.toFixed(2)}
          </h4>
        </div>

        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Avg Loss</p>
          <h4 className="text-xl font-bold mt-1.5 text-rose-400 font-mono">
            ${data.avg_loss.toFixed(2)}
          </h4>
        </div>

        <div className="bg-background/50 border border-border/60 p-4 rounded-xl text-center">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Max Drawdown</p>
          <h4 className="text-xl font-bold mt-1.5 text-rose-500 font-mono">
            -${data.max_drawdown.toFixed(2)}
          </h4>
        </div>

      </div>
    </div>
  );
}