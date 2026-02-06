import { Search } from 'lucide-react';
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { depenses, formatCurrency, formatDate } from '@/lib/mockData';

export default function Depenses() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDepenses = depenses.filter((d) =>
    d.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.rattachement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader title="Dépenses" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une dépense..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rattachement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepenses.map((depense) => (
                <TableRow key={depense.id} className="table-row-hover">
                  <TableCell>{formatDate(depense.date)}</TableCell>
                  <TableCell className="font-medium">{depense.libelle}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(depense.montant)}</TableCell>
                  <TableCell><StatusBadge status={depense.type} /></TableCell>
                  <TableCell className="text-muted-foreground">{depense.rattachement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
