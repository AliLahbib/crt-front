
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { needsService, Need } from '@/services/needsService';
import { useToast } from '@/hooks/use-toast';

export const useNeeds = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: needs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['needs'],
    queryFn: needsService.getAll,
  });

  const {
    data: activeNeeds = [],
    isLoading: isLoadingActive,
  } = useQuery({
    queryKey: ['needs', 'active'],
    queryFn: needsService.getActive,
  });

  const createMutation = useMutation({
    mutationFn: needsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      toast({
        title: "Succès",
        description: "Besoin ajouté avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du besoin",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Need> }) =>
      needsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      toast({
        title: "Succès",
        description: "Besoin mis à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du besoin",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: needsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      toast({
        title: "Succès",
        description: "Besoin supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du besoin",
        variant: "destructive",
      });
    },
  });

  return {
    needs,
    activeNeeds,
    isLoading,
    isLoadingActive,
    error,
    createNeed: createMutation.mutate,
    updateNeed: updateMutation.mutate,
    deleteNeed: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
