import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function Parametres() {
  const [anneeBudgetaire, setAnneeBudgetaire] = useState('2025');
  const [devise, setDevise] = useState('EUR');

  const handleSave = () => {
    toast({
      title: "Paramètres enregistrés",
      description: "Les modifications ont été sauvegardées avec succès.",
    });
  };

  return (
    <MainLayout>
      <PageHeader title="Paramètres" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres de base de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="annee">Année budgétaire en cours</Label>
                <Select value={anneeBudgetaire} onValueChange={setAnneeBudgetaire}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="devise">Devise</Label>
                <Select value={devise} onValueChange={setDevise}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="CHF">Franc suisse (CHF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations de la commune</CardTitle>
              <CardDescription>
                Données administratives de votre collectivité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomCommune">Nom de la commune</Label>
                <Input id="nomCommune" defaultValue="Commune de Saint-Martin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codeCommune">Code INSEE</Label>
                <Input id="codeCommune" defaultValue="12345" />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
