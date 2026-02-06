import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { campagnes, formatDate } from '@/lib/mockData';

export default function Campagnes() {
  return (
    <MainLayout>
      <PageHeader title="Campagnes budgétaires" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campagnes.map((campagne) => (
                <TableRow key={campagne.id} className="table-row-hover">
                  <TableCell className="font-medium">{campagne.nom}</TableCell>
                  <TableCell>{campagne.periode}</TableCell>
                  <TableCell>{formatDate(campagne.dateDebut)}</TableCell>
                  <TableCell>{formatDate(campagne.dateFin)}</TableCell>
                  <TableCell><StatusBadge status={campagne.etat} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
