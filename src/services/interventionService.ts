
import { api } from './api';

/**
 * 🤝 Interface Intervention - Structure d'une intervention/aide
 * 
 * Cette interface définit tous les champs qu'une intervention peut avoir.
 * Une intervention représente une aide apportée à une famille spécifique.
 */
export interface Intervention {
  id?: number;                    // ID unique de l'intervention (optionnel car généré automatiquement)
  familyId: number;               // ID de la famille qui reçoit l'aide
  type: 'Aide alimentaire' | 'Aide vestimentaire' | 'Aide médicale' | 'Soutien scolaire' | 'Autre'; // Type d'aide
  description: string;            // Description détaillée de l'aide
  date: string;                   // Date de l'intervention
  amount?: number;                // Montant financier (optionnel)
  items?: string[];               // Liste des articles donnés (optionnel)
  status: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée'; // Statut de l'intervention
  volunteer?: string;             // Nom du bénévole responsable (optionnel)
  notes?: string;                 // Notes additionnelles (optionnel)
  createdAt: string;              // Date de création de l'enregistrement
}

/**
 * 🛠️ Service des Interventions
 * 
 * Ce service contient toutes les fonctions pour gérer les interventions/aides.
 * Il communique avec le serveur JSON pour sauvegarder/récupérer les données.
 */
export const interventionService = {
  /**
   * 👨‍👩‍👧‍👦 Récupérer toutes les interventions d'une famille
   * 
   * Cette fonction récupère l'historique complet des aides reçues par une famille.
   * Très utile pour voir l'historique et éviter les doublons.
   * 
   * @param familyId - L'ID de la famille
   * @returns Promise<Intervention[]> - Liste des interventions pour cette famille
   */
  getByFamilyId: async (familyId: number): Promise<Intervention[]> => {
    console.log(`Fetching interventions for family ${familyId} from JSON server...`);
    const response = await api.get(`/interventions?familyId=${familyId}`);
    console.log('Interventions fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer une nouvelle intervention
   * 
   * Cette fonction enregistre une nouvelle aide apportée à une famille.
   * L'ID sera généré automatiquement par le serveur.
   * 
   * @param intervention - Les données de l'intervention (sans l'ID)
   * @returns Promise<Intervention> - L'intervention créée avec son nouvel ID
   */
  create: async (intervention: Omit<Intervention, 'id'>): Promise<Intervention> => {
    console.log('Creating intervention in JSON server:', intervention);
    const response = await api.post('/interventions', intervention);
    console.log('Intervention created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour une intervention existante
   * 
   * Cette fonction modifie les informations d'une intervention existante.
   * Utile pour changer le statut (de "Planifiée" à "Terminée" par exemple).
   * 
   * @param id - L'ID de l'intervention à modifier
   * @param intervention - Les nouvelles données (partielles)
   * @returns Promise<Intervention> - L'intervention mise à jour
   */
  update: async (id: number, intervention: Partial<Intervention>): Promise<Intervention> => {
    console.log(`Updating intervention ${id} in JSON server:`, intervention);
    const response = await api.put(`/interventions/${id}`, intervention);
    console.log('Intervention updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer une intervention
   * 
   * Cette fonction supprime définitivement une intervention de la base de données.
   * À utiliser avec précaution car cela efface l'historique.
   * 
   * @param id - L'ID de l'intervention à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting intervention ${id} from JSON server...`);
    await api.delete(`/interventions/${id}`);
    console.log('Intervention deleted');
  },

  /**
   * 📋 Récupérer toutes les interventions
   * 
   * Cette fonction récupère l'historique complet de toutes les interventions.
   * Utile pour les statistiques et les rapports globaux.
   * 
   * @returns Promise<Intervention[]> - Liste de toutes les interventions
   */
  getAll: async (): Promise<Intervention[]> => {
    console.log('Fetching all interventions from JSON server...');
    const response = await api.get('/interventions');
    console.log('All interventions fetched:', response.data);
    return response.data;
  },
};
