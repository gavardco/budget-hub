import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Operation {
  id: string;
  nom: string;
  description: string;
  budgetPrevu: number;
  depenses: number;
  periode: string;
  statut: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';
}

// Convert database row to Operation
const rowToOperation = (row: any): Operation => ({
  id: row.id,
  nom: row.nom,
  description: row.description || '',
  budgetPrevu: Number(row.budget_prevu) || 0,
  depenses: Number(row.depenses) || 0,
  periode: row.periode || '',
  statut: row.statut as Operation['statut'],
});

// Convert Operation to database row
const operationToRow = (operation: Omit<Operation, 'id'>) => ({
  nom: operation.nom,
  description: operation.description,
  budget_prevu: operation.budgetPrevu,
  depenses: operation.depenses,
  periode: operation.periode,
  statut: operation.statut,
});

export function useOperations() {
  return useQuery({
    queryKey: ['operations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(rowToOperation);
    },
  });
}

export function useCreateOperation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (operation: Omit<Operation, 'id'>) => {
      const { data, error } = await supabase
        .from('operations')
        .insert(operationToRow(operation))
        .select()
        .single();
      
      if (error) throw error;
      return rowToOperation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'opération.",
        variant: "destructive",
      });
      console.error('Create operation error:', error);
    },
  });
}

export function useUpdateOperation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...operation }: Operation) => {
      const { data, error } = await supabase
        .from('operations')
        .update(operationToRow(operation))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return rowToOperation(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'opération.",
        variant: "destructive",
      });
      console.error('Update operation error:', error);
    },
  });
}

export function useDeleteOperation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'opération.",
        variant: "destructive",
      });
      console.error('Delete operation error:', error);
    },
  });
}

export function useBulkCreateOperations() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (operations: Omit<Operation, 'id'>[]) => {
      const rows = operations.map(operationToRow);
      const { data, error } = await supabase
        .from('operations')
        .insert(rows)
        .select();
      
      if (error) throw error;
      return (data || []).map(rowToOperation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error) => {
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les opérations.",
        variant: "destructive",
      });
      console.error('Bulk create operations error:', error);
    },
  });
}
