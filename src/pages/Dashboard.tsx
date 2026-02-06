import { useState, useEffect } from 'react';
import { FileText, Receipt, TrendingDown, Wallet } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  demandes as initialDemandes, 
  formatCurrency, 
  formatDate, 
  Demande
} from '@/lib/mockData';
import dashboardBanner from '@/assets/dashboard-banner.png';

const DEMANDES_STORAGE_KEY = 'budget-pro-demandes';
const DEPENSES_V2_STORAGE_KEY = 'budget-pro-depenses-v2';

// New depense format
interface DepenseV2 {
  id: string;
  service: string;
  operation: string;
  date: string;
  description: string;
  montantTTC: number;
  fournisseur: string;
}

// Load data from localStorage
const loadFromStorage = <T,>(key: string, initial: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return initial;
};

export default function Dashboard() {
  const [demandes, setDemandes] = useState<Demande[]>(() => 
    loadFromStorage(DEMANDES_STORAGE_KEY, initialDemandes)
  );
  const [depenses, setDepenses] = useState<DepenseV2[]>(() => 
    loadFromStorage<DepenseV2>(DEPENSES_V2_STORAGE_KEY, [])
  );

  // Listen for storage changes (when data is updated in other tabs/pages)
  useEffect(() => {
    const handleStorageChange = () => {
      setDemandes(loadFromStorage(DEMANDES_STORAGE_KEY, initialDemandes));
      setDepenses(loadFromStorage<DepenseV2>(DEPENSES_V2_STORAGE_KEY, []));
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus to catch same-tab updates
    const handleFocus = () => {
      setDemandes(loadFromStorage(DEMANDES_STORAGE_KEY, initialDemandes));
      setDepenses(loadFromStorage<DepenseV2>(DEPENSES_V2_STORAGE_KEY, []));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Calculate totals from current data
  const totals = {
    budgetDemande: demandes.reduce((sum, d) => sum + d.budgetTitre, 0),
    budgetValide: demandes.reduce((sum, d) => sum + d.budgetValide, 0),
    totalDepenses: depenses.reduce((sum, d) => sum + d.montantTTC, 0),
    resteADepenser: demandes.reduce((sum, d) => sum + d.budgetValide, 0) - depenses.reduce((sum, d) => sum + d.montantTTC, 0),
  };

  const lastDepenses = depenses.slice(0, 5);

  return (
    <MainLayout>
      <PageHeader title="Tableau de bord" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden h-48 bg-gradient-to-r from-primary/10 to-primary/5">
          <img
            src={dashboardBanner}
            alt="Budget Pro Dashboard"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent flex items-center px-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-foreground drop-shadow-lg">
                Bienvenue sur Budget Pro
              </h2>
              <p className="text-lg text-primary-foreground/90 mt-1 drop-shadow">
                Gérez efficacement le budget de votre commune
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Budget demandé"
            value={formatCurrency(totals.budgetDemande)}
            icon={FileText}
            variant="budget"
          />
          <KPICard
            title="Budget validé"
            value={formatCurrency(totals.budgetValide)}
            icon={Wallet}
            variant="validated"
          />
          <KPICard
            title="Dépensé"
            value={formatCurrency(totals.totalDepenses)}
            icon={Receipt}
            variant="spent"
          />
          <KPICard
            title="Reste à dépenser"
            value={formatCurrency(Math.max(0, totals.resteADepenser))}
            icon={TrendingDown}
            variant="remaining"
          />
        </div>

        {/* Last Depenses */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-warning" />
                Dernières dépenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {lastDepenses.length === 0 ? (
                  <div className="px-6 py-8 text-center text-muted-foreground">
                    Aucune dépense enregistrée
                  </div>
                ) : (
                  lastDepenses.map((depense) => (
                    <div
                      key={depense.id}
                      className="table-row-hover px-6 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {depense.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(depense.date)} • {depense.service}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm font-medium text-foreground">
                            {formatCurrency(depense.montantTTC)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
