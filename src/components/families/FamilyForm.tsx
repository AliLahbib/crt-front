import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Family, Child } from '@/services/familyService';
import { useNeeds } from '@/hooks/useNeeds';
import { NeedsManager } from '@/components/needs/NeedsManager';
import { ChildrenSection } from './ChildrenSection';
import { AddressAutocomplete } from '@/components/maps/AddressAutocomplete';
import { LocationPicker } from '@/components/maps/LocationPicker';
import { Settings, MapPin, Map } from 'lucide-react';

const familySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  fatherName: z.string().min(2, 'Le nom du père est requis'),
  fatherCIN: z.string().min(8, 'Le CIN du père doit contenir au moins 8 caractères'),
  fatherPhone: z.string().min(8, 'Le téléphone du père est requis'),
  motherName: z.string().min(2, 'Le nom de la mère est requis'),
  motherCIN: z.string().min(8, 'Le CIN de la mère doit contenir au moins 8 caractères'),
  motherPhone: z.string().min(8, 'Le téléphone de la mère est requis'),
  maritalStatus: z.string().min(1, 'L\'état matrimonial est requis'),
  healthCard: z.string().min(1, 'Le type de carte de soin est requis'),
  chronicDisease: z.boolean(),
  chronicDiseaseDetails: z.string().optional(),
  zone: z.string().min(1, 'La zone est requise'),
  address: z.string().min(1, 'L\'adresse est requise'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  members: z.number().min(1, 'Le nombre de membres doit être d\'au moins 1'),
  children: z.number().min(0, 'Le nombre d\'enfants ne peut pas être négatif'),
  status: z.string(),
  priority: z.string(),
  needs: z.array(z.string()),
  notes: z.string().optional(),
});

type FamilyFormData = z.infer<typeof familySchema>;

interface FamilyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family?: Family;
  onSubmit: (data: Omit<Family, 'id'>) => void;
  isLoading?: boolean;
}

const PRIORITY_OPTIONS = [
  { value: 'Urgent', label: 'Urgent' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Faible', label: 'Faible' },
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'En attente', label: 'En attente' },
  { value: 'Suspendue', label: 'Suspendue' },
];

const ZONE_OPTIONS = [
  { value: 'El Alia', label: 'El Alia' },
  { value: 'Khitmin', label: 'Khitmin' },
  { value: 'Hriza', label: 'Hriza' },
  { value: 'Sidi Ali Chbeb', label: 'Sidi Ali Chbeb' },
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'Marié(e)', label: 'Marié(e)' },
  { value: 'Divorcé(e)', label: 'Divorcé(e)' },
  { value: 'Veuf(ve)', label: 'Veuf(ve)' },
  { value: 'Célibataire', label: 'Célibataire' },
];

const HEALTH_CARD_OPTIONS = [
  { value: 'Carte de traitement gratuit', label: 'Carte de traitement gratuit' },
  { value: 'Carte de traitement à faible coût', label: 'Carte de traitement à faible coût' },
  { value: 'CNSS', label: 'CNSS' },
];

export function FamilyForm({ open, onOpenChange, family, onSubmit, isLoading }: FamilyFormProps) {
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(family?.needs || []);
  const [showNeedsManager, setShowNeedsManager] = useState(false);
  const [chronicDisease, setChronicDisease] = useState(family?.chronicDisease || false);
  const [childrenDetails, setChildrenDetails] = useState<Child[]>(family?.childrenDetails || []);
  const [currentAddress, setCurrentAddress] = useState(family?.address || '');
  const [currentLatitude, setCurrentLatitude] = useState<number | undefined>(family?.latitude);
  const [currentLongitude, setCurrentLongitude] = useState<number | undefined>(family?.longitude);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { activeNeeds, isLoadingActive } = useNeeds();

  const form = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: family?.name || '',
      fatherName: family?.fatherName || '',
      fatherCIN: family?.fatherCIN || '',
      fatherPhone: family?.fatherPhone || '',
      motherName: family?.motherName || '',
      motherCIN: family?.motherCIN || '',
      motherPhone: family?.motherPhone || '',
      maritalStatus: family?.maritalStatus || '',
      healthCard: family?.healthCard || '',
      chronicDisease: family?.chronicDisease || false,
      chronicDiseaseDetails: family?.chronicDiseaseDetails || '',
      zone: family?.zone || '',
      address: family?.address || '',
      latitude: family?.latitude || undefined,
      longitude: family?.longitude || undefined,
      members: family?.members || 1,
      children: family?.children || 0,
      status: family?.status || 'Active',
      priority: family?.priority || 'Moyen',
      needs: family?.needs || [],
      notes: family?.notes || '',
    },
  });

  const handleAddressSelect = (address: string, lat: number, lon: number) => {
    setCurrentAddress(address);
    setCurrentLatitude(lat);
    setCurrentLongitude(lon);
    
    form.setValue('address', address);
    form.setValue('latitude', lat);
    form.setValue('longitude', lon);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setCurrentLatitude(lat);
    setCurrentLongitude(lng);
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
  };

  const openLocationPicker = () => {
    if (currentAddress) {
      setShowLocationPicker(true);
    } else {
      alert('Veuillez d\'abord sélectionner une adresse');
    }
  };

  const handleSubmit = (data: FamilyFormData) => {
    const today = new Date().toISOString().split('T')[0];
    const contact = data.fatherName && data.fatherPhone ? `${data.fatherName} (${data.fatherPhone})` : 
                   data.motherName && data.motherPhone ? `${data.motherName} (${data.motherPhone})` : '';
    
    const formattedData: Omit<Family, 'id'> = {
      name: data.name,
      fatherName: data.fatherName,
      fatherCIN: data.fatherCIN,
      fatherPhone: data.fatherPhone,
      motherName: data.motherName,
      motherCIN: data.motherCIN,
      motherPhone: data.motherPhone,
      maritalStatus: data.maritalStatus,
      healthCard: data.healthCard,
      chronicDisease: data.chronicDisease,
      chronicDiseaseDetails: data.chronicDisease ? data.chronicDiseaseDetails : undefined,
      zone: data.zone,
      latitude: currentLatitude,
      longitude: currentLongitude,
      contact: contact,
      address: currentAddress,
      members: data.members,
      children: childrenDetails.length,
      childrenDetails: childrenDetails,
      status: data.status,
      priority: data.priority,
      needs: selectedNeeds,
      registrationDate: family?.registrationDate || today,
      lastHelp: family?.lastHelp || 'Jamais',
      notes: data.notes || '',
    };
    onSubmit(formattedData);
  };

  const toggleNeed = (needName: string) => {
    const updated = selectedNeeds.includes(needName)
      ? selectedNeeds.filter(n => n !== needName)
      : [...selectedNeeds, needName];
    setSelectedNeeds(updated);
    form.setValue('needs', updated);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {family ? 'Modifier la famille' : 'Nouvelle famille'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Informations générales</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de famille</FormLabel>
                      <FormControl>
                        <Input placeholder="Famille Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Informations du père */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Informations du père</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du père</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmed Ben Salem" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherCIN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIN du père</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone du père</FormLabel>
                        <FormControl>
                          <Input placeholder="22 123 456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Informations de la mère */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Informations de la mère</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la mère</FormLabel>
                        <FormControl>
                          <Input placeholder="Fatma Ben Salem" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherCIN"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIN de la mère</FormLabel>
                        <FormControl>
                          <Input placeholder="87654321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de la mère</FormLabel>
                        <FormControl>
                          <Input placeholder="22 654 321" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Informations familiales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Informations familiales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>État matrimonial</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'état matrimonial" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {MARITAL_STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="healthCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carte de soin</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type de carte" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {HEALTH_CARD_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="chronicDisease"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={() => {
                            const newValue = !field.value;
                            field.onChange(newValue);
                            setChronicDisease(newValue);
                            if (!newValue) {
                              form.setValue('chronicDiseaseDetails', '');
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Maladie chronique</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {(chronicDisease || form.watch('chronicDisease')) && (
                  <FormField
                    control={form.control}
                    name="chronicDiseaseDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails de la maladie chronique</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez la maladie chronique..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Localisation - Version simplifiée avec bouton direct */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Localisation</h3>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ZONE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ✍️ Adresse complète (utilisez l'autocomplétion OpenStreetMap)
                        </FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={currentAddress}
                            onAddressSelect={handleAddressSelect}
                            placeholder="Rechercher une adresse..."
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          📌 La position GPS sera enregistrée automatiquement.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bouton pour ajuster la position - apparait directement après sélection d'adresse */}
                  {currentAddress && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={openLocationPicker}
                      className="flex items-center gap-2 w-fit"
                    >
                      <Map className="h-4 w-4" />
                      Ajuster la position sur la carte
                    </Button>
                  )}

                  {/* Affichage des coordonnées GPS */}
                  {currentLatitude && currentLongitude && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-sm text-green-700">
                        <MapPin className="h-4 w-4" />
                        <span>Position GPS enregistrée:</span>
                        <span className="font-mono">
                          {currentLatitude.toFixed(6)}, {currentLongitude.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Composition familiale */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Composition familiale</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de membres</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Nombre d'enfants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        value={childrenDetails.length}
                        readOnly
                        className="bg-gray-100"
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </div>

              {/* Section enfants */}
              <ChildrenSection
                form={form}
                children={childrenDetails}
                onChildrenChange={setChildrenDetails}
              />

              {/* Statut et priorité */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-redCrescent-red">Statut et priorité</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priorité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la priorité" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PRIORITY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUS_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Besoins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <FormLabel>Besoins</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNeedsManager(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer les besoins
                  </Button>
                </div>
                
                {isLoadingActive ? (
                  <div className="text-sm text-gray-500">Chargement des besoins...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {activeNeeds.map((need) => (
                      <Button
                        key={need.id}
                        type="button"
                        variant={selectedNeeds.includes(need.name) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleNeed(need.name)}
                        className="justify-start"
                      >
                        <Badge variant="secondary" className="mr-2 text-xs">
                          {need.category}
                        </Badge>
                        {need.name}
                      </Button>
                    ))}
                  </div>
                )}
                
                {selectedNeeds.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-1">Besoins sélectionnés :</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedNeeds.map((need, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informations supplémentaires..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Enregistrement...' : family ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <NeedsManager 
        open={showNeedsManager} 
        onOpenChange={setShowNeedsManager} 
      />

      <LocationPicker
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        address={currentAddress}
        initialLat={currentLatitude}
        initialLng={currentLongitude}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}
