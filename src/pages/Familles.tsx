import { useState } from 'react';
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, Search, MapPin, AlertTriangle, Map } from "lucide-react"
import { useFamilies } from '@/hooks/useFamilies';
import { Family } from '@/services/familyService';
import { FamilyForm } from '@/components/families/FamilyForm';
import { FamilyList } from '@/components/families/FamilyList';
import { FamilyDetails } from '@/components/families/FamilyDetails';
import { FamilyMap } from '@/components/maps/FamilyMap';

export default function Familles() {
  const [showForm, setShowForm] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [showMapView, setShowMapView] = useState(false);

  const {
    families,
    isLoading,
    createFamily,
    updateFamily,
    deleteFamily,
    isCreating,
    isUpdating,
    isDeleting,
  } = useFamilies();

  // Calcul des statistiques
  const stats = {
    urgent: families.filter(f => f.priority === 'Urgent').length,
    moyen: families.filter(f => f.priority === 'Moyen').length,
    faible: families.filter(f => f.priority === 'Faible').length,
    total: families.length,
  };

  const handleCreateFamily = (data: Omit<Family, 'id'>) => {
    createFamily(data);
    setShowForm(false);
  };

  const handleUpdateFamily = (data: Omit<Family, 'id'>) => {
    if (editingFamily?.id) {
      updateFamily({ id: editingFamily.id, data });
      setEditingFamily(null);
      setShowForm(false);
    }
  };

  const handleDeleteFamily = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) {
      deleteFamily(id);
    }
  };

  const handleEditFamily = (family: Family) => {
    setEditingFamily(family);
    setShowForm(true);
  };

  const handleViewFamily = (family: Family) => {
    setSelectedFamily(family);
    setShowDetails(true);
  };

  const openNewFamilyForm = () => {
    setEditingFamily(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Familles à Aider" 
        subtitle="Gestion des familles bénéficiaires et suivi des aides" 
      />
      
      <main className="p-6 space-y-6">
        {/* Actions rapides */}
        <div className="flex gap-4">
          <Button 
            className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
            onClick={openNewFamilyForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle famille
          </Button>
          <Button variant="outline" className="border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white">
            <Search className="h-4 w-4 mr-2" />
            Recherche avancée
          </Button>
          <Button 
            variant={showMapView ? "default" : "outline"} 
            className={showMapView ? "bg-redCrescent-red hover:bg-redCrescent-darkRed" : "border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white"}
            onClick={() => setShowMapView(!showMapView)}
          >
            <Map className="h-4 w-4 mr-2" />
            {showMapView ? 'Vue liste' : 'Vue carte'}
          </Button>
        </div>

        {/* Statistiques par priorité */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">familles</p>
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
                  <p className="text-sm font-medium text-gray-600">Priorité Urgente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
                  <p className="text-xs text-gray-500">familles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Priorité Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.moyen}</p>
                  <p className="text-xs text-gray-500">familles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Priorité Faible</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.faible}</p>
                  <p className="text-xs text-gray-500">familles</p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vue conditionnelle: Carte ou Liste */}
        {showMapView ? (
          <div className="animate-fade-in">
            <FamilyMap
              families={families}
              onFamilySelect={handleViewFamily}
              height="500px"
            />
          </div>
        ) : (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Liste des Familles ({families.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FamilyList
                families={families}
                isLoading={isLoading}
                onEdit={handleEditFamily}
                onDelete={handleDeleteFamily}
                onView={handleViewFamily}
              />
            </CardContent>
          </Card>
        )}

        {/* Formulaire de création/modification */}
        <FamilyForm
          open={showForm}
          onOpenChange={setShowForm}
          family={editingFamily || undefined}
          onSubmit={editingFamily ? handleUpdateFamily : handleCreateFamily}
          isLoading={isCreating || isUpdating}
        />

        {/* Détails de la famille */}
        <FamilyDetails
          family={selectedFamily}
          open={showDetails}
          onOpenChange={setShowDetails}
        />
      </main>
    </div>
  );
}
