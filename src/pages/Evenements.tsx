
import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, Users, MapPin } from "lucide-react";
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/services/eventService';
import { EventForm } from '@/components/events/EventForm';
import { EventsList } from '@/components/events/EventsList';
import { DeleteEventDialog } from '@/components/events/DeleteEventDialog';

export default function Evenements() {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEvents();

  // Calcul des statistiques en temps réel
  const stats = {
    total: events.length,
    enCours: events.filter(e => e.status === 'En cours').length,
    planifies: events.filter(e => e.status === 'Planifié').length,
    termines: events.filter(e => e.status === 'Terminé').length,
    totalParticipants: events.reduce((total, event) => total + (event.participants?.length || 0), 0),
  };

  const handleCreateEvent = (data: Omit<Event, 'id'>) => {
    createEvent(data);
    setShowForm(false);
  };

  const handleUpdateEvent = (data: Omit<Event, 'id'>) => {
    if (editingEvent?.id) {
      updateEvent({ id: editingEvent.id, data });
      setEditingEvent(null);
      setShowForm(false);
    }
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
  };

  const confirmDelete = () => {
    if (eventToDelete?.id) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const openNewEventForm = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Événements" 
        subtitle="Gestion des événements et activités du Croissant Rouge" 
      />
      
      <main className="p-6 space-y-6">
        {/* Actions rapides */}
        <div className="flex gap-4">
          <Button 
            className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
            onClick={openNewEventForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Événements</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">événements</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Cours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
                  <p className="text-xs text-gray-500">événements</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Planifiés</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.planifies}</p>
                  <p className="text-xs text-gray-500">événements</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participants</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants}</p>
                  <p className="text-xs text-gray-500">au total</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des événements */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Liste des Événements ({events.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EventsList
              events={events}
              isLoading={isLoading}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </CardContent>
        </Card>

        {/* Formulaire de création/modification */}
        <EventForm
          open={showForm}
          onOpenChange={setShowForm}
          event={editingEvent || undefined}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          isLoading={isCreating || isUpdating}
        />

        {/* Dialog de suppression */}
        <DeleteEventDialog
          event={eventToDelete}
          open={!!eventToDelete}
          onOpenChange={(open) => !open && setEventToDelete(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
