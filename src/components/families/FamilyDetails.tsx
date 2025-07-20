
import { Family } from '@/services/familyService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MapPin, Users, Calendar, Heart, FileText, Activity } from 'lucide-react';
import { InterventionsList } from './InterventionsList';

interface FamilyDetailsProps {
  family: Family | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FamilyDetails({ family, open, onOpenChange }: FamilyDetailsProps) {
  if (!family) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{family.name}</span>
            <Badge className={getPriorityColor(family.priority)}>
              {family.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails de la famille</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Informations de contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{family.contact}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                  <span>{family.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Composition familiale */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Composition familiale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{family.members}</div>
                    <div className="text-sm text-gray-600">Membres totaux</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{family.children}</div>
                    <div className="text-sm text-gray-600">Enfants</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statut et dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Suivi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Statut:</span>
                  <Badge variant="outline">{family.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date d'inscription:</span>
                  <span>{family.registrationDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dernière aide:</span>
                  <span>{family.lastHelp}</span>
                </div>
              </CardContent>
            </Card>

            {/* Besoins */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Besoins identifiés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {family.needs.map((need, index) => (
                    <Badge key={index} variant="secondary">
                      {need}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {family.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{family.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="interventions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Gestion des interventions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {family.id && <InterventionsList familyId={family.id} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
