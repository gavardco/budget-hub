import { useState } from 'react';
import { Download, FileUp, Pencil, Plus, Search } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { demandes as initialDemandes, services, formatCurrency, Demande } from '@/lib/mockData';

const categories = ['Fonctionnement', 'Investissement'];
const statuts = ['Brouillon', 'En attente', 'Validé', 'Rejeté'];

export default function Demandes() {
  const [demandes, setDemandes] = useState<Demande[]>(initialDemandes);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterService, setFilterService] = useState<string>('all');
  const [filterCategorie, setFilterCategorie] = useState<string>('all');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDemande, setEditingDemande] = useState<Demande | null>(null);

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
    const matchesCategorie = filterCategorie === 'all' || d.categorie === filterCategorie;
    const matchesStatut = filterStatut === 'all' || d.statut === filterStatut;
    return matchesSearch && matchesService && matchesCategorie && matchesStatut;
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

  const handleSubmit = () => {
    if (editingDemande) {
      setDemandes(demandes.map((d) =>
        d.id === editingDemande.id
          ? { ...d, ...formData }
          : d
      ));
    } else {
      const newDemande: Demande = {
        id: String(Date.now()),
        ...formData,
        dateCreation: new Date().toISOString().split('T')[0],
      };
      setDemandes([newDemande, ...demandes]);
    }
    setIsDialogOpen(false);
  };

  return (
    <MainLayout>
      <PageHeader title="Demandes budgétaires">
        <Button variant="outline" size="sm">
          <FileUp className="w-4 h-4 mr-2" />
          Importer CSV
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
        <Button size="sm" onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle demande
        </Button>
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterService} onValueChange={setFilterService}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous - Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Service</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.nom}>{s.nom}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategorie} onValueChange={setFilterCategorie}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous - Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Catégorie</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous - Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous - Statut</SelectItem>
              {statuts.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
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
                <TableHead className="max-w-[150px]">Justification</TableHead>
                <TableHead className="text-right">Budget titre</TableHead>
                <TableHead className="text-right">Budget validé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.map((demande) => (
                <TableRow key={demande.id} className="table-row-hover">
                  <TableCell className="font-medium">{demande.service}</TableCell>
                  <TableCell>{demande.domaine}</TableCell>
                  <TableCell>{demande.categorie}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{demande.description}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{demande.justification}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(demande.budgetTitre)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(demande.budgetValide)}</TableCell>
                  <TableCell><StatusBadge status={demande.statut} /></TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(demande)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDemande ? 'Modifier la demande' : 'Nouvelle demande budgétaire'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.nom}>{s.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="domaine">Domaine</Label>
                <Input
                  id="domaine"
                  value={formData.domaine}
                  onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(value) => setFormData({ ...formData, categorie: value as 'Fonctionnement' | 'Investissement' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(value) => setFormData({ ...formData, statut: value as Demande['statut'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justification">Justification</Label>
              <Input
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetTitre">Budget titre (€)</Label>
                <Input
                  id="budgetTitre"
                  type="number"
                  value={formData.budgetTitre}
                  onChange={(e) => setFormData({ ...formData, budgetTitre: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetValide">Budget validé (€)</Label>
                <Input
                  id="budgetValide"
                  type="number"
                  value={formData.budgetValide}
                  onChange={(e) => setFormData({ ...formData, budgetValide: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingDemande ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
