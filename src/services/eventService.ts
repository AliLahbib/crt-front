
import { api } from './api';

/**
 * 🎉 Interface Event - Structure d'un événement
 * 
 * Cette interface définit tous les champs qu'un événement peut avoir.
 * Un événement représente une activité organisée par le Croissant Rouge.
 */
export interface Event {
  id?: number;                    // ID unique de l'événement (optionnel car généré automatiquement)
  title: string;                  // Titre de l'événement
  description: string;            // Description détaillée
  type: string;                   // Type d'événement (Distribution, Formation, Sensibilisation, etc.)
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé'; // Statut de l'événement
  date: string;                   // Date de l'événement
  startTime: string;              // Heure de début
  endTime: string;                // Heure de fin
  location: string;               // Lieu de l'événement
  organizer: string;              // Organisateur principal
  maxParticipants?: number;       // Nombre maximum de participants (optionnel)
  currentParticipants: number;    // Nombre actuel de participants
  budget?: number;                // Budget alloué (optionnel)
  notes?: string;                 // Notes additionnelles (optionnel)
}

/**
 * 🛠️ Service des Événements
 * 
 * Ce service contient toutes les fonctions pour gérer les événements.
 * Il communique avec l'API Symfony pour sauvegarder/récupérer les données.
 */
export const eventService = {
  /**
   * 📋 Récupérer tous les événements
   * 
   * @returns Promise<Event[]> - Liste de tous les événements
   */
  getAll: async (): Promise<Event[]> => {
    console.log('Fetching all events from Symfony API...');
    const response = await api.get('/events');
    console.log('Events fetched:', response.data);
    return response.data;
  },

  /**
   * 🔍 Récupérer un événement par son ID
   * 
   * @param id - L'ID de l'événement à récupérer
   * @returns Promise<Event> - L'événement trouvé
   */
  getById: async (id: number): Promise<Event> => {
    console.log(`Fetching event ${id} from Symfony API...`);
    const response = await api.get(`/events/${id}`);
    console.log('Event fetched:', response.data);
    return response.data;
  },

  /**
   * ➕ Créer un nouvel événement
   * 
   * @param event - Les données de l'événement (sans l'ID)
   * @returns Promise<Event> - L'événement créé avec son nouvel ID
   */
  create: async (event: Omit<Event, 'id'>): Promise<Event> => {
    console.log('Creating event in Symfony API:', event);
    const response = await api.post('/events', event);
    console.log('Event created:', response.data);
    return response.data;
  },

  /**
   * ✏️ Mettre à jour un événement existant
   * 
   * @param id - L'ID de l'événement à modifier
   * @param event - Les nouvelles données (partielles)
   * @returns Promise<Event> - L'événement mis à jour
   */
  update: async (id: number, event: Partial<Event>): Promise<Event> => {
    console.log(`Updating event ${id} in Symfony API:`, event);
    const response = await api.put(`/events/${id}`, event);
    console.log('Event updated:', response.data);
    return response.data;
  },

  /**
   * 🗑️ Supprimer un événement
   * 
   * @param id - L'ID de l'événement à supprimer
   * @returns Promise<void> - Aucune donnée retournée
   */
  delete: async (id: number): Promise<void> => {
    console.log(`Deleting event ${id} from Symfony API...`);
    await api.delete(`/events/${id}`);
    console.log('Event deleted');
  },

  /**
   * 📊 Filtrer les événements par statut
   * 
   * @param status - Le statut à filtrer
   * @returns Promise<Event[]> - Liste des événements avec ce statut
   */
  getByStatus: async (status: string): Promise<Event[]> => {
    console.log(`Filtering events by status: ${status}`);
    const response = await api.get(`/events/status/${status}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * 🏷️ Filtrer les événements par type
   * 
   * @param type - Le type à filtrer
   * @returns Promise<Event[]> - Liste des événements de ce type
   */
  getByType: async (type: string): Promise<Event[]> => {
    console.log(`Filtering events by type: ${type}`);
    const response = await api.get(`/events/type/${type}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * 📅 Obtenir les événements à venir
   * 
   * @returns Promise<Event[]> - Liste des événements à venir
   */
  getUpcoming: async (): Promise<Event[]> => {
    console.log('Fetching upcoming events from Symfony API...');
    const response = await api.get('/events/upcoming');
    console.log('Upcoming events:', response.data);
    return response.data;
  },

  /**
   * 📅 Obtenir les événements d'aujourd'hui
   * 
   * @returns Promise<Event[]> - Liste des événements d'aujourd'hui
   */
  getToday: async (): Promise<Event[]> => {
    console.log('Fetching today events from Symfony API...');
    const response = await api.get('/events/today');
    console.log('Today events:', response.data);
    return response.data;
  },

  /**
   * 📅 Filtrer les événements par période
   * 
   * @param start - Date de début
   * @param end - Date de fin
   * @returns Promise<Event[]> - Liste des événements dans cette période
   */
  getByPeriod: async (start: string, end: string): Promise<Event[]> => {
    console.log(`Filtering events by period: ${start} to ${end}`);
    const response = await api.get(`/events/period?start=${start}&end=${end}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * 👥 Ajouter un participant à un événement
   * 
   * @param id - L'ID de l'événement
   * @param participant - Les données du participant
   * @returns Promise<Event> - L'événement mis à jour
   */
  addParticipant: async (id: number, participant: any): Promise<Event> => {
    console.log(`Adding participant to event ${id}:`, participant);
    const response = await api.post(`/events/${id}/participants`, participant);
    console.log('Participant added:', response.data);
    return response.data;
  },

  /**
   * 👥 Retirer un participant d'un événement
   * 
   * @param id - L'ID de l'événement
   * @param participantId - L'ID du participant
   * @returns Promise<void> - Aucune donnée retournée
   */
  removeParticipant: async (id: number, participantId: number): Promise<void> => {
    console.log(`Removing participant ${participantId} from event ${id}...`);
    await api.delete(`/events/${id}/participants`, { data: { participantId } });
    console.log('Participant removed');
  },

  /**
   * 🔄 Changer le statut d'un événement
   * 
   * @param id - L'ID de l'événement
   * @param status - Le nouveau statut
   * @returns Promise<Event> - L'événement mis à jour
   */
  changeStatus: async (id: number, status: string): Promise<Event> => {
    console.log(`Changing status for event ${id} to: ${status}`);
    const response = await api.put(`/events/${id}/status`, { status });
    console.log('Status changed:', response.data);
    return response.data;
  },

  /**
   * ✅ Vérifier si un événement est complet
   * 
   * @param id - L'ID de l'événement
   * @returns Promise<boolean> - True si complet
   */
  isFull: async (id: number): Promise<boolean> => {
    console.log(`Checking if event ${id} is full...`);
    const response = await api.get(`/events/${id}/is-full`);
    console.log('Is full result:', response.data);
    return response.data.isFull;
  },

  /**
   * ⚠️ Obtenir les événements urgents
   * 
   * @returns Promise<Event[]> - Liste des événements urgents
   */
  getUrgent: async (): Promise<Event[]> => {
    console.log('Fetching urgent events from Symfony API...');
    const response = await api.get('/events/urgent');
    console.log('Urgent events:', response.data);
    return response.data;
  },

  /**
   * 👤 Obtenir les événements par organisateur
   * 
   * @param organizer - Le nom de l'organisateur
   * @returns Promise<Event[]> - Liste des événements de cet organisateur
   */
  getByOrganizer: async (organizer: string): Promise<Event[]> => {
    console.log(`Fetching events by organizer: ${organizer}`);
    const response = await api.get(`/events/organizer/${organizer}`);
    console.log('Organizer events:', response.data);
    return response.data;
  },

  /**
   * 🔍 Rechercher des événements
   * 
   * @param query - Le terme à rechercher
   * @returns Promise<Event[]> - Liste des événements correspondants
   */
  search: async (query: string): Promise<Event[]> => {
    console.log(`Searching events with query: ${query}`);
    const response = await api.get(`/events/search?q=${encodeURIComponent(query)}`);
    console.log('Search results:', response.data);
    return response.data;
  },

  /**
   * 📍 Obtenir les événements par lieu
   * 
   * @param location - Le lieu à filtrer
   * @returns Promise<Event[]> - Liste des événements à ce lieu
   */
  getByLocation: async (location: string): Promise<Event[]> => {
    console.log(`Filtering events by location: ${location}`);
    const response = await api.get(`/events/location/${location}`);
    console.log('Filtered events:', response.data);
    return response.data;
  },

  /**
   * ✅ Vérifier la disponibilité d'un lieu
   * 
   * @param location - Le lieu à vérifier
   * @param date - La date à vérifier
   * @returns Promise<boolean> - True si disponible
   */
  checkLocationAvailability: async (location: string, date: string): Promise<boolean> => {
    console.log(`Checking location availability: ${location} on ${date}`);
    const response = await api.get(`/events/check-location?location=${location}&date=${date}`);
    console.log('Location availability:', response.data);
    return response.data.available;
  },

  /**
   * 📅 Obtenir le calendrier mensuel
   * 
   * @param year - L'année
   * @param month - Le mois
   * @returns Promise<any> - Le calendrier
   */
  getCalendar: async (year: number, month: number): Promise<any> => {
    console.log(`Fetching calendar for ${year}/${month} from Symfony API...`);
    const response = await api.get(`/events/calendar/${year}/${month}`);
    console.log('Calendar:', response.data);
    return response.data;
  },

  /**
   * 📊 Obtenir les statistiques des événements
   * 
   * @returns Promise<any> - Les statistiques
   */
  getStats: async (): Promise<any> => {
    console.log('Fetching event stats from Symfony API...');
    const response = await api.get('/events/stats');
    console.log('Event stats:', response.data);
    return response.data;
  }
};
