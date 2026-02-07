import { useState, useRef } from 'react';
import { Download, FileUp, Pencil, Plus, Search, FileSpreadsheet, Trash2, RotateCcw } from 'lucide-react';
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
import { services, formatCurrency } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { 
  useDemandes, 
  useCreateDemande, 
  useUpdateDemande, 
  useDeleteDemande,
  useBulkCreateDemandes,
  useDeleteAllDemandes,
  Demande 
} from '@/hooks/useDemandes';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['Fonctionnement', 'Investissement'];
const statuts = ['Brouillon', 'En attente', 'Validé', 'Rejeté'];

export default function Demandes() {
  const { data: demandes = [], isLoading } = useDemandes();
  const createDemande = useCreateDemande();
  const updateDemande = useUpdateDemande();
  const deleteDemande = useDeleteDemande();
  const bulkCreateDemandes = useBulkCreateDemandes();
  const deleteAllDemandes = useDeleteAllDemandes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterDomaine, setFilterDomaine] = useState<string>('all');
  const [filterCategorie, setFilterCategorie] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');

  const uniqueDomaines = [...new Set(demandes.map(d => d.domaine).filter(Boolean))].sort();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDemande, setEditingDemande] = useState<Demande | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demandeToDelete, setDemandeToDelete] = useState<Demande | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    service: '',
    domaine: '',
    categorie: 'Fonctionnement' as 'Fonctionnement' | 'Investissement',
    description: '',
    justification: '',
    budgetTitre: 0,
    budgetValide: 0,
    statut: 'Brouillon' as Demande['statut'],
  });

  const filteredDemandes = demandes.filter((d) => {
    const matchesSearch =
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = filterService === 'all' || d.service === filterService;
    const matchesDomaine = filterDomaine === 'all' || d.domaine === filterDomaine;
    const matchesCategorie = filterCategorie === 'all' || d.categorie === filterCategorie;
    const matchesStatut = filterStatut === 'all' || d.statut === filterStatut;
    return matchesSearch && matchesService && matchesDomaine && matchesCategorie && matchesStatut;
  });

  const openNewDialog = () => {
    setEditingDemande(null);
    setFormData({
      service: '',
      domaine: '',
      categorie: 'Fonctionnement',
      description: '',
      justification: '',
      budgetTitre: 0,
      budgetValide: 0,
      statut: 'Brouillon',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (demande: Demande) => {
    setEditingDemande(demande);
    setFormData({
      service: demande.service,
      domaine: demande.domaine,
      categorie: demande.categorie,
      description: demande.description,
      justification: demande.justification,
      budgetTitre: demande.budgetTitre,
      budgetValide: demande.budgetValide,
      statut: demande.statut,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    const demandeData = {
      ...formData,
      dateCreation: editingDemande?.dateCreation || new Date().toISOString().split('T')[0],
    };

    if (editingDemande) {
      await updateDemande.mutateAsync({ id: editingDemande.id, ...demandeData });
      toast({ title: "Demande modifiée", description: "La demande a été mise à jour." });
    } else {
      await createDemande.mutateAsync(demandeData);
      toast({ title: "Demande créée", description: "La nouvelle demande a été ajoutée." });
    }
    setIsDialogOpen(false);
  };

  const openDeleteDialog = (demande: Demande) => {
    setDemandeToDelete(demande);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (demandeToDelete) {
      await deleteDemande.mutateAsync(demandeToDelete.id);
      toast({ title: "Demande supprimée", description: "La demande a été supprimée avec succès." });
    }
    setDeleteDialogOpen(false);
    setDemandeToDelete(null);
  };

  const handleResetAll = async () => {
    await deleteAllDemandes.mutateAsync();
    toast({ title: "Réinitialisation effectuée", description: "Toutes les demandes ont été supprimées." });
    setResetDialogOpen(false);
  };
  // Export Excel
  const handleExportExcel = () => {
    const exportData = demandes.map(d => ({
      'Service': d.service,
      'Domaine': d.domaine,
      'Catégorie': d.categorie,
      'Description': d.description,
      'Justification': d.justification,
      'Budget titre': d.budgetTitre,
      'Budget validé': d.budgetValide,
      'Statut': d.statut,
      'Date création': d.dateCreation,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Demandes');
    
    const colWidths = [
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 40 }, { wch: 30 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `demandes_budgetaires_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast({ title: "Export réussi", description: `${demandes.length} demandes exportées en Excel.` });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Service', 'Domaine', 'Catégorie', 'Description', 'Justification', 'Budget titre', 'Budget validé', 'Statut', 'Date création'];
    const csvContent = [
      headers.join(';'),
      ...demandes.map(d => [
        d.service, d.domaine, d.categorie,
        `"${d.description.replace(/"/g, '""')}"`,
        `"${d.justification.replace(/"/g, '""')}"`,
        d.budgetTitre, d.budgetValide, d.statut, d.dateCreation
      ].join(';'))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `demandes_budgetaires_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Export réussi", description: `${demandes.length} demandes exportées en CSV.` });
  };

  // Parse amount
  const parseAmount = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    let str = String(value).trim().replace(/€/g, '').trim();
    const hasFrenchFormat = /\d+\s+\d{3}/.test(str) || /\d+,\d{2}$/.test(str.replace(/\s/g, ''));
    if (hasFrenchFormat && str.includes(',')) {
      str = str.replace(/\s/g, '').replace(',', '.');
    } else {
      str = str.replace(/\s/g, '');
      if (str.includes(',')) {
        const parts = str.split(',');
        if (parts.length === 2 && parts[1].length <= 2) {
          str = str.replace(',', '.');
        } else {
          str = str.replace(/,/g, '');
        }
      }
    }
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  // Normalize service name
  const normalizeServiceName = (rawService: string): string => {
    const normalized = rawService.trim().toUpperCase();
    const serviceMap: Record<string, string> = {
      'SERVICE TECHNIQUE': 'Service Technique',
      'DIRECTION': 'Direction',
      'FINANCES': 'Finances',
      'ACCUEIL À LA POPULATION': 'Accueil à la population',
      'ACCUEIL A LA POPULATION': 'Accueil à la population',
      'RESSOURCES HUMAINES': 'Ressources humaines',
      'RH': 'Ressources humaines',
      'MÉDIATHÈQUE': 'Médiathèque',
      'MEDIATHEQUE': 'Médiathèque',
      'ENFANCE JEUNESSE': 'Enfance jeunesse',
      'ENFANCE-JEUNESSE': 'Enfance jeunesse',
      'RESTAURATION SCOLAIRE': 'Restauration scolaire',
    };
    if (serviceMap[normalized]) return serviceMap[normalized];
    for (const [key, value] of Object.entries(serviceMap)) {
      if (normalized.includes(key) || key.includes(normalized)) return value;
    }
    return rawService.trim();
  };

  // Parse row to Demande
  const parseRowToDemande = (row: Record<string, unknown>): Omit<Demande, 'id'> => {
    const rawService = String(row['SERVICE'] || row['Service'] || row['service'] || '').trim();
    const service = normalizeServiceName(rawService);
    const domaine = String(row['DOMAINE'] || row['Domaine'] || row['domaine'] || '').trim();
    const categorieRaw = String(row['CATEGORIE'] || row['Catégorie'] || row['categorie'] || row['Categorie'] || '').trim().toUpperCase();
    const categorie: 'Fonctionnement' | 'Investissement' = categorieRaw.includes('INVEST') ? 'Investissement' : 'Fonctionnement';
    const description = String(row['DESCRIPTION'] || row['Description'] || row['description'] || '').trim();
    const justification = String(row['JUSTIFICATION'] || row['Justification'] || row['justification'] || row['JUSTIFICATIONS'] || '').trim();
    const budgetTitre = parseAmount(row['BUDGET '] || row['BUDGET'] || row['BUDGET TTC'] || row['Budget titre'] || 0);
    const budgetValide = parseAmount(row['BUDGET VALIDE'] || row['BUDGET VALIDE par la commission Finance'] || row['Budget validé'] || 0);
    const statutRaw = String(row['Statut'] || row['statut'] || row['STATUT'] || 'Brouillon').trim();
    const statut = (['Brouillon', 'En attente', 'Validé', 'Rejeté'].includes(statutRaw) ? statutRaw : 'Brouillon') as Demande['statut'];
    const dateCreation = String(row['Date création'] || row['date_creation'] || new Date().toISOString().split('T')[0]);

    return { service, domaine, categorie, description, justification, budgetTitre, budgetValide, statut, dateCreation };
  };

  // Import file
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Record<string, unknown>[];
          const newDemandes = jsonData.map(row => parseRowToDemande(row));
          await bulkCreateDemandes.mutateAsync(newDemandes);
          toast({ title: "Import Excel réussi", description: `${newDemandes.length} demandes importées et sauvegardées.` });
        } catch (error) {
          toast({ title: "Erreur d'import", description: "Le fichier Excel n'a pas pu être lu.", variant: "destructive" });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(';').map(h => h.trim());
          const dataLines = lines.slice(1);
          const newDemandes = dataLines.map((line) => {
            const values = line.split(';').map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
            const row: Record<string, unknown> = {};
            headers.forEach((header, i) => { row[header] = values[i] || ''; });
            return parseRowToDemande(row);
          });
          await bulkCreateDemandes.mutateAsync(newDemandes);
          toast({ title: "Import CSV réussi", description: `${newDemandes.length} demandes importées et sauvegardées.` });
        } catch (error) {
          toast({ title: "Erreur d'import", description: "Le fichier CSV n'a pas pu être lu.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageHeader title="Demandes budgétaires" />
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title="Demandes budgétaires">
        <input type="file" ref={fileInputRef} accept=".csv,.xlsx,.xls" onChange={handleImportFile} className="hidden" />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <FileUp className="w-4 h-4 mr-2" />Importer
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />Export Excel
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => setResetDialogOpen(true)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
          <RotateCcw className="w-4 h-4 mr-2" />Réinitialiser
        </Button>
        <Button size="sm" onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />Nouvelle demande
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tous - Service" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Service</SelectItem>
              {services.map((s) => (<SelectItem key={s.id} value={s.nom}>{s.nom}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterDomaine} onValueChange={setFilterDomaine}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tous - Domaine" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Domaine</SelectItem>
              {uniqueDomaines.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterCategorie} onValueChange={setFilterCategorie}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tous - Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Catégorie</SelectItem>
              {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tous - Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Statut</SelectItem>
              {statuts.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Domaine</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="max-w-[200px]">Description</TableHead>
                <TableHead className="text-right">Budget demandé</TableHead>
                <TableHead className="text-right">Budget validé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Aucune demande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredDemandes.map((demande) => (
                  <TableRow key={demande.id} className="table-row-hover">
                    <TableCell className="font-medium">{demande.service}</TableCell>
                    <TableCell>{demande.domaine || '-'}</TableCell>
                    <TableCell>{demande.categorie}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{demande.description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(demande.budgetTitre)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(demande.budgetValide)}</TableCell>
                    <TableCell><StatusBadge status={demande.statut} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(demande)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(demande)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
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

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingDemande ? 'Modifier la demande' : 'Nouvelle demande'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (<SelectItem key={s.id} value={s.nom}>{s.nom}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domaine">Domaine</Label>
                <Input id="domaine" value={formData.domaine} onChange={(e) => setFormData({ ...formData, domaine: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select value={formData.categorie} onValueChange={(value) => setFormData({ ...formData, categorie: value as 'Fonctionnement' | 'Investissement' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value as Demande['statut'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuts.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Textarea id="justification" value={formData.justification} onChange={(e) => setFormData({ ...formData, justification: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetTitre">Budget demandé (€)</Label>
                <Input id="budgetTitre" type="number" value={formData.budgetTitre} onChange={(e) => setFormData({ ...formData, budgetTitre: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetValide">Budget validé (€)</Label>
                <Input id="budgetValide" type="number" value={formData.budgetValide} onChange={(e) => setFormData({ ...formData, budgetValide: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmit} disabled={createDemande.isPending || updateDemande.isPending}>
              {editingDemande ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La demande "{demandeToDelete?.description}" sera définitivement supprimée.
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

      {/* Reset All Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser toutes les demandes ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les demandes budgétaires ({demandes.length}) seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetAll} disabled={deleteAllDemandes.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer tout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
