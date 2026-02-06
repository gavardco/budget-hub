import { useState, useEffect } from 'react';
import { FileSpreadsheet, Pencil, Plus, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { operations as initialOperations, formatCurrency, Operation } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const statutOptions = ['Planifié', 'En cours', 'Terminé', 'Annulé'];

const STORAGE_KEY = 'budget-pro-operations';

// Load operations from localStorage or use initial data
const loadOperations = (): Operation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading operations from localStorage:', error);
  }
  return initialOperations;
};

// Save operations to localStorage
const saveOperations = (operations: Operation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error('Error saving operations to localStorage:', error);
  }
};

export default function Operations() {
  const [operations, setOperations] = useState<Operation[]>(loadOperations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    budgetPrevu: 0,
    depenses: 0,
    periode: '',
    statut: 'Planifié' as Operation['statut'],
  });

  const openNewDialog = () => {
    setEditingOperation(null);
    setFormData({
      nom: '',
      description: '',
      budgetPrevu: 0,
      depenses: 0,
      periode: '',
      statut: 'Planifié',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (operation: Operation) => {
    setEditingOperation(operation);
    setFormData({
      nom: operation.nom,
      description: operation.description,
      budgetPrevu: operation.budgetPrevu,
      depenses: operation.depenses,
      periode: operation.periode,
      statut: operation.statut,
    });
    setIsDialogOpen(true);
  };

  // Persist operations to localStorage whenever they change
  useEffect(() => {
    saveOperations(operations);
  }, [operations]);

  const handleSubmit = () => {
    if (editingOperation) {
      setOperations(operations.map((o) =>
        o.id === editingOperation.id
          ? { ...o, ...formData }
          : o
      ));
    } else {
      const newOperation: Operation = {
        id: String(Date.now()),
        ...formData,
      };
      setOperations([newOperation, ...operations]);
    }
    setIsDialogOpen(false);
  };

  const openDeleteDialog = (operation: Operation) => {
    setOperationToDelete(operation);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (operationToDelete) {
      setOperations(operations.filter(o => o.id !== operationToDelete.id));
      toast({
        title: "Opération supprimée",
        description: "L'opération a été supprimée avec succès.",
      });
    }
    setDeleteDialogOpen(false);
    setOperationToDelete(null);
  };

  const getReste = (operation: Operation) => {
    return operation.budgetPrevu - operation.depenses;
  };

  // Export Excel
  const handleExportExcel = () => {
    const exportData = operations.map(o => ({
      'Nom': o.nom,
      'Description': o.description,
      'Budget prévu': o.budgetPrevu,
      'Dépenses': o.depenses,
      'Reste': o.budgetPrevu - o.depenses,
      'Période': o.periode,
      'Statut': o.statut,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Opérations');
    
    // Auto-size columns
    const colWidths = [
      { wch: 35 }, // Nom
      { wch: 45 }, // Description
      { wch: 15 }, // Budget prévu
      { wch: 15 }, // Dépenses
      { wch: 15 }, // Reste
      { wch: 12 }, // Période
      { wch: 12 }, // Statut
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `operations_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Export réussi",
      description: `${operations.length} opérations exportées en Excel.`,
    });
  };

  return (
    <MainLayout>
      <PageHeader title="Opérations">
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
        <Button size="sm" onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle opération
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="max-w-[250px]">Description</TableHead>
                <TableHead className="text-right">Budget prévu</TableHead>
                <TableHead className="text-right">Dépenses</TableHead>
                <TableHead className="text-right">Reste</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((operation) => {
                const reste = getReste(operation);
                return (
                  <TableRow key={operation.id} className="table-row-hover">
                    <TableCell className="font-medium">{operation.nom}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{operation.description}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(operation.budgetPrevu)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(operation.depenses)}</TableCell>
                    <TableCell className={cn(
                      "text-right font-medium",
                      reste >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {formatCurrency(reste)}
                    </TableCell>
                    <TableCell>{operation.periode || '-'}</TableCell>
                    <TableCell><StatusBadge status={operation.statut} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(operation)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(operation)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingOperation ? 'Modifier l\'opération' : 'Nouvelle opération'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'opération</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetPrevu">Budget prévu (€)</Label>
                <Input
                  id="budgetPrevu"
                  type="number"
                  value={formData.budgetPrevu}
                  onChange={(e) => setFormData({ ...formData, budgetPrevu: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depenses">Dépenses (€)</Label>
                <Input
                  id="depenses"
                  type="number"
                  value={formData.depenses}
                  onChange={(e) => setFormData({ ...formData, depenses: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periode">Période</Label>
                <Input
                  id="periode"
                  value={formData.periode}
                  onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                  placeholder="ex: 2024-2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => setFormData({ ...formData, statut: value as Operation['statut'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statutOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingOperation ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette opération ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'opération "{operationToDelete?.nom}" sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
