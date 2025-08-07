
import { api } from './api';

/**
 * 🆘 Interface Need - Structure d'un besoin
 * 
 * Cette interface définit tous les champs qu'un besoin peut avoir.
 * Un besoin représente une demande d'aide spécifique.
 */
export interface Need {
  id?: number;                    // ID unique du besoin (optionnel car généré automatiquement)
  title: string;                  // Titre du besoin
  description: string;            // Description détaillée
  category: string;               // Catégorie (Alimentaire, Vestimentaire, Médical, etc.)
  priority: 'Haute' | 'Moyenne' | 'Faible'; // Niveau de priorité
  status: 'Actif' | 'Inactif' | 'Résolu'; // Statut du besoin
  familyId?: number;              // ID de la famille concernée (optionnel)
  volunteerId?: number;           // ID du bénévole assigné (optionnel)
  createdAt: string;              // Date de création
  updatedAt: string;              // Date de dernière mise à jour
  deadline?: string;              // Date limite (optionnel)
  estimatedCost?: number;         // Coût estimé (optionnel)
  notes?: string;                 // Notes additionnelles (optionnel)
}

/**
 * 🛠️ Service des Besoins
 * 
 * Ce service contient toutes les fonctions pour gérer les besoins.
 * Il communique avec l'API Symfony pour sauvegarder/récupérer les données.
 */
export const needsService = {
  /**
   * 📋 Récupérer tous les besoins
   * 
   * @returns Promise<Need[]> - Liste de tous les besoins
   */
  getAll: async (): Promise<Need[]> => {
    console.log('Fetching all needs from Symfony API...');
    const response = await api.get('/needs');
    console.log('Needs fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un besoin par son ID
   * 
   * @param id - L'ID du besoin à récupérer
   * @returns Promise<Need> - Le besoin trouvé
   */
  getById: async (id: number): Promise<Need> => {
    console.log(`Fetching need ${id} from Symfony API...`);
    const response = await api.get(`/needs/${id}`);
    console.log('Need fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouveau besoin
   * 
   * @param need - Les données du besoin (sans l'ID)
   * @returns Promise<Need> - Le besoin créé avec son nouvel ID
   */
  create: async (need: Omit<Need, 'id'>): Promise<Need> => {
    console.log('Creating need in Symfony API:', need);
    const response = await api.post('/needs', need);
    console.log('Need created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un besoin existant
   * 
   * @param id - L'ID du besoin à modifier
   * @param need - Les nouvelles données (partielles)
   * @returns Promise<Need> - Le besoin mis à jour
   */
  update: async (id: number, need: Partial<Need>): Promise<Need> => {
    console.log(`Updating need ${id} in Symfony API:`, need);
    const response = await api.put(`/needs/${id}`, need);
    console.log('Need updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un besoin
   * 
   * @param id - L'ID du besoin à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting need ${id} from Symfony API...`);
    await api.delete(`/needs/${id}`);
    console.log('Need deleted');
  },

  /**
   * ✅ Obtenir les besoins actifs
   * 
   * @returns Promise<Need[]> - Liste des besoins actifs
   */
  getActive: async (): Promise<Need[]> => {
    console.log('Fetching active needs from Symfony API...');
    const response = await api.get('/needs/active');
    console.log('Active needs:', response.data);
    return response.data;
  },

  /**
   * ❌ Obtenir les besoins inactifs
   * 
   * @returns Promise<Need[]> - Liste des besoins inactifs
   */
  getInactive: async (): Promise<Need[]> => {
    console.log('Fetching inactive needs from Symfony API...');
    const response = await api.get('/needs/inactive');
    console.log('Inactive needs:', response.data);
    return response.data;
  },

  /**
   * 🔄 Activer un besoin
   * 
   * @param id - L'ID du besoin
   * @returns Promise<Need> - Le besoin mis à jour
   */
  activate: async (id: number): Promise<Need> => {
    console.log(`Activating need ${id}...`);
    const response = await api.put(`/needs/${id}/activate`);
    console.log('Need activated:', response.data);
    return response.data;
  },

  /**
   * 🔄 Désactiver un besoin
   * 
   * @param id - L'ID du besoin
   * @returns Promise<Need> - Le besoin mis à jour
   */
  deactivate: async (id: number): Promise<Need> => {
    console.log(`Deactivating need ${id}...`);
    const response = await api.put(`/needs/${id}/deactivate`);
    console.log('Need deactivated:', response.data);
    return response.data;
  },

  /**
   * 🏷️ Filtrer les besoins par catégorie
   * 
   * @param category - La catégorie à filtrer
   * @returns Promise<Need[]> - Liste des besoins de cette catégorie
   */
  getByCategory: async (category: string): Promise<Need[]> => {
    console.log(`Filtering needs by category: ${category}`);
    const response = await api.get(`/needs/category/${category}`);
    console.log('Filtered needs:', response.data);
    return response.data;
  },

  /**
   * 🔍 Rechercher des besoins
   * 
   * @param query - Le terme à rechercher
   * @returns Promise<Need[]> - Liste des besoins correspondants
   */
  search: async (query: string): Promise<Need[]> => {
    console.log(`Searching needs with query: ${query}`);
    const response = await api.get(`/needs/search?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  /**
   * 📊 Obtenir les besoins par priorité
   * 
   * @returns Promise<Need[]> - Liste des besoins triés par priorité
   */
  getByPriority: async (): Promise<Need[]> => {
    console.log('Fetching needs by priority from Symfony API...');
    const response = await api.get('/needs/by-priority');
    console.log('Needs by priority:', response.data);
    return response.data;
  },

  /**
   * 📅 Obtenir les besoins récents
   * 
   * @param days - Nombre de jours pour "récent"
   * @returns Promise<Need[]> - Liste des besoins récents
   */
  getRecent: async (days: number = 30): Promise<Need[]> => {
    console.log(`Fetching recent needs (${days} days) from Symfony API...`);
    const response = await api.get(`/needs/recent?days=${days}`);
    console.log('Recent needs:', response.data);
    return response.data;
  },

  /**
   * 📈 Obtenir les besoins les plus demandés
   * 
   * @returns Promise<Need[]> - Liste des besoins les plus demandés
   */
  getMostRequested: async (): Promise<Need[]> => {
    console.log('Fetching most requested needs from Symfony API...');
    const response = await api.get('/needs/most-requested');
    console.log('Most requested needs:', response.data);
    return response.data;
  },

  /**
   * 📅 Obtenir les besoins par période
   * 
   * @param start - Date de début
   * @param end - Date de fin
   * @returns Promise<Need[]> - Liste des besoins dans cette période
   */
  getByPeriod: async (start: string, end: string): Promise<Need[]> => {
    console.log(`Filtering needs by period: ${start} to ${end}`);
    const response = await api.get(`/needs/by-period?start=${start}&end=${end}`);
    console.log('Filtered needs:', response.data);
    return response.data;
  },

  /**
   * 📅 Obtenir les besoins mis à jour récemment
   * 
   * @param days - Nombre de jours pour "récemment"
   * @returns Promise<Need[]> - Liste des besoins mis à jour récemment
   */
  getRecentlyUpdated: async (days: number = 7): Promise<Need[]> => {
    console.log(`Fetching recently updated needs (${days} days) from Symfony API...`);
    const response = await api.get(`/needs/recently-updated?days=${days}`);
    console.log('Recently updated needs:', response.data);
    return response.data;
  },

  /**
   * 📊 Obtenir les besoins par type de catégorie
   * 
   * @returns Promise<any> - Les besoins groupés par type de catégorie
   */
  getByCategoryType: async (): Promise<any> => {
    console.log('Fetching needs by category type from Symfony API...');
    const response = await api.get('/needs/by-category-type');
    console.log('Needs by category type:', response.data);
    return response.data;
  },

  /**
   * 📊 Obtenir les statistiques des besoins
   * 
   * @returns Promise<any> - Les statistiques
   */
  getStats: async (): Promise<any> => {
    console.log('Fetching need stats from Symfony API...');
    const response = await api.get('/needs/stats');
    console.log('Need stats:', response.data);
    return response.data;
  }
};
