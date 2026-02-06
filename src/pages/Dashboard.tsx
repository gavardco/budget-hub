import { FileText, Receipt, TrendingDown, Wallet } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { KPICard } from '@/components/ui/KPICard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { demandes, depenses, formatCurrency, formatDate, getTotals } from '@/lib/mockData';
import dashboardBanner from '@/assets/dashboard-banner.png';

export default function Dashboard() {
  const totals = getTotals();
  const lastDemandes = demandes.slice(0, 5);
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

        {/* Recent Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last Demandes */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Dernières demandes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {lastDemandes.map((demande) => (
                  <div
                    key={demande.id}
                    className="table-row-hover px-6 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {demande.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {demande.service} • {demande.categorie}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(demande.budgetTitre)}
                        </span>
                        <StatusBadge status={demande.statut} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last Depenses */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-warning" />
                Dernières dépenses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {lastDepenses.map((depense) => (
                  <div
                    key={depense.id}
                    className="table-row-hover px-6 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">
                          {depense.libelle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(depense.date)} • {depense.rattachement}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-sm font-medium text-foreground">
                          {formatCurrency(depense.montant)}
                        </span>
                        <StatusBadge status={depense.type} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
