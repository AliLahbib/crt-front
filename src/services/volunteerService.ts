
import { api } from './api';

/**
 * 👥 Interface Volunteer - Structure d'un bénévole
 * 
 * Cette interface définit tous les champs qu'un bénévole peut avoir.
 * TypeScript utilise cette interface pour vérifier que nos données sont correctes.
 */
export interface Volunteer {
  id?: number;                    // ID unique du bénévole (optionnel car généré automatiquement)
  firstName: string;              // Prénom
  lastName: string;               // Nom de famille
  email: string;                  // Adresse email
  phone: string;                  // Numéro de téléphone
  address: string;                // Adresse complète
  role: string;                   // Rôle/poste dans l'organisation
  skills: string[];               // Liste des compétences
  status: 'Actif' | 'Inactif' | 'Suspendu';  // Statut du bénévole
  availability: string;           // Disponibilité (Disponible, En mission, etc.)
  joinDate: string;               // Date d'adhésion
  notes?: string;                 // Notes additionnelles (optionnel)
}

/**
 * 📊 Interface pour les statistiques des bénévoles
 * 
 * Cette interface définit la structure des statistiques qu'on calcule.
 */
export interface VolunteerStats {
  total: number;          // Nombre total de bénévoles
  actifs: number;         // Nombre de bénévoles actifs
  disponibles: number;    // Nombre de bénévoles disponibles
  enMission: number;      // Nombre de bénévoles en mission
  indisponibles: number;  // Nombre de bénévoles indisponibles
}

/**
 * 🛠️ Service des Bénévoles
 * 
 * Ce service contient toutes les fonctions pour gérer les bénévoles.
 * Il communique avec l'API Symfony pour sauvegarder/récupérer les données.
 */
export const volunteerService = {
  /**
   * 📋 Récupérer tous les bénévoles
   * 
   * Cette fonction fait une requête GET pour obtenir la liste complète des bénévoles.
   * 
   * @returns Promise<Volunteer[]> - Liste de tous les bénévoles
   */
  getAll: async (): Promise<Volunteer[]> => {
    console.log('Fetching all volunteers from Symfony API...');
    const response = await api.get('/volunteers');
    console.log('Volunteers fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un bénévole par son ID
   * 
   * Cette fonction trouve un bénévole spécifique grâce à son ID unique.
   * 
   * @param id - L'ID du bénévole à récupérer
   * @returns Promise<Volunteer> - Le bénévole trouvé
   */
  getById: async (id: number): Promise<Volunteer> => {
    console.log(`Fetching volunteer ${id} from Symfony API...`);
    const response = await api.get(`/volunteers/${id}`);
    console.log('Volunteer fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouveau bénévole
   * 
   * Cette fonction ajoute un nouveau bénévole dans la base de données.
   * L'ID sera généré automatiquement par le serveur.
   * 
   * @param volunteer - Les données du bénévole (sans l'ID)
   * @returns Promise<Volunteer> - Le bénévole créé avec son nouvel ID
   */
  create: async (volunteer: Omit<Volunteer, 'id'>): Promise<Volunteer> => {
    console.log('Creating volunteer in Symfony API:', volunteer);
    const response = await api.post('/volunteers', volunteer);
    console.log('Volunteer created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un bénévole existant
   * 
   * Cette fonction modifie les informations d'un bénévole existant.
   * On peut modifier seulement certains champs grâce à Partial<Volunteer>.
   * 
   * @param id - L'ID du bénévole à modifier
   * @param volunteer - Les nouvelles données (partielles)
   * @returns Promise<Volunteer> - Le bénévole mis à jour
   */
  update: async (id: number, volunteer: Partial<Volunteer>): Promise<Volunteer> => {
    console.log(`Updating volunteer ${id} in Symfony API:`, volunteer);
    const response = await api.put(`/volunteers/${id}`, volunteer);
    console.log('Volunteer updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un bénévole
   * 
   * Cette fonction supprime définitivement un bénévole de la base de données.
   * 
   * @param id - L'ID du bénévole à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting volunteer ${id} from Symfony API...`);
    await api.delete(`/volunteers/${id}`);
    console.log('Volunteer deleted');
  },

  /**
   * 🔎 Rechercher des bénévoles
   * 
   * Cette fonction recherche des bénévoles selon un terme de recherche.
   * La recherche se fait dans le nom, prénom, email, etc.
   * 
   * @param query - Le terme à rechercher
   * @returns Promise<Volunteer[]> - Liste des bénévoles correspondants
   */
  search: async (query: string): Promise<Volunteer[]> => {
    console.log(`Searching volunteers with query: ${query}`);
    const response = await api.get(`/volunteers/search?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  /**
   * 📊 Filtrer les bénévoles par statut
   * 
   * Cette fonction récupère seulement les bénévoles avec un statut spécifique
   * (Actif, Inactif, Suspendu).
   * 
   * @param status - Le statut à filtrer
   * @returns Promise<Volunteer[]> - Liste des bénévoles avec ce statut
   */
  getByStatus: async (status: string): Promise<Volunteer[]> => {
    console.log(`Filtering volunteers by status: ${status}`);
    const response = await api.get(`/volunteers/status/${status}`);
    console.log('Filtered volunteers:', response.data);
    return response.data;
  },

  /**
   * 📈 Récupérer les statistiques des bénévoles
   * 
   * Cette fonction récupère les statistiques calculées côté serveur.
   * 
   * @returns Promise<VolunteerStats> - Les statistiques calculées
   */
  getStats: async (): Promise<VolunteerStats> => {
    console.log('Fetching volunteer stats from Symfony API...');
    const response = await api.get('/volunteers/stats');
    console.log('Volunteer stats fetched:', response.data);
    return response.data;
  },

  /**
   * 🔄 Changer le statut d'un bénévole
   * 
   * @param id - L'ID du bénévole
   * @param status - Le nouveau statut
   * @returns Promise<Volunteer> - Le bénévole mis à jour
   */
  changeStatus: async (id: number, status: string): Promise<Volunteer> => {
    console.log(`Changing status for volunteer ${id} to: ${status}`);
    const response = await api.put(`/volunteers/${id}/status`, { status });
    console.log('Status changed:', response.data);
    return response.data;
  },

  /**
   * 📅 Changer la disponibilité d'un bénévole
   * 
   * @param id - L'ID du bénévole
   * @param availability - La nouvelle disponibilité
   * @returns Promise<Volunteer> - Le bénévole mis à jour
   */
  changeAvailability: async (id: number, availability: string): Promise<Volunteer> => {
    console.log(`Changing availability for volunteer ${id} to: ${availability}`);
    const response = await api.put(`/volunteers/${id}/availability`, { availability });
    console.log('Availability changed:', response.data);
    return response.data;
  },

  /**
   * 🎯 Récupérer les bénévoles disponibles pour mission
   * 
   * @returns Promise<Volunteer[]> - Liste des bénévoles disponibles
   */
  getAvailable: async (): Promise<Volunteer[]> => {
    console.log('Fetching available volunteers from Symfony API...');
    const response = await api.get('/volunteers/available');
    console.log('Available volunteers:', response.data);
    return response.data;
  }
};
