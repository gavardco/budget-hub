import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant: 'budget' | 'validated' | 'spent' | 'remaining';
  trend?: {
    value: string;
    positive: boolean;
  };
}

const variantStyles = {
  budget: 'kpi-card-budget',
  validated: 'kpi-card-validated',
  spent: 'kpi-card-spent',
  remaining: 'kpi-card-remaining',
};

const iconColors = {
  budget: 'text-primary',
  validated: 'text-success',
  spent: 'text-warning',
  remaining: 'text-purple-500',
};

export function KPICard({ title, value, icon: Icon, variant, trend }: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-5 bg-card animate-fade-in',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                trend.positive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        <div className={cn('p-2 rounded-lg bg-background/50', iconColors[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
