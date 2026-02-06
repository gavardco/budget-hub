import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Demande {
  id: string;
  service: string;
  domaine: string;
  categorie: 'Fonctionnement' | 'Investissement';
  description: string;
  justification: string;
  budgetTitre: number;
  budgetValide: number;
  statut: 'Brouillon' | 'En attente' | 'Validé' | 'Rejeté';
  dateCreation: string;
}

// Convert database row to Demande
const rowToDemande = (row: any): Demande => ({
  id: row.id,
  service: row.service,
  domaine: row.domaine || '',
  categorie: row.categorie as 'Fonctionnement' | 'Investissement',
  description: row.description || '',
  justification: row.justification || '',
  budgetTitre: Number(row.budget_titre) || 0,
  budgetValide: Number(row.budget_valide) || 0,
  statut: row.statut as Demande['statut'],
  dateCreation: row.date_creation,
});

// Convert Demande to database row
const demandeToRow = (demande: Omit<Demande, 'id'>) => ({
  service: demande.service,
  domaine: demande.domaine,
  categorie: demande.categorie,
  description: demande.description,
  justification: demande.justification,
  budget_titre: demande.budgetTitre,
  budget_valide: demande.budgetValide,
  statut: demande.statut,
  date_creation: demande.dateCreation,
});

export function useDemandes() {
  return useQuery({
    queryKey: ['demandes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demandes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(rowToDemande);
    },
  });
}

export function useCreateDemande() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (demande: Omit<Demande, 'id'>) => {
      const { data, error } = await supabase
        .from('demandes')
        .insert(demandeToRow(demande))
        .select()
        .single();
      
      if (error) throw error;
      return rowToDemande(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande.",
        variant: "destructive",
      });
      console.error('Create demande error:', error);
    },
  });
}

export function useUpdateDemande() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...demande }: Demande) => {
      const { data, error } = await supabase
        .from('demandes')
        .update(demandeToRow(demande))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return rowToDemande(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la demande.",
        variant: "destructive",
      });
      console.error('Update demande error:', error);
    },
  });
}

export function useDeleteDemande() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('demandes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la demande.",
        variant: "destructive",
      });
      console.error('Delete demande error:', error);
    },
  });
}

export function useBulkCreateDemandes() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (demandes: Omit<Demande, 'id'>[]) => {
      const rows = demandes.map(demandeToRow);
      const { data, error } = await supabase
        .from('demandes')
        .insert(rows)
        .select();
      
      if (error) throw error;
      return (data || []).map(rowToDemande);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demandes'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les demandes.",
        variant: "destructive",
      });
      console.error('Bulk create demandes error:', error);
    },
  });
}
