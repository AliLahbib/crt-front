
import axios from 'axios';

/**
 * 🌐 Configuration API - Communication avec le backend Symfony
 * 
 * Ce fichier configure Axios pour communiquer avec notre API Symfony.
 * Axios est une librairie qui simplifie les requêtes HTTP (GET, POST, PUT, DELETE).
 */

// 📍 URL de base de notre API Symfony
const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    
    // Gestion spécifique des erreurs Symfony
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Non autorisé - rediriger vers login
          console.error('Non autorisé - Token invalide ou expiré');
          localStorage.removeItem('auth_token');
          // Ici on pourrait rediriger vers la page de login
          break;
        case 403:
          console.error('Accès interdit');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 422:
          console.error('Données invalides:', data);
          break;
        case 500:
          console.error('Erreur serveur interne');
          break;
        default:
          console.error(`Erreur ${status}:`, data);
      }
    }
    
    return Promise.reject(error);
  }
);
