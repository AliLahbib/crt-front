
import { api } from './api';

/**
 * 🚑 Interface Intervention - Structure d'une intervention
 * 
 * Cette interface définit tous les champs qu'une intervention peut avoir.
 * Une intervention représente une aide apportée à une famille.
 */
export interface Intervention {
  id?: number;                    // ID unique de l'intervention (optionnel car généré automatiquement)
  familyId: number;               // ID de la famille aidée
  volunteerId?: number;           // ID du bénévole assigné (optionnel)
  type: string;                   // Type d'intervention (Alimentaire, Vestimentaire, Médical, etc.)
  status: 'En cours' | 'Terminée' | 'Annulée' | 'En attente'; // Statut de l'intervention
  date: string;                   // Date de l'intervention
  amount: number;                 // Montant de l'aide
  description: string;            // Description détaillée
  notes?: string;                 // Notes additionnelles (optionnel)
}

/**
 * 🛠️ Service des Interventions
 * 
 * Ce service contient toutes les fonctions pour gérer les interventions.
 * Il communique avec l'API Symfony pour sauvegarder/récupérer les données.
 */
export const interventionService = {
  /**
   * 📋 Récupérer toutes les interventions
   * 
   * @returns Promise<Intervention[]> - Liste de toutes les interventions
   */
  getAll: async (): Promise<Intervention[]> => {
    console.log('Fetching all interventions from Symfony API...');
    const response = await api.get('/interventions');
    console.log('Interventions fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer une intervention par son ID
   * 
   * @param id - L'ID de l'intervention à récupérer
   * @returns Promise<Intervention> - L'intervention trouvée
   */
  getById: async (id: number): Promise<Intervention> => {
    console.log(`Fetching intervention ${id} from Symfony API...`);
    const response = await api.get(`/interventions/${id}`);
    console.log('Intervention fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer une nouvelle intervention
   * 
   * @param intervention - Les données de l'intervention (sans l'ID)
   * @returns Promise<Intervention> - L'intervention créée avec son nouvel ID
   */
  create: async (intervention: Omit<Intervention, 'id'>): Promise<Intervention> => {
    console.log('Creating intervention in Symfony API:', intervention);
    const response = await api.post('/interventions', intervention);
    console.log('Intervention created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour une intervention existante
   * 
   * @param id - L'ID de l'intervention à modifier
   * @param intervention - Les nouvelles données (partielles)
   * @returns Promise<Intervention> - L'intervention mise à jour
   */
  update: async (id: number, intervention: Partial<Intervention>): Promise<Intervention> => {
    console.log(`Updating intervention ${id} in Symfony API:`, intervention);
    const response = await api.put(`/interventions/${id}`, intervention);
    console.log('Intervention updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer une intervention
   * 
   * @param id - L'ID de l'intervention à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting intervention ${id} from Symfony API...`);
    await api.delete(`/interventions/${id}`);
    console.log('Intervention deleted');
  },

  /**
   * 👨‍👩‍👧‍👦 Obtenir les interventions d'une famille
   * 
   * @param familyId - L'ID de la famille
   * @returns Promise<Intervention[]> - Liste des interventions de cette famille
   */
  getByFamily: async (familyId: number): Promise<Intervention[]> => {
    console.log(`Fetching interventions for family ${familyId} from Symfony API...`);
    const response = await api.get(`/interventions/family/${familyId}`);
    console.log('Family interventions:', response.data);
    return response.data;
  },

  /**
   * 📊 Filtrer les interventions par statut
   * 
   * @param status - Le statut à filtrer
   * @returns Promise<Intervention[]> - Liste des interventions avec ce statut
   */
  getByStatus: async (status: string): Promise<Intervention[]> => {
    console.log(`Filtering interventions by status: ${status}`);
    const response = await api.get(`/interventions/status/${status}`);
    console.log('Filtered interventions:', response.data);
    return response.data;
  },

  /**
   * 🏷️ Filtrer les interventions par type
   * 
   * @param type - Le type à filtrer
   * @returns Promise<Intervention[]> - Liste des interventions de ce type
   */
  getByType: async (type: string): Promise<Intervention[]> => {
    console.log(`Filtering interventions by type: ${type}`);
    const response = await api.get(`/interventions/type/${type}`);
    console.log('Filtered interventions:', response.data);
    return response.data;
  },

  /**
   * 📅 Filtrer les interventions par date
   * 
   * @param date - La date à filtrer
   * @returns Promise<Intervention[]> - Liste des interventions à cette date
   */
  getByDate: async (date: string): Promise<Intervention[]> => {
    console.log(`Filtering interventions by date: ${date}`);
    const response = await api.get(`/interventions/date/${date}`);
    console.log('Filtered interventions:', response.data);
    return response.data;
  },

  /**
   * 📅 Filtrer les interventions par période
   * 
   * @param start - Date de début
   * @param end - Date de fin
   * @returns Promise<Intervention[]> - Liste des interventions dans cette période
   */
  getByPeriod: async (start: string, end: string): Promise<Intervention[]> => {
    console.log(`Filtering interventions by period: ${start} to ${end}`);
    const response = await api.get(`/interventions/period?start=${start}&end=${end}`);
    console.log('Filtered interventions:', response.data);
    return response.data;
  },

  /**
   * 🔄 Changer le statut d'une intervention
   * 
   * @param id - L'ID de l'intervention
   * @param status - Le nouveau statut
   * @returns Promise<Intervention> - L'intervention mise à jour
   */
  changeStatus: async (id: number, status: string): Promise<Intervention> => {
    console.log(`Changing status for intervention ${id} to: ${status}`);
    const response = await api.put(`/interventions/${id}/status`, { status });
    console.log('Status changed:', response.data);
    return response.data;
  },

  /**
   * 👤 Assigner un bénévole à une intervention
   * 
   * @param id - L'ID de l'intervention
   * @param volunteerId - L'ID du bénévole
   * @returns Promise<Intervention> - L'intervention mise à jour
   */
  assignVolunteer: async (id: number, volunteerId: number): Promise<Intervention> => {
    console.log(`Assigning volunteer ${volunteerId} to intervention ${id}`);
    const response = await api.put(`/interventions/${id}/volunteer`, { volunteerId });
    console.log('Volunteer assigned:', response.data);
    return response.data;
  },

  /**
   * 📊 Obtenir les statistiques des interventions
   * 
   * @returns Promise<any> - Les statistiques
   */
  getStats: async (): Promise<any> => {
    console.log('Fetching intervention stats from Symfony API...');
    const response = await api.get('/interventions/stats');
    console.log('Intervention stats:', response.data);
    return response.data;
  },

  /**
   * ⚠️ Obtenir les interventions urgentes
   * 
   * @returns Promise<Intervention[]> - Liste des interventions urgentes
   */
  getUrgent: async (): Promise<Intervention[]> => {
    console.log('Fetching urgent interventions from Symfony API...');
    const response = await api.get('/interventions/urgent');
    console.log('Urgent interventions:', response.data);
    return response.data;
  },

  /**
   * ⏰ Obtenir les interventions en retard
   * 
   * @returns Promise<Intervention[]> - Liste des interventions en retard
   */
  getOverdue: async (): Promise<Intervention[]> => {
    console.log('Fetching overdue interventions from Symfony API...');
    const response = await api.get('/interventions/overdue');
    console.log('Overdue interventions:', response.data);
    return response.data;
  },

  /**
   * 💰 Obtenir le montant total pour une famille
   * 
   * @param familyId - L'ID de la famille
   * @returns Promise<number> - Le montant total
   */
  getTotalForFamily: async (familyId: number): Promise<number> => {
    console.log(`Fetching total amount for family ${familyId} from Symfony API...`);
    const response = await api.get(`/interventions/family/${familyId}/total`);
    console.log('Total amount:', response.data);
    return response.data.total;
  },

  /**
   * 📜 Obtenir l'historique d'une famille
   * 
   * @param familyId - L'ID de la famille
   * @returns Promise<Intervention[]> - L'historique des interventions
   */
  getFamilyHistory: async (familyId: number): Promise<Intervention[]> => {
    console.log(`Fetching history for family ${familyId} from Symfony API...`);
    const response = await api.get(`/interventions/family/${familyId}/history`);
    console.log('Family history:', response.data);
    return response.data;
  }
};
