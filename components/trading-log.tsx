'use client';

interface EngineAlert {
  id: number | string;
  timestamp: string;
  symbol: string;
  type: 'REJECTION' | 'EXECUTION' | 'WARNING';
  message: string;
}

interface TradingLogProps {
  logs: EngineAlert[];
}

export function TradingLog({ logs }: TradingLogProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg">Comprehensive Trading Log</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live strategy engine execution and rejection alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Stream Live</span>
        </div>
      </div>

      <div className="bg-background/60 rounded-lg p-4 font-mono text-xs space-y-2 border border-border/40 max-h-[250px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-zinc-600 italic py-2">Listening for engine triggers... Terminal pipeline ready.</p>
        ) : (
          logs.map((log) => {
            // Map the alert type to distinct styling profiles
            let typeColor = 'text-zinc-300';
            if (log.type === 'REJECTION') typeColor = 'text-amber-400/90';
            if (log.type === 'EXECUTION') typeColor = 'text-emerald-400';
            if (log.type === 'WARNING') typeColor = 'text-rose-400/90';

            return (
              <div key={log.id} className="flex gap-3 items-start border-b border-border/10 pb-2 last:border-0 last:pb-0">
                <span className="text-zinc-500 shrink-0 font-light">{log.timestamp}</span>
                <span className="text-cyan-400 shrink-0 font-bold">[{log.symbol}]</span>
                <span className="text-zinc-500 font-medium shrink-0 font-mono text-[10px] uppercase px-1.5 py-0.5 bg-muted rounded border border-border/40">
                  {log.type}
                </span>
                <span className={`${typeColor} break-words`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}