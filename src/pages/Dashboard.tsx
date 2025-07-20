
import { Header } from "@/components/layout/Header"
import { StatCard } from "@/components/ui/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, User, ChevronUp, Package } from "lucide-react"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function Dashboard() {
  const { stats, recentActivities, urgentTasks, isLoading } = useDashboardStats();

  // Configuration des cartes de statistiques avec les vraies données
  const statsCards = [
    {
      title: "Bénévoles Actifs",
      value: stats.activeVolunteers,
      description: "Membres engagés",
      icon: Users,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Familles Aidées",
      value: stats.familiesHelped,
      description: "Familles enregistrées",
      icon: User,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Événements",
      value: stats.currentEvents,
      description: "En cours et planifiés",
      icon: Calendar,
      trend: { value: 3, isPositive: false }
    },
    {
      title: "Articles en Stock",
      value: stats.totalStockItems.toLocaleString(),
      description: "Unités disponibles",
      icon: Package,
      trend: { value: 15, isPositive: true }
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Tableau de Bord" 
          subtitle="Vue d'ensemble des activités du Croissant Rouge" 
        />
        <main className="p-6">
          <div className="text-center">Chargement des données...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Tableau de Bord" 
        subtitle="Vue d'ensemble des activités du Croissant Rouge" 
      />
      
      <main className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              className="animate-fade-in"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Activités Récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(activity.date), 'dd MMMM yyyy', { locale: fr })} à {activity.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                        activity.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{activity.participants} participants</p>
                    </div>
                  </div>
                ))
              )}
              <Button variant="outline" className="w-full mt-4 text-redCrescent-red border-redCrescent-red hover:bg-redCrescent-red hover:text-white">
                Voir toutes les activités
              </Button>
            </CardContent>
          </Card>

          {/* Urgent Tasks */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
                <ChevronUp className="h-5 w-5 mr-2" />
                Tâches Prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {urgentTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune tâche urgente</p>
              ) : (
                urgentTasks.map((task, index) => (
                  <div key={index} className="p-3 border-l-4 border-redCrescent-red bg-red-50 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        task.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Important' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <Button className="w-full mt-4 bg-redCrescent-red hover:bg-redCrescent-darkRed">
                Gérer les tâches
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-redCrescent-red">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 bg-white border-2 border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span>Nouveau Bénévole</span>
              </Button>
              <Button className="h-20 bg-white border-2 border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Nouvel Événement</span>
              </Button>
              <Button className="h-20 bg-white border-2 border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white flex-col space-y-2">
                <User className="h-6 w-6" />
                <span>Nouvelle Famille</span>
              </Button>
              <Button className="h-20 bg-white border-2 border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white flex-col space-y-2">
                <Package className="h-6 w-6" />
                <span>Entrée Stock</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
