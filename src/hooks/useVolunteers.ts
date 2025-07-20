
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { volunteerService, Volunteer } from '@/services/volunteerService';
import { useToast } from '@/hooks/use-toast';

// Type pour les statistiques
export interface VolunteerStats {
  total: number;
  actifs: number;
  disponibles: number;
  enMission: number;
  indisponibles: number;
}

export const useVolunteers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query pour récupérer tous les bénévoles
  const {
    data: volunteers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['volunteers'],
    queryFn: volunteerService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query pour les statistiques
  const {
    data: stats,
    isLoading: isLoadingStats
  } = useQuery<VolunteerStats>({
    queryKey: ['volunteer-stats'],
    queryFn: volunteerService.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mutation pour créer un bénévole
  const createMutation = useMutation({
    mutationFn: volunteerService.create,
    onSuccess: (newVolunteer) => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['volunteer-stats'] });
      toast({
        title: "Succès",
        description: `Bénévole ${newVolunteer.firstName} ${newVolunteer.lastName} créé avec succès`,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du bénévole",
        variant: "destructive",
      });
    },
  });

  // Mutation pour mettre à jour un bénévole
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Volunteer> }) =>
      volunteerService.update(id, data),
    onSuccess: (updatedVolunteer) => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['volunteer-stats'] });
      toast({
        title: "Succès",
        description: `Bénévole ${updatedVolunteer.firstName} ${updatedVolunteer.lastName} mis à jour avec succès`,
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du bénévole",
        variant: "destructive",
      });
    },
  });

  // Mutation pour supprimer un bénévole
  const deleteMutation = useMutation({
    mutationFn: volunteerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      queryClient.invalidateQueries({ queryKey: ['volunteer-stats'] });
      toast({
        title: "Succès",
        description: "Bénévole supprimé avec succès",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du bénévole",
        variant: "destructive",
      });
    },
  });

  // Fonction utilitaire pour rechercher
  const searchVolunteers = async (query: string) => {
    try {
      return await volunteerService.search(query);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    // Données
    volunteers,
    stats,
    
    // États de chargement
    isLoading,
    isLoadingStats,
    error,
    
    // Actions CRUD
    createVolunteer: createMutation.mutate,
    updateVolunteer: updateMutation.mutate,
    deleteVolunteer: deleteMutation.mutate,
    
    // États des mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Fonctions utilitaires
    refetch,
    searchVolunteers,
    
    // Erreurs des mutations
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
};

// Hook pour récupérer un bénévole spécifique
export const useVolunteer = (id: number) => {
  return useQuery({
    queryKey: ['volunteer', id],
    queryFn: () => volunteerService.getById(id),
    enabled: !!id,
  });
};
