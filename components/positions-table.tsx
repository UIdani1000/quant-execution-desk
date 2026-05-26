'use client';

interface Position {
  ticket: number;
  asset: string;
  type: 'BUY' | 'SELL';
  volume: number;
  entry_price: number;
  current_price: number;
  sl: number;
  tp: number;
  profit: number;
}

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Current Open Positions</h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-mono font-medium">
          {positions.length} Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider bg-background/50">
              <th className="py-3 px-4 font-medium">Asset</th>
              <th className="py-3 px-4 font-medium">Type</th>
              <th className="py-3 px-4 font-medium">Size</th>
              <th className="py-3 px-4 font-medium">Entry</th>
              <th className="py-3 px-4 font-medium">Current</th>
              <th className="py-3 px-4 font-medium">Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground italic font-mono text-xs">
                  No active exposure found on Exness server. Scanning market grids...
                </td>
              </tr>
            ) : (
              positions.map((pos) => (
                <tr key={pos.ticket} className="border-b border-border/40 hover:bg-muted/30 transition-colors font-mono text-xs">
                  <td className="py-3 px-4 font-bold text-foreground">{pos.asset}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pos.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {pos.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{pos.volume.toFixed(2)}</td>
                  <td className="py-3 px-4 text-foreground">${pos.entry_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-foreground">${pos.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className={`py-3 px-4 font-bold ${pos.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pos.profit >= 0 ? '+' : ''}${pos.profit.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}