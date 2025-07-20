
import { api } from './api';

/**
 * 📅 Interface Event - Structure d'un événement
 * 
 * Cette interface définit tous les champs qu'un événement peut avoir.
 * Un événement peut être une formation, collecte, distribution, etc.
 */
export interface Event {
  id?: number;                    // ID unique de l'événement (optionnel car généré automatiquement)
  title: string;                  // Titre de l'événement
  description: string;            // Description détaillée
  date: string;                   // Date de l'événement (format: YYYY-MM-DD)
  time: string;                   // Heure de l'événement (format: HH:MM)
  location: string;               // Lieu où se déroule l'événement
  type: 'Formation' | 'Collecte' | 'Distribution' | 'Sensibilisation' | 'Autre'; // Type d'événement
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé';  // Statut actuel
  organizer: string;              // Nom de l'organisateur
  participants: string[];         // Liste des participants
  maxParticipants?: number;       // Nombre maximum de participants (optionnel)
  requirements?: string[];        // Exigences/prérequis (optionnel)
  notes?: string;                 // Notes additionnelles (optionnel)
  createdAt: string;              // Date de création (format ISO)
}

/**
 * 🛠️ Service des Événements
 * 
 * Ce service contient toutes les fonctions pour gérer les événements.
 * Il communique avec le serveur JSON pour sauvegarder/récupérer les données.
 */
export const eventService = {
  /**
   * 📋 Récupérer tous les événements
   * 
   * Cette fonction fait une requête GET pour obtenir la liste complète des événements.
   * 
   * @returns Promise<Event[]> - Liste de tous les événements
   */
  getAll: async (): Promise<Event[]> => {
    console.log('Fetching all events from JSON server...');
    const response = await api.get('/events');
    console.log('Events fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un événement par son ID
   * 
   * Cette fonction trouve un événement spécifique grâce à son ID unique.
   * 
   * @param id - L'ID de l'événement à récupérer
   * @returns Promise<Event> - L'événement trouvé
   */
  getById: async (id: number): Promise<Event> => {
    console.log(`Fetching event ${id} from JSON server...`);
    const response = await api.get(`/events/${id}`);
    console.log('Event fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouvel événement
   * 
   * Cette fonction ajoute un nouvel événement dans la base de données.
   * L'ID sera généré automatiquement par le serveur.
   * 
   * @param event - Les données de l'événement (sans l'ID)
   * @returns Promise<Event> - L'événement créé avec son nouvel ID
   */
  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    console.log('Creating event in JSON server:', event);
    const response = await api.post('/events', event);
    console.log('Event created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un événement existant
   * 
   * Cette fonction modifie les informations d'un événement existant.
   * On peut modifier seulement certains champs grâce à Partial<Event>.
   * 
   * @param id - L'ID de l'événement à modifier
   * @param event - Les nouvelles données (partielles)
   * @returns Promise<Event> - L'événement mis à jour
   */
  update: async (id: number, event: Partial<Event>): Promise<Event> => {
    console.log(`Updating event ${id} in JSON server:`, event);
    const response = await api.put(`/events/${id}`, event);
    console.log('Event updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un événement
   * 
   * Cette fonction supprime définitivement un événement de la base de données.
   * 
   * @param id - L'ID de l'événement à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting event ${id} from JSON server...`);
    await api.delete(`/events/${id}`);
    console.log('Event deleted');
  },

  /**
   * 🔎 Rechercher des événements
   * 
   * Cette fonction recherche des événements selon un terme de recherche.
   * La recherche se fait dans tous les champs texte de l'événement.
   * 
   * @param query - Le terme à rechercher
   * @returns Promise<Event[]> - Liste des événements correspondants
   */
  search: async (query: string): Promise<Event[]> => {
    console.log(`Searching events with query: ${query}`);
    const response = await api.get(`/events?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  /**
   * 🏷️ Filtrer les événements par type
   * 
   * Cette fonction récupère seulement les événements d'un type spécifique
   * (Formation, Collecte, Distribution, etc.).
   * 
   * @param type - Le type d'événement à filtrer
   * @returns Promise<Event[]> - Liste des événements de ce type
   */
  getByType: async (type: string): Promise<Event[]> => {
    console.log(`Filtering events by type: ${type}`);
    const response = await api.get(`/events?type=${type}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * 📊 Filtrer les événements par statut
   * 
   * Cette fonction récupère seulement les événements avec un statut spécifique
   * (Planifié, En cours, Terminé, Annulé).
   * 
   * @param status - Le statut à filtrer
   * @returns Promise<Event[]> - Liste des événements avec ce statut
   */
  getByStatus: async (status: string): Promise<Event[]> => {
    console.log(`Filtering events by status: ${status}`);
    const response = await api.get(`/events?status=${status}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * ⏰ Obtenir les événements à venir
   * 
   * Cette fonction récupère les événements futurs qui ne sont pas terminés.
   * Elle compare la date de l'événement avec la date actuelle.
   * 
   * @returns Promise<Event[]> - Liste des événements à venir
   */
  getUpcoming: async (): Promise<Event[]> => {
    console.log('Fetching upcoming events...');
    const response = await api.get('/events');
    const events = response.data;
    const now = new Date(); // Date/heure actuelle
    
    // Filtrer pour garder seulement les événements futurs et actifs
    const upcomingEvents = events.filter((event: Event) => {
      const eventDate = new Date(event.date);
      return eventDate >= now && event.status !== 'Terminé' && event.status !== 'Annulé';
    });
    
    console.log('Upcoming events:', upcomingEvents);
    return upcomingEvents;
  },
};
