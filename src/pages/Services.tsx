import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { services } from '@/lib/mockData';

export default function Services() {
  return (
    <MainLayout>
      <PageHeader title="Services" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du service</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} className="table-row-hover">
                  <TableCell className="font-medium">{service.nom}</TableCell>
                  <TableCell>{service.responsable}</TableCell>
                  <TableCell className="text-muted-foreground">{service.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
