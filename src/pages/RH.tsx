
import { useState } from 'react';
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, UserCheck, UserX, Clock, AlertTriangle } from "lucide-react";
import { useVolunteers } from '@/hooks/useVolunteers';
import { Volunteer } from '@/services/volunteerService';
import { VolunteerForm } from '@/components/volunteers/VolunteerForm';
import { VolunteersList } from '@/components/volunteers/VolunteersList';
import { VolunteerDetails } from '@/components/volunteers/VolunteerDetails';
import { DeleteVolunteerDialog } from '@/components/volunteers/DeleteVolunteerDialog';

export default function RH() {
  const [showForm, setShowForm] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [volunteerToDelete, setVolunteerToDelete] = useState<Volunteer | null>(null);

  const {
    volunteers,
    stats,
    isLoading,
    isLoadingStats,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
    isCreating,
    isUpdating,
    isDeleting,
  } = useVolunteers();

  const handleCreateVolunteer = (data: Omit<Volunteer, 'id'>) => {
    createVolunteer(data);
    setShowForm(false);
  };

  const handleUpdateVolunteer = (data: Omit<Volunteer, 'id'>) => {
    if (editingVolunteer?.id) {
      updateVolunteer({ id: editingVolunteer.id, data });
      setEditingVolunteer(null);
      setShowForm(false);
    }
  };

  const handleDeleteVolunteer = (volunteer: Volunteer) => {
    setVolunteerToDelete(volunteer);
  };

  const confirmDelete = () => {
    if (volunteerToDelete?.id) {
      deleteVolunteer(volunteerToDelete.id);
      setVolunteerToDelete(null);
    }
  };

  const handleEditVolunteer = (volunteer: Volunteer) => {
    setEditingVolunteer(volunteer);
    setShowForm(true);
  };

  const handleViewVolunteer = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowDetails(true);
  };

  const openNewVolunteerForm = () => {
    setEditingVolunteer(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Ressources Humaines" 
        subtitle="Gestion des bénévoles et des équipes" 
      />
      
      <main className="p-6 space-y-6">
        {/* Actions rapides */}
        <div className="flex gap-4">
          <Button 
            className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
            onClick={openNewVolunteerForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau bénévole
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bénévoles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats?.total || volunteers.length}
                  </p>
                  <p className="text-xs text-gray-500">bénévoles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats?.actifs || volunteers.filter(v => v.status === 'Actif').length}
                  </p>
                  <p className="text-xs text-gray-500">bénévoles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats?.disponibles || volunteers.filter(v => v.availability === 'Disponible').length}
                  </p>
                  <p className="text-xs text-gray-500">bénévoles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Indisponibles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoadingStats ? '...' : stats?.indisponibles || volunteers.filter(v => v.availability === 'Indisponible').length}
                  </p>
                  <p className="text-xs text-gray-500">bénévoles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                  <UserX className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des bénévoles */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Liste des Bénévoles ({volunteers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VolunteersList
              volunteers={volunteers}
              isLoading={isLoading}
              onEdit={handleEditVolunteer}
              onDelete={handleDeleteVolunteer}
              onView={handleViewVolunteer}
            />
          </CardContent>
        </Card>

        {/* Formulaire de création/modification */}
        <VolunteerForm
          open={showForm}
          onOpenChange={setShowForm}
          volunteer={editingVolunteer || undefined}
          onSubmit={editingVolunteer ? handleUpdateVolunteer : handleCreateVolunteer}
          isLoading={isCreating || isUpdating}
        />

        {/* Détails du bénévole */}
        <VolunteerDetails
          volunteer={selectedVolunteer}
          open={showDetails}
          onOpenChange={setShowDetails}
        />

        {/* Dialog de suppression */}
        <DeleteVolunteerDialog
          volunteer={volunteerToDelete}
          open={!!volunteerToDelete}
          onOpenChange={(open) => !open && setVolunteerToDelete(null)}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
