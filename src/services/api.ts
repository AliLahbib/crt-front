
import axios from 'axios';

/**
 * 🌐 Configuration API - Communication avec le serveur JSON
 * 
 * Ce fichier configure Axios pour communiquer avec notre serveur JSON local.
 * Axios est une librairie qui simplifie les requêtes HTTP (GET, POST, PUT, DELETE).
 */

// 📍 URL de base de notre serveur JSON local
const API_BASE_URL = 'http://localhost:3001';

/**
 * 🔧 Instance Axios configurée
 * 
 * On crée une instance Axios avec une configuration de base.
 * Tous les appels utiliseront automatiquement cette configuration.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,    // Toutes les URLs commenceront par cette base
  headers: {
    'Content-Type': 'application/json',  // On envoie et reçoit du JSON
  },
});

/**
 * 🔐 Intercepteur de requêtes - Ajouter l'authentification
 * 
 * Un intercepteur "intercepte" les requêtes avant qu'elles soient envoyées.
 * Ici, on ajoute automatiquement le token d'authentification s'il existe.
 */
api.interceptors.request.use(
  (config) => {
    // Récupérer le token du localStorage (si l'utilisateur est connecté)
    const token = localStorage.getItem('auth_token');
    
    // Si on a un token, l'ajouter dans les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;  // Continuer avec la requête modifiée
  },
  (error) => {
    // Si il y a une erreur dans la configuration, la rejeter
    return Promise.reject(error);
  }
);

/**
 * 📥 Intercepteur de réponses - Gérer les erreurs globales
 * 
 * Un intercepteur de réponse "intercepte" les réponses du serveur.
 * Ici, on gère les erreurs communes (401, 500, etc.) de façon centralisée.
 */
api.interceptors.response.use(
  (response) => {
    // Si la réponse est OK, la retourner telle quelle
    return response;
  },
  (error) => {
    // Logger l'erreur pour le débogage
    console.error('API Error:', error);
    
    // Ici on pourrait ajouter une gestion globale des erreurs :
    // - Rediriger vers la page de login si 401 (non autorisé)
    // - Afficher un message d'erreur global si 500 (erreur serveur)
    // - etc.
    
    return Promise.reject(error);
  }
);
