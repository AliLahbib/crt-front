
import { useState } from 'react';
import { Intervention } from '@/services/interventionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Trash2, Plus, Clock, User, DollarSign } from 'lucide-react';
import { InterventionForm } from './InterventionForm';
import { useInterventions } from '@/hooks/useInterventions';

interface InterventionsListProps {
  familyId: number;
}

export function InterventionsList({ familyId }: InterventionsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);

  const {
    interventions,
    isLoading,
    createIntervention,
    updateIntervention,
    deleteIntervention,
    isCreating,
    isUpdating,
  } = useInterventions(familyId);

  const handleCreateIntervention = (data: Omit<Intervention, 'id'>) => {
    createIntervention(data);
    setShowForm(false);
  };

  const handleUpdateIntervention = (data: Omit<Intervention, 'id'>) => {
    if (editingIntervention?.id) {
      updateIntervention({ id: editingIntervention.id, data });
      setEditingIntervention(null);
      setShowForm(false);
    }
  };

  const handleDeleteIntervention = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      deleteIntervention(id);
    }
  };

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setShowForm(true);
  };

  const openNewInterventionForm = () => {
    setEditingIntervention(null);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminée': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Planifiée': return 'bg-yellow-100 text-yellow-800';
      case 'Annulée': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Aide alimentaire': return '🍽️';
      case 'Aide vestimentaire': return '👕';
      case 'Aide médicale': return '🏥';
      case 'Soutien scolaire': return '📚';
      default: return '💝';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interventions ({interventions.length})</h3>
        <Button onClick={openNewInterventionForm} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle intervention
        </Button>
      </div>

      {interventions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune intervention enregistrée pour cette famille</p>
            <Button onClick={openNewInterventionForm} className="mt-4" variant="outline">
              Créer la première intervention
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {interventions.map((intervention) => (
            <Card key={intervention.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(intervention.type)}</span>
                    <div>
                      <h4 className="font-semibold">{intervention.type}</h4>
                      <p className="text-sm text-gray-600">{intervention.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(intervention.status)}>
                    {intervention.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(intervention.date).toLocaleDateString('fr-FR')}
                  </div>
                  
                  {intervention.volunteer && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {intervention.volunteer}
                    </div>
                  )}
                  
                  {intervention.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {intervention.amount} TND
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(intervention.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {intervention.items && intervention.items.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Articles fournis :</p>
                    <div className="flex flex-wrap gap-1">
                      {intervention.items.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {intervention.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {intervention.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditIntervention(intervention)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => intervention.id && handleDeleteIntervention(intervention.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <InterventionForm
        open={showForm}
        onOpenChange={setShowForm}
        familyId={familyId}
        intervention={editingIntervention || undefined}
        onSubmit={editingIntervention ? handleUpdateIntervention : handleCreateIntervention}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
