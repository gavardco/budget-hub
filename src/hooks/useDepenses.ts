import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

// Convert database row to DepenseItem
const rowToDepense = (row: any): DepenseItem => ({
  id: row.id,
  service: row.service,
  operation: row.operation || '',
  date: row.date,
  description: row.description || '',
  montantTTC: Number(row.montant_ttc) || 0,
  fournisseur: row.fournisseur || '',
});

// Convert DepenseItem to database row
const depenseToRow = (depense: Omit<DepenseItem, 'id'>) => ({
  service: depense.service,
  operation: depense.operation,
  date: depense.date,
  description: depense.description,
  montant_ttc: depense.montantTTC,
  fournisseur: depense.fournisseur,
});

export function useDepenses() {
  return useQuery({
    queryKey: ['depenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('depenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(rowToDepense);
    },
  });
}

export function useCreateDepense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (depense: Omit<DepenseItem, 'id'>) => {
      const { data, error } = await supabase
        .from('depenses')
        .insert(depenseToRow(depense))
        .select()
        .single();
      
      if (error) throw error;
      return rowToDepense(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depenses'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la dépense.",
        variant: "destructive",
      });
      console.error('Create depense error:', error);
    },
  });
}

export function useUpdateDepense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...depense }: DepenseItem) => {
      const { data, error } = await supabase
        .from('depenses')
        .update(depenseToRow(depense))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return rowToDepense(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depenses'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la dépense.",
        variant: "destructive",
      });
      console.error('Update depense error:', error);
    },
  });
}

export function useDeleteDepense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('depenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depenses'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la dépense.",
        variant: "destructive",
      });
      console.error('Delete depense error:', error);
    },
  });
}

export function useBulkCreateDepenses() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (depenses: Omit<DepenseItem, 'id'>[]) => {
      const rows = depenses.map(depenseToRow);
      const { data, error } = await supabase
        .from('depenses')
        .insert(rows)
        .select();
      
      if (error) throw error;
      return (data || []).map(rowToDepense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['depenses'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les dépenses.",
        variant: "destructive",
      });
      console.error('Bulk create depenses error:', error);
    },
  });
}
