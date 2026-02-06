import { cn } from '@/lib/utils';

type StatusVariant = 'brouillon' | 'en-attente' | 'valide' | 'rejete' | 'planifie' | 'en-cours' | 'termine' | 'annule' | 'ouvert' | 'cloture' | 'preparation';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusVariants: Record<StatusVariant, string> = {
  'brouillon': 'bg-muted text-muted-foreground',
  'en-attente': 'bg-warning/20 text-warning',
  'valide': 'bg-success/20 text-success',
  'rejete': 'bg-destructive/20 text-destructive',
  'planifie': 'bg-info/20 text-info',
  'en-cours': 'bg-primary/20 text-primary',
  'termine': 'bg-success/20 text-success',
  'annule': 'bg-muted text-muted-foreground',
  'ouvert': 'bg-success/20 text-success',
  'cloture': 'bg-muted text-muted-foreground',
  'preparation': 'bg-warning/20 text-warning',
};

const getVariantKey = (status: string): StatusVariant => {
  const normalized = status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
  
  const mapping: Record<string, StatusVariant> = {
    'brouillon': 'brouillon',
    'en-attente': 'en-attente',
    'valide': 'valide',
    'rejete': 'rejete',
    'planifie': 'planifie',
    'en-cours': 'en-cours',
    'termine': 'termine',
    'annule': 'annule',
    'ouvert': 'ouvert',
    'cloture': 'cloture',
    'en-preparation': 'preparation',
  };

  return mapping[normalized] || 'brouillon';
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getVariantKey(status);

  return (
    <span
      className={cn(
        'status-badge',
        statusVariants[variant],
        className
      )}
    >
      {status}
    </span>
  );
}
