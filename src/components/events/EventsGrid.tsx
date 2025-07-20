
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/services/eventService';
import { EventCard } from './EventCard';

interface EventsGridProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export const EventsGrid = ({ events, onEdit, onDelete }: EventsGridProps) => {
  if (events.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Aucun événement trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
