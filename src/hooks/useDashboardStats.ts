
import { useQuery } from '@tanstack/react-query';
import { volunteerService } from '@/services/volunteerService';
import { familyService } from '@/services/familyService';
import { eventService } from '@/services/eventService';
import { stockService } from '@/services/stockService';

/**
 * 📊 Hook useDashboardStats - Récupération des statistiques du tableau de bord
 * 
 * Ce hook personnalisé récupère toutes les données nécessaires pour le tableau de bord
 * en utilisant les services existants et React Query pour optimiser les performances.
 */
export const useDashboardStats = () => {
  // Récupérer les bénévoles
  const {
    data: volunteers = [],
    isLoading: isLoadingVolunteers
  } = useQuery({
    queryKey: ['volunteers'],
    queryFn: volunteerService.getAll,
  });

  // Récupérer les familles
  const {
    data: families = [],
    isLoading: isLoadingFamilies
  } = useQuery({
    queryKey: ['families'],
    queryFn: familyService.getAll,
  });

  // Récupérer les événements
  const {
    data: events = [],
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
  });

  // Récupérer les stocks
  const {
    data: stocks = [],
    isLoading: isLoadingStocks
  } = useQuery({
    queryKey: ['stocks'],
    queryFn: stockService.getAll,
  });

  // Calculer les statistiques
  const stats = {
    // Bénévoles actifs (ceux qui ont le statut 'Actif')
    activeVolunteers: volunteers.filter(v => v.status === 'Actif').length,
    
    // Familles aidées ce mois (simulé - en réalité on filtrerait par date)
    familiesHelped: families.length,
    
    // Événements en cours ce mois
    currentEvents: events.filter(e => e.status === 'En cours' || e.status === 'Planifié').length,
    
    // Total des articles en stock
    totalStockItems: stocks.reduce((total, stock) => total + stock.quantity, 0),
  };

  // Activités récentes (derniers événements)
  const recentActivities = events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(event => ({
      title: event.title,
      date: event.date,
      time: event.time,
      status: event.status,
      participants: event.participants.length
    }));

  // Tâches urgentes basées sur les stocks faibles
  const urgentTasks = [
    // Stocks faibles (moins de 10 unités)
    ...stocks
      .filter(stock => stock.quantity < 10)
      .map(stock => ({
        title: `Stock ${stock.name} faible`,
        description: `${stock.quantity} unités restantes`,
        priority: 'Urgent' as const
      })),
    
    // Nouvelles familles (simulé)
    {
      title: `${families.length} familles enregistrées`,
      description: 'Vérifier les besoins prioritaires',
      priority: 'Important' as const
    },
    
    // Événements à venir
    {
      title: 'Événements planifiés',
      description: `${events.filter(e => e.status === 'Planifié').length} événements à organiser`,
      priority: 'Normal' as const
    }
  ].slice(0, 3); // Limiter à 3 tâches

  return {
    stats,
    recentActivities,
    urgentTasks,
    isLoading: isLoadingVolunteers || isLoadingFamilies || isLoadingEvents || isLoadingStocks,
  };
};
