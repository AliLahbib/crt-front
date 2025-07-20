
import { api } from './api';

/**
 * 👨‍👩‍👧‍👦 Interface Family - Structure d'une famille
 * 
 * Cette interface définit tous les champs qu'une famille peut avoir.
 * Une famille représente un foyer qui peut recevoir de l'aide du Croissant Rouge.
 */

export interface Child {
  id?: string;                    // ID unique de l'enfant (optionnel)
  nom: string;                    // Nom de l'enfant
  prenom: string;                 // Prénom de l'enfant
  gender: string;                 // Genre (Masculin/Féminin)
  niveauScolaire: string;         // Niveau scolaire
  notes?: string;                 // Notes optionnelles
}

export interface Family {
  id?: number;                    // ID unique de la famille (optionnel car généré automatiquement)
  name: string;                   // Nom de famille
  
  // Informations du père
  fatherName: string;             // Nom du père
  fatherCIN: string;              // CIN du père
  fatherPhone: string;            // Téléphone du père
  
  // Informations de la mère
  motherName: string;             // Nom de la mère
  motherCIN: string;              // CIN de la mère
  motherPhone: string;            // Téléphone de la mère
  
  // Informations familiales
  maritalStatus: string;          // État matrimonial
  healthCard: string;             // Type de carte de soin (select)
  chronicDisease: boolean;        // Maladie chronique (oui/non)
  chronicDiseaseDetails?: string; // Détails de la maladie chronique
  
  // Adresse et localisation
  zone: string;                   // Zone (El Alia, Khitmin, Hriza, Sidi Ali Chbeb)
  latitude?: number;              // Position Google Maps X
  longitude?: number;             // Position Google Maps Y
  
  contact: string;                // Personne de contact principal (peut être père ou mère)
  address: string;                // Adresse complète (sera composée de la zone + détails)
  members: number;                // Nombre total de membres dans la famille
  children: number;               // Nombre d'enfants
  childrenDetails: Child[];       // Détails des enfants
  status: string;                 // Statut de la famille (Active, En attente, etc.)
  priority: string;               // Niveau de priorité (Haute, Moyenne, Faible)
  registrationDate: string;       // Date d'inscription
  lastHelp: string;               // Date de la dernière aide reçue
  needs: string[];                // Liste des besoins (Alimentaire, Vestimentaire, etc.)
  notes?: string;                 // Notes additionnelles (optionnel)
}

export const familyService = {
  getAll: async (): Promise<Family[]> => {
    console.log('Fetching all families from JSON server...');
    const response = await api.get('/families');
    console.log('Families fetched:', response.data);
    return response.data;
  },

  getById: async (id: number): Promise<Family> => {
    console.log(`Fetching family ${id} from JSON server...`);
    const response = await api.get(`/families/${id}`);
    console.log('Family fetched:', response.data);
    return response.data;
  },

  create: async (family: Omit<Family, 'id'>): Promise<Family> => {
    console.log('Creating family in JSON server:', family);
    const response = await api.post('/families', family);
    console.log('Family created:', response.data);
    return response.data;
  },

  update: async (id: number, family: Partial<Family>): Promise<Family> => {
    console.log(`Updating family ${id} in JSON server:`, family);
    const response = await api.put(`/families/${id}`, family);
    console.log('Family updated:', response.data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    console.log(`Deleting family ${id} from JSON server...`);
    await api.delete(`/families/${id}`);
    console.log('Family deleted');
  },

  search: async (query: string): Promise<Family[]> => {
    console.log(`Searching families with query: ${query}`);
    const response = await api.get(`/families?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  getByPriority: async (priority: string): Promise<Family[]> => {
    console.log(`Filtering families by priority: ${priority}`);
    const response = await api.get(`/families?priority=${priority}`);
    console.log('Filtered families:', response.data);
    return response.data;
  },
};
