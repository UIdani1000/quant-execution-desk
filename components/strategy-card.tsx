'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StrategyCardProps {
  asset: string;
  symbol: string;
  trend1H: {
    label: string;
    status: 'bullish' | 'bearish' | 'neutral';
  };
  structure15m: {
    label: string;
    status: 'active' | 'pending' | 'inactive';
  };
  sniper5m: {
    label: string;
    status: 'ready' | 'waiting' | 'inactive';
  };
  availability: 'active' | 'paused';
  pauseReason?: string;
}

export function StrategyCard({
  asset,
  symbol,
  trend1H,
  structure15m,
  sniper5m,
  availability,
  pauseReason,
}: StrategyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bullish':
      case 'active':
      case 'ready':
        return 'bg-primary/20 text-primary border-primary/40';
      case 'bearish':
      case 'inactive':
        return 'bg-secondary/20 text-secondary border-secondary/40';
      case 'neutral':
      case 'pending':
      case 'waiting':
        return 'bg-accent/20 text-accent border-accent/40';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/40';
    }
  };

  return (
    <Card className="bg-card/60 border-border/40 hover:border-border/60 transition-colors">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{asset}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
          <Badge
            className={`${
              availability === 'active'
                ? 'bg-primary/20 text-primary border-primary/40'
                : 'bg-secondary/20 text-secondary border-secondary/40'
            } border`}
          >
            {availability === 'active' ? 'Active' : `Paused: ${pauseReason}`}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="border-t border-border/30 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                1H Trend Boss
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(
                  trend1H.status
                )}`}
              >
                {trend1H.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                15m Structure
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(
                  structure15m.status
                )}`}
              >
                {structure15m.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                5m Sniper
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold border ${getStatusColor(
                  sniper5m.status
                )}`}
              >
                {sniper5m.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
