
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyService, Family } from '@/services/familyService';
import { useToast } from '@/hooks/use-toast';

export const useFamilies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: families = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['families'],
    queryFn: familyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: familyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: "Succès",
        description: "Famille ajoutée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la famille",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Family> }) =>
      familyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: "Succès",
        description: "Famille mise à jour avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la famille",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: familyService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast({
        title: "Succès",
        description: "Famille supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la famille",
        variant: "destructive",
      });
    },
  });

  return {
    families,
    isLoading,
    error,
    createFamily: createMutation.mutate,
    updateFamily: updateMutation.mutate,
    deleteFamily: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
