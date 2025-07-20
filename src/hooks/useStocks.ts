
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockService, Stock } from '@/services/stockService';
import { useToast } from '@/hooks/use-toast';

/**
 * 🎯 Hook useStocks - Gestion des stocks avec React Query
 * 
 * Ce hook personnalisé fournit toutes les fonctionnalités nécessaires pour gérer l'inventaire.
 * Il utilise React Query pour :
 * - Mettre en cache les données des stocks
 * - Gérer les états de chargement automatiquement
 * - Synchroniser les données entre les composants
 * - Optimiser les performances avec le cache intelligent
 */
export const useStocks = () => {
  const { toast } = useToast();           // Pour afficher les messages à l'utilisateur
  const queryClient = useQueryClient();   // Pour contrôler le cache React Query

  /**
   * 📋 Query pour récupérer tous les articles en stock
   * 
   * useQuery gère automatiquement :
   * - Le chargement initial
   * - La mise en cache des données
   * - La réactualisation automatique
   * - Les erreurs de réseau
   */
  const {
    data: stocks = [],       // Les articles en stock (tableau vide par défaut)
    isLoading,              // Indique si on est en train de charger
    error,                  // Contient l'erreur s'il y en a une
  } = useQuery({
    queryKey: ['stocks'],           // Identifiant unique dans le cache
    queryFn: stockService.getAll,   // Fonction qui récupère les données
  });

  /**
   * ➕ Mutation pour ajouter un nouvel article
   * 
   * useMutation gère les opérations qui modifient les données.
   * Elle ne s'exécute que quand on appelle mutate() explicitement.
   */
  const createMutation = useMutation({
    mutationFn: stockService.create,    // Fonction qui ajoute l'article
    onSuccess: () => {
      // Actions à faire quand l'ajout réussit :
      
      // 1. Dire à React Query de recharger la liste des stocks
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      
      // 2. Afficher un message de succès vert
      toast({
        title: "Succès",
        description: "Article ajouté avec succès",
      });
    },
    onError: () => {
      // Actions à faire quand l'ajout échoue :
      
      // Afficher un message d'erreur rouge
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de l'article",
        variant: "destructive",  // Style rouge pour les erreurs
      });
    },
  });

  /**
   * ✏️ Mutation pour modifier un article existant
   * 
   * Cette mutation reçoit l'ID de l'article et les nouvelles données.
   * Utile pour mettre à jour les quantités après une distribution.
   */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Stock> }) =>
      stockService.update(id, data),
    onSuccess: () => {
      // Recharger les données et afficher le succès
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      toast({
        title: "Succès",
        description: "Article mis à jour avec succès",
      });
    },
    onError: () => {
      // Afficher l'erreur
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'article",
        variant: "destructive",
      });
    },
  });

  /**
   * 🗑️ Mutation pour supprimer un article
   * 
   * Cette mutation supprime définitivement un article de l'inventaire.
   * À utiliser avec précaution !
   */
  const deleteMutation = useMutation({
    mutationFn: stockService.delete,
    onSuccess: () => {
      // Recharger les données et afficher le succès
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
    },
    onError: () => {
      // Afficher l'erreur
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'article",
        variant: "destructive",
      });
    },
  });

  /**
   * 📤 Retourner tout ce dont les composants ont besoin
   * 
   * Ce hook retourne un objet avec toutes les données et fonctions
   * nécessaires pour gérer les stocks dans l'interface utilisateur.
   */
  return {
    // 📊 Données et états
    stocks,           // Liste de tous les articles
    isLoading,        // true si on charge les données
    error,            // Objet d'erreur s'il y en a une
    
    // 🔧 Fonctions d'action (à utiliser dans les composants)
    createStock: createMutation.mutate,    // Pour ajouter un article
    updateStock: updateMutation.mutate,    // Pour modifier un article
    deleteStock: deleteMutation.mutate,    // Pour supprimer un article
    
    // ⏳ États des actions (pour afficher des spinners)
    isCreating: createMutation.isPending,  // true pendant l'ajout
    isUpdating: updateMutation.isPending,  // true pendant la modification
    isDeleting: deleteMutation.isPending,  // true pendant la suppression
  };
};
