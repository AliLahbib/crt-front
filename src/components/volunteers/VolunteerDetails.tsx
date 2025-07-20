import { Volunteer } from '@/services/volunteerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, Mail, MapPin, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VolunteerDetailsProps {
  volunteer: Volunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function VolunteerDetails({ volunteer, open, onOpenChange, onEdit, onDelete }: VolunteerDetailsProps) {
  if (!volunteer) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails du bénévole</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-redCrescent-red rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {volunteer.firstName?.[0]}{volunteer.lastName?.[0]}
                </div>
                <div>
                  <CardTitle className="text-xl">
                    {volunteer.firstName} {volunteer.lastName}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
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
              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                )}
                {onDelete && (
                  <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Informations de contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-3" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-3" />
                    <span>{volunteer.email}</span>
                  </div>
                  {volunteer.address && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3" />
                      <span>{volunteer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Informations générales</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-3" />
                    <span>Rôle: {volunteer.role}</span>
                  </div>
                  {volunteer.joinDate && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-3" />
                      <span>
                        Adhésion: {format(new Date(volunteer.joinDate), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {volunteer.skills && volunteer.skills.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {volunteer.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{volunteer.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
