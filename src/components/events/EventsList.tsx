
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/services/eventService';
import { EventsFilters } from './EventsFilters';
import { EventsGrid } from './EventsGrid';

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  isLoading?: boolean;
}

export const EventsList = ({ events, onEdit, onDelete, isLoading }: EventsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrage des événements
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des événements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <EventsFilters
        searchTerm={searchTerm}
        filterType={filterType}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
      />
      
      <EventsGrid
        events={filteredEvents}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
