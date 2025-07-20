import { useState } from 'react';
import { useVolunteers } from '@/hooks/useVolunteers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Mail, MapPin, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { VolunteerForm } from './VolunteerForm';
import { VolunteerDetails } from './VolunteerDetails';
import { DeleteVolunteerDialog } from './DeleteVolunteerDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Volunteer } from '@/services/volunteerService';

interface VolunteersListProps {
  volunteers: Volunteer[];
  isLoading: boolean;
  onEdit: (volunteer: Volunteer) => void;
  onDelete: (volunteer: Volunteer) => void;
  onView: (volunteer: Volunteer) => void;
}

export function VolunteersList({ volunteers, isLoading, onEdit, onDelete, onView }: VolunteersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-redCrescent-red mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des bénévoles...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volunteer.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;
    const matchesRole = roleFilter === 'all' || volunteer.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Bureau': return 'bg-orange-100 text-orange-800';
      case 'Membre': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'En mission': return 'bg-yellow-100 text-yellow-800';
      case 'Indisponible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, prénom, email ou compétences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Bureau">Bureau</SelectItem>
                  <SelectItem value="Membre">Membre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des bénévoles */}
      <div className="grid gap-4">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-12 h-12 bg-redCrescent-red rounded-full flex items-center justify-center text-white font-bold">
                      {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {volunteer.firstName} {volunteer.lastName}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getRoleColor(volunteer.role || '')}>
                          {volunteer.role}
                        </Badge>
                        <Badge className={getStatusColor(volunteer.status || '')}>
                          {volunteer.status}
                        </Badge>
                        <Badge className={getAvailabilityColor(volunteer.availability || '')}>
                          {volunteer.availability}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {volunteer.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {volunteer.email}
                    </div>
                    {volunteer.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {volunteer.address}
                      </div>
                    )}
                  </div>

                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{volunteer.skills.length - 3} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onView(volunteer)}
                  >
                    Voir détails
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(volunteer)}
                    className="text-redCrescent-red border-redCrescent-red hover:bg-redCrescent-red hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDelete(volunteer)}
                    className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all' 
                ? 'Aucun bénévole ne correspond aux critères de recherche' 
                : 'Aucun bénévole trouvé'}
            </p>
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
