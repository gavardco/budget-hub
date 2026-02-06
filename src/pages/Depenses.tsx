import { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { services, operations, formatCurrency, formatDate } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export interface DepenseItem {
  id: string;
  service: string;
  operation: string;
  date: string;
  description: string;
  montantTTC: number;
  fournisseur: string;
}

const STORAGE_KEY = 'budget-pro-depenses-v2';

const loadDepenses = (): DepenseItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveDepenses = (data: DepenseItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export default function Depenses() {
  const [depenses, setDepenses] = useState<DepenseItem[]>(loadDepenses);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepense, setEditingDepense] = useState<DepenseItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    service: '',
    operation: '',
    date: '',
    description: '',
    montantTTC: '',
    fournisseur: '',
  });

  useEffect(() => {
    saveDepenses(depenses);
  }, [depenses]);

  // Filter depenses
  const filteredDepenses = depenses.filter((d) => {
    const matchesService = selectedService === 'all' || d.service === selectedService;
    const matchesSearch = 
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fournisseur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.operation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesSearch;
  });

  // Open dialog for new depense
  const openNewDialog = () => {
    setEditingDepense(null);
    setFormData({
      service: selectedService !== 'all' ? selectedService : '',
      operation: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      montantTTC: '',
      fournisseur: '',
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing
  const openEditDialog = (depense: DepenseItem) => {
    setEditingDepense(depense);
    setFormData({
      service: depense.service,
      operation: depense.operation,
      date: depense.date,
      description: depense.description,
      montantTTC: depense.montantTTC.toString(),
      fournisseur: depense.fournisseur,
    });
    setIsDialogOpen(true);
  };

  // Save depense
  const handleSave = () => {
    if (!formData.service || !formData.date || !formData.description || !formData.montantTTC) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const depenseData: DepenseItem = {
      id: editingDepense?.id || Date.now().toString(),
      service: formData.service,
      operation: formData.operation === 'none' ? '' : formData.operation,
      date: formData.date,
      description: formData.description,
      montantTTC: parseFloat(formData.montantTTC) || 0,
      fournisseur: formData.fournisseur,
    };

    if (editingDepense) {
      setDepenses(prev => prev.map(d => d.id === editingDepense.id ? depenseData : d));
      toast({ title: "Dépense modifiée", description: "La dépense a été mise à jour." });
    } else {
      setDepenses(prev => [...prev, depenseData]);
      toast({ title: "Dépense créée", description: "La nouvelle dépense a été ajoutée." });
    }

    setIsDialogOpen(false);
  };

  // Delete depense
  const handleDelete = () => {
    if (deleteId) {
      setDepenses(prev => prev.filter(d => d.id !== deleteId));
      toast({ title: "Dépense supprimée", description: "La dépense a été supprimée." });
      setDeleteId(null);
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredDepenses.map(d => ({
      'Service': d.service,
      'Opération': d.operation,
      'Date': formatDate(d.date),
      'Description': d.description,
      'Montant TTC': d.montantTTC,
      'Fournisseur': d.fournisseur,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dépenses');
    
    ws['!cols'] = [
      { wch: 25 }, // Service
      { wch: 35 }, // Opération
      { wch: 12 }, // Date
      { wch: 40 }, // Description
      { wch: 15 }, // Montant TTC
      { wch: 25 }, // Fournisseur
    ];

    XLSX.writeFile(wb, `depenses_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({
      title: "Export réussi",
      description: `${filteredDepenses.length} dépenses exportées en Excel.`,
    });
  };

  // Import CSV
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedDepenses: DepenseItem[] = jsonData.map((row: any, index) => ({
          id: `import-${Date.now()}-${index}`,
          service: row['Service'] || row['SERVICE'] || '',
          operation: row['Opération'] || row['OPÉRATION'] || row['OPERATION'] || '',
          date: parseImportDate(row['Date'] || row['DATE'] || new Date().toISOString()),
          description: row['Description'] || row['DESCRIPTION'] || '',
          montantTTC: parseFloat(String(row['Montant TTC'] || row['MONTANT TTC'] || row['Montant'] || 0).replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
          fournisseur: row['Fournisseur'] || row['FOURNISSEUR'] || '',
        }));

        setDepenses(prev => [...prev, ...importedDepenses]);
        toast({
          title: "Import réussi",
          description: `${importedDepenses.length} dépenses importées.`,
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier n'a pas pu être lu. Vérifiez le format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const parseImportDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    // Try DD/MM/YYYY format
    const frMatch = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (frMatch) {
      return `${frMatch[3]}-${frMatch[2]}-${frMatch[1]}`;
    }
    
    // Try ISO format
    if (dateStr.includes('-')) {
      return dateStr.split('T')[0];
    }
    
    return new Date().toISOString().split('T')[0];
  };

  return (
    <MainLayout>
      <PageHeader title="Dépenses">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleImportCSV}
            className="hidden"
          />
          <Button variant="outline" size="sm" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Importer CSV
            </span>
          </Button>
        </label>
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
        <Button size="sm" onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle dépense
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Subtitle */}
        <p className="text-muted-foreground mb-6">Saisie et suivi des dépenses</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-64">
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.nom}>
                    {service.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
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
                <TableHead>SERVICE</TableHead>
                <TableHead>OPÉRATION</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>DESCRIPTION</TableHead>
                <TableHead className="text-right">MONTANT TTC</TableHead>
                <TableHead>FOURNISSEUR</TableHead>
                <TableHead className="text-center">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    Aucune dépense
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepenses.map((depense) => (
                  <TableRow key={depense.id}>
                    <TableCell className="font-medium">{depense.service}</TableCell>
                    <TableCell>{depense.operation || '-'}</TableCell>
                    <TableCell>{formatDate(depense.date)}</TableCell>
                    <TableCell>{depense.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(depense.montantTTC)}
                    </TableCell>
                    <TableCell>{depense.fournisseur || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(depense)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(depense.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingDepense ? 'Modifier la dépense' : 'Nouvelle dépense'}
            </DialogTitle>
            <DialogDescription>
              {editingDepense 
                ? 'Modifiez les informations de la dépense.'
                : 'Saisissez les informations de la nouvelle dépense.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.nom}>
                        {service.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation">Opération</Label>
                <Select
                  value={formData.operation}
                  onValueChange={(value) => setFormData({ ...formData, operation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {operations.map((op) => (
                      <SelectItem key={op.id} value={op.nom}>
                        {op.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant TTC *</Label>
                <Input
                  id="montant"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.montantTTC}
                  onChange={(e) => setFormData({ ...formData, montantTTC: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Description de la dépense..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fournisseur">Fournisseur</Label>
              <Input
                id="fournisseur"
                placeholder="Nom du fournisseur"
                value={formData.fournisseur}
                onChange={(e) => setFormData({ ...formData, fournisseur: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingDepense ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
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
