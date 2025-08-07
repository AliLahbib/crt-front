import { api } from './api';

/**
 * 📊 Interface DashboardData - Structure des données du dashboard
 * 
 * Cette interface définit la structure des données affichées sur le dashboard.
 */
export interface DashboardData {
  stats: {
    families: {
      total: number;
      active: number;
      newThisMonth: number;
    };
    volunteers: {
      total: number;
      active: number;
      available: number;
    };
    interventions: {
      total: number;
      thisMonth: number;
      pending: number;
    };
    stocks: {
      total: number;
      lowStock: number;
      expired: number;
    };
    events: {
      total: number;
      upcoming: number;
      today: number;
    };
    needs: {
      total: number;
      active: number;
      urgent: number;
    };
  };
  activities: Array<{
    id: number;
    type: string;
    description: string;
    date: string;
    user?: string;
  }>;
  urgentTasks: Array<{
    id: number;
    title: string;
    priority: string;
    deadline?: string;
    type: string;
  }>;
  alerts: Array<{
    id: number;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    date: string;
  }>;
  performance: {
    responseTime: number;
    completionRate: number;
    satisfactionScore: number;
  };
  trends: {
    families: Array<{ month: string; count: number }>;
    interventions: Array<{ month: string; count: number }>;
    volunteers: Array<{ month: string; count: number }>;
  };
}

/**
 * 🛠️ Service du Dashboard
 * 
 * Ce service contient toutes les fonctions pour récupérer les données du dashboard.
 * Il communique avec l'API Symfony pour obtenir les données consolidées.
 */
export const dashboardService = {
  /**
   * 📊 Récupérer toutes les données du dashboard
   * 
   * @returns Promise<DashboardData> - Toutes les données du dashboard
   */
  getAll: async (): Promise<DashboardData> => {
    console.log('Fetching all dashboard data from Symfony API...');
    const response = await api.get('/dashboard');
    console.log('Dashboard data fetched:', response.data);
    return response.data;
  },

  /**
   * 📈 Récupérer les statistiques globales
   * 
   * @returns Promise<any> - Les statistiques globales
   */
  getStats: async (): Promise<any> => {
    console.log('Fetching dashboard stats from Symfony API...');
    const response = await api.get('/dashboard/stats');
    console.log('Dashboard stats:', response.data);
    return response.data;
  },

  /**
   * 📋 Récupérer les activités récentes
   * 
   * @returns Promise<any[]> - Liste des activités récentes
   */
  getActivities: async (): Promise<any[]> => {
    console.log('Fetching recent activities from Symfony API...');
    const response = await api.get('/dashboard/activities');
    console.log('Recent activities:', response.data);
    return response.data;
  },

  /**
   * ⚠️ Récupérer les tâches urgentes
   * 
   * @returns Promise<any[]> - Liste des tâches urgentes
   */
  getUrgentTasks: async (): Promise<any[]> => {
    console.log('Fetching urgent tasks from Symfony API...');
    const response = await api.get('/dashboard/urgent-tasks');
    console.log('Urgent tasks:', response.data);
    return response.data;
  },

  /**
   * 🚨 Récupérer les alertes du système
   * 
   * @returns Promise<any[]> - Liste des alertes
   */
  getAlerts: async (): Promise<any[]> => {
    console.log('Fetching system alerts from Symfony API...');
    const response = await api.get('/dashboard/alerts');
    console.log('System alerts:', response.data);
    return response.data;
  },

  /**
   * 📊 Récupérer les métriques de performance
   * 
   * @returns Promise<any> - Les métriques de performance
   */
  getPerformance: async (): Promise<any> => {
    console.log('Fetching performance metrics from Symfony API...');
    const response = await api.get('/dashboard/performance');
    console.log('Performance metrics:', response.data);
    return response.data;
  },

  /**
   * 📈 Récupérer les tendances mensuelles
   * 
   * @returns Promise<any> - Les tendances mensuelles
   */
  getTrends: async (): Promise<any> => {
    console.log('Fetching monthly trends from Symfony API...');
    const response = await api.get('/dashboard/trends');
    console.log('Monthly trends:', response.data);
    return response.data;
  }
}; 