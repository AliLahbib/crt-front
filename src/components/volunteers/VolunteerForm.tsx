import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVolunteers } from '@/hooks/useVolunteers';
import { Volunteer } from '@/services/volunteerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Plus } from 'lucide-react';

interface VolunteerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  volunteer?: Volunteer;
  onSubmit: (data: Omit<Volunteer, 'id'>) => void;
  isLoading?: boolean;
}

export function VolunteerForm({ open, onOpenChange, volunteer, onSubmit, isLoading }: VolunteerFormProps) {
  const [skills, setSkills] = useState<string[]>(volunteer?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Volunteer>({
    defaultValues: volunteer || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      role: 'Membre',
      skills: [],
      status: 'Actif',
      availability: 'Disponible',
      joinDate: new Date().toISOString().split('T')[0],
      notes: ''
    }
  });

  const handleFormSubmit = (data: Volunteer) => {
    const volunteerData = {
      ...data,
      skills
    };
    
    onSubmit(volunteerData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-redCrescent-red">
            {volunteer ? 'Modifier le bénévole' : 'Nouveau bénévole'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'Le prénom est requis' })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Le nom est requis' })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: 'Email invalide'
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Le téléphone est requis' })}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                {...register('address')}
              />
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select onValueChange={(value) => setValue('role', value)} defaultValue={watch('role')}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Bureau">Bureau</SelectItem>
                  <SelectItem value="Membre">Membre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select onValueChange={(value) => setValue('status', value as 'Actif' | 'Inactif' | 'Suspendu')} defaultValue={watch('status')}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availability">Disponibilité</Label>
              <Select onValueChange={(value) => setValue('availability', value)} defaultValue={watch('availability')}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En mission">En mission</SelectItem>
                  <SelectItem value="Indisponible">Indisponible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="joinDate">Date d'adhésion</Label>
              <Input
                id="joinDate"
                type="date"
                {...register('joinDate')}
              />
            </div>
          </div>

          <div>
            <Label>Compétences</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Ajouter une compétence"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              {...register('notes')}
              placeholder="Notes sur le bénévole..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : volunteer ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
