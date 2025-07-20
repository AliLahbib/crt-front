
import { api } from './api';

/**
 * 📦 Interface Stock - Structure d'un article en stock
 * 
 * Cette interface définit tous les champs qu'un article peut avoir.
 * Un stock représente les articles disponibles (nourriture, vêtements, etc.).
 */
export interface Stock {
  id?: number;                    // ID unique de l'article (optionnel car généré automatiquement)
  name: string;                   // Nom de l'article
  category: string;               // Catégorie (Alimentaire, Vestimentaire, Médical, etc.)
  quantity: number;               // Quantité actuelle en stock
  unit: string;                   // Unité de mesure (kg, pièces, litres, etc.)
  minQuantity: number;            // Quantité minimale (seuil d'alerte)
  location: string;               // Emplacement de stockage
  expirationDate?: string;        // Date d'expiration (optionnel)
  status: 'Disponible' | 'Faible' | 'Épuisé' | 'Expiré'; // Statut du stock
  lastUpdated: string;            // Dernière mise à jour
  notes?: string;                 // Notes additionnelles (optionnel)
}

/**
 * 🛠️ Service des Stocks
 * 
 * Ce service contient toutes les fonctions pour gérer l'inventaire.
 * Il communique avec le serveur JSON pour sauvegarder/récupérer les données.
 */
export const stockService = {
  /**
   * 📋 Récupérer tous les articles en stock
   * 
   * Cette fonction fait une requête GET pour obtenir l'inventaire complet.
   * 
   * @returns Promise<Stock[]> - Liste de tous les articles
   */
  getAll: async (): Promise<Stock[]> => {
    console.log('Fetching all stocks from JSON server...');
    const response = await api.get('/stocks');
    console.log('Stocks fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un article par son ID
   * 
   * Cette fonction trouve un article spécifique grâce à son ID unique.
   * 
   * @param id - L'ID de l'article à récupérer
   * @returns Promise<Stock> - L'article trouvé
   */
  getById: async (id: number): Promise<Stock> => {
    console.log(`Fetching stock ${id} from JSON server...`);
    const response = await api.get(`/stocks/${id}`);
    console.log('Stock fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouvel article
   * 
   * Cette fonction ajoute un nouvel article dans l'inventaire.
   * L'ID sera généré automatiquement par le serveur.
   * 
   * @param stock - Les données de l'article (sans l'ID)
   * @returns Promise<Stock> - L'article créé avec son nouvel ID
   */
  create: async (stock: Omit<Stock, 'id'>): Promise<Stock> => {
    console.log('Creating stock in JSON server:', stock);
    const response = await api.post('/stocks', stock);
    console.log('Stock created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un article existant
   * 
   * Cette fonction modifie les informations d'un article existant.
   * Utile pour mettre à jour les quantités après une distribution.
   * 
   * @param id - L'ID de l'article à modifier
   * @param stock - Les nouvelles données (partielles)
   * @returns Promise<Stock> - L'article mis à jour
   */
  update: async (id: number, stock: Partial<Stock>): Promise<Stock> => {
    console.log(`Updating stock ${id} in JSON server:`, stock);
    const response = await api.put(`/stocks/${id}`, stock);
    console.log('Stock updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un article
   * 
   * Cette fonction supprime définitivement un article de l'inventaire.
   * 
   * @param id - L'ID de l'article à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting stock ${id} from JSON server...`);
    await api.delete(`/stocks/${id}`);
    console.log('Stock deleted');
  },

  /**
   * 🔎 Rechercher des articles
   * 
   * Cette fonction recherche des articles selon un terme de recherche.
   * La recherche se fait dans le nom, la catégorie, etc.
   * 
   * @param query - Le terme à rechercher
   * @returns Promise<Stock[]> - Liste des articles correspondants
   */
  search: async (query: string): Promise<Stock[]> => {
    console.log(`Searching stocks with query: ${query}`);
    const response = await api.get(`/stocks?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  /**
   * 🏷️ Filtrer les articles par catégorie
   * 
   * Cette fonction récupère seulement les articles d'une catégorie spécifique
   * (Alimentaire, Vestimentaire, Médical, etc.).
   * 
   * @param category - La catégorie à filtrer
   * @returns Promise<Stock[]> - Liste des articles de cette catégorie
   */
  getByCategory: async (category: string): Promise<Stock[]> => {
    console.log(`Filtering stocks by category: ${category}`);
    const response = await api.get(`/stocks?category=${category}`);
    console.log('Filtered stocks:', response.data);
    return response.data;
  },

  /**
   * 📊 Filtrer les articles par statut
   * 
   * Cette fonction récupère seulement les articles avec un statut spécifique
   * (Disponible, Faible, Épuisé, Expiré).
   * 
   * @param status - Le statut à filtrer
   * @returns Promise<Stock[]> - Liste des articles avec ce statut
   */
  getByStatus: async (status: string): Promise<Stock[]> => {
    console.log(`Filtering stocks by status: ${status}`);
    const response = await api.get(`/stocks?status=${status}`);
    console.log('Filtered stocks:', response.data);
    return response.data;
  },

  /**
   * ⚠️ Obtenir les articles en faible quantité
   * 
   * Cette fonction identifie les articles qui sont en dessous du seuil minimum.
   * Très utile pour les alertes de réapprovisionnement.
   * 
   * @returns Promise<Stock[]> - Liste des articles en stock faible
   */
  getLowStock: async (): Promise<Stock[]> => {
    console.log('Fetching low stock items...');
    const response = await api.get('/stocks');
    const stocks = response.data;
    
    // Filtrer pour garder seulement les articles en quantité insuffisante
    const lowStocks = stocks.filter((stock: Stock) => stock.quantity <= stock.minQuantity);
    
    console.log('Low stock items:', lowStocks);
    return lowStocks;
  },
};
