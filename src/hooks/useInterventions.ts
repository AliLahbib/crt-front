
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interventionService, Intervention } from '@/services/interventionService';
import { useToast } from '@/hooks/use-toast';

export const useInterventions = (familyId?: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: interventions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['interventions', familyId],
    queryFn: () => familyId ? interventionService.getByFamilyId(familyId) : interventionService.getAll(),
    enabled: !!familyId || familyId === 0,
  });

  const createMutation = useMutation({
    mutationFn: interventionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast({
        title: "Succès",
        description: "Intervention créée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'intervention",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Intervention> }) =>
      interventionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast({
        title: "Succès",
        description: "Intervention mise à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'intervention",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: interventionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast({
        title: "Succès",
        description: "Intervention supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'intervention",
        variant: "destructive",
      });
    },
  });

  return {
    interventions,
    isLoading,
    error,
    createIntervention: createMutation.mutate,
    updateIntervention: updateMutation.mutate,
    deleteIntervention: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
