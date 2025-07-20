
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/eventService';
import { Calendar, MapPin, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

const getStatusColor = (status: Event['status']) => {
  switch (status) {
    case 'Planifié': return 'bg-yellow-100 text-yellow-800';
    case 'En cours': return 'bg-blue-100 text-blue-800';
    case 'Terminé': return 'bg-green-100 text-green-800';
    case 'Annulé': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: Event['type']) => {
  switch (type) {
    case 'Formation': return 'bg-purple-100 text-purple-800';
    case 'Collecte': return 'bg-orange-100 text-orange-800';
    case 'Distribution': return 'bg-green-100 text-green-800';
    case 'Sensibilisation': return 'bg-blue-100 text-blue-800';
    case 'Autre': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-gray-900 mb-2">
              {event.title}
            </CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={getTypeColor(event.type)}>
                {event.type}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(event)}
              variant="outline"
              size="sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onDelete(event)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm">{event.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(event.date), 'dd MMMM yyyy', { locale: fr })} à {event.time}
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {event.participants.length} participant(s)
            {event.maxParticipants && ` / ${event.maxParticipants} max`}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            Organisé par {event.organizer}
          </div>
        </div>

        {event.requirements && event.requirements.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Exigences:</p>
            <div className="flex flex-wrap gap-1">
              {event.requirements.map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {event.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Notes:</strong> {event.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
