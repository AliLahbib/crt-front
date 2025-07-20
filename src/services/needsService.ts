
import { api } from './api';

/**
 * 🏷️ Interface Need - Structure d'un besoin
 */
export interface Need {
  id?: number;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 🛠️ Service des Besoins
 */
export const needsService = {
  /**
   * 📋 Récupérer tous les besoins
   */
  getAll: async (): Promise<Need[]> => {
    console.log('Fetching all needs from JSON server...');
    const response = await api.get('/needs');
    console.log('Needs fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un besoin par son ID
   */
  getById: async (id: number): Promise<Need> => {
    console.log(`Fetching need ${id} from JSON server...`);
    const response = await api.get(`/needs/${id}`);
    console.log('Need fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouveau besoin
   */
  create: async (need: Omit<Need, 'id'>): Promise<Need> => {
    console.log('Creating need in JSON server:', need);
    const response = await api.post('/needs', need);
    console.log('Need created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un besoin existant
   */
  update: async (id: number, need: Partial<Need>): Promise<Need> => {
    console.log(`Updating need ${id} in JSON server:`, need);
    const response = await api.put(`/needs/${id}`, need);
    console.log('Need updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un besoin
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting need ${id} from JSON server...`);
    await api.delete(`/needs/${id}`);
    console.log('Need deleted');
  },

  /**
   * 🏷️ Récupérer les besoins actifs seulement
   */
  getActive: async (): Promise<Need[]> => {
    console.log('Fetching active needs from JSON server...');
    const response = await api.get('/needs?isActive=true');
    console.log('Active needs fetched:', response.data);
    return response.data;
  },

  /**
   * 📂 Récupérer les besoins par catégorie
   */
  getByCategory: async (category: string): Promise<Need[]> => {
    console.log(`Fetching needs by category: ${category}`);
    const response = await api.get(`/needs?category=${category}`);
    console.log('Category needs fetched:', response.data);
    return response.data;
  },
};
