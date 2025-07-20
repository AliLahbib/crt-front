
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, Event } from '@/services/eventService';
import { useToast } from '@/hooks/use-toast';

/**
 * 🎯 Hook useEvents - Gestion des événements avec React Query
 * 
 * Ce hook personnalisé fournit toutes les fonctionnalités nécessaires pour gérer les événements.
 * Il utilise React Query pour :
 * - Mettre en cache les données
 * - Gérer les états de chargement
 * - Synchroniser automatiquement les données
 * - Optimiser les performances
 */
export const useEvents = () => {
  const { toast } = useToast();           // Pour afficher les notifications
  const queryClient = useQueryClient();   // Pour gérer le cache React Query

  /**
   * 📋 Query pour récupérer tous les événements
   * 
   * useQuery est utilisé pour les opérations de lecture (GET).
   * Il met automatiquement en cache les données et les actualise quand nécessaire.
   */
  const {
    data: events = [],        // Les données récupérées (liste vide par défaut)
    isLoading,               // État de chargement (true pendant la requête)
    error,                   // Erreur s'il y en a une
  } = useQuery({
    queryKey: ['events'],           // Clé unique pour identifier cette query dans le cache
    queryFn: eventService.getAll,   // Fonction qui fait la requête au serveur
  });

  /**
   * ➕ Mutation pour créer un nouvel événement
   * 
   * useMutation est utilisé pour les opérations d'écriture (POST, PUT, DELETE).
   * Il ne se déclenche que quand on appelle mutate().
   */
  const createMutation = useMutation({
    mutationFn: eventService.create,    // Fonction qui crée l'événement
    onSuccess: () => {
      // Quand la création réussit :
      // 1. Actualiser la liste des événements dans le cache
      queryClient.invalidateQueries({ queryKey: ['events'] });
      // 2. Afficher une notification de succès
      toast({
        title: "Succès",
        description: "Événement créé avec succès",
      });
    },
    onError: () => {
      // Quand la création échoue :
      // Afficher une notification d'erreur
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'événement",
        variant: "destructive",
      });
    },
  });

  /**
   * ✏️ Mutation pour mettre à jour un événement
   * 
   * Cette mutation accepte un objet avec l'ID et les nouvelles données.
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Event> }) =>
      eventService.update(id, data),
    onSuccess: () => {
      // Actualiser le cache et afficher le succès
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Succès",
        description: "Événement mis à jour avec succès",
      });
    },
    onError: () => {
      // Afficher l'erreur
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'événement",
        variant: "destructive",
      });
    },
  });

  /**
   * 🗑️ Mutation pour supprimer un événement
   * 
   * Cette mutation accepte seulement l'ID de l'événement à supprimer.
   */
  const deleteMutation = useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => {
      // Actualiser le cache et afficher le succès
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Succès",
        description: "Événement supprimé avec succès",
      });
    },
    onError: () => {
      // Afficher l'erreur
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'événement",
        variant: "destructive",
      });
    },
  });

  /**
   * 📤 Retourner toutes les données et fonctions nécessaires
   * 
   * Le hook retourne un objet avec :
   * - Les données (events)
   * - Les états (isLoading, error)
   * - Les fonctions d'action (createEvent, updateEvent, deleteEvent)
   * - Les états des mutations (isCreating, isUpdating, isDeleting)
   */
  return {
    // 📊 Données
    events,           // Liste des événements
    isLoading,        // Est-ce qu'on charge les données ?
    error,            // Y a-t-il une erreur ?
    
    // 🔧 Actions CRUD (Create, Read, Update, Delete)
    createEvent: createMutation.mutate,    // Fonction pour créer un événement
    updateEvent: updateMutation.mutate,    // Fonction pour modifier un événement
    deleteEvent: deleteMutation.mutate,    // Fonction pour supprimer un événement
    
    // ⏳ États des actions
    isCreating: createMutation.isPending,  // Est-ce qu'on crée un événement ?
    isUpdating: updateMutation.isPending,  // Est-ce qu'on modifie un événement ?
    isDeleting: deleteMutation.isPending,  // Est-ce qu'on supprime un événement ?
  };
};
