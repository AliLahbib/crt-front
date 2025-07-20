
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Child } from '@/services/familyService';

interface ChildrenSectionProps {
  form: UseFormReturn<any>;
  children: Child[];
  onChildrenChange: (children: Child[]) => void;
}

const GENDER_OPTIONS = [
  { value: 'Masculin', label: 'Masculin' },
  { value: 'Féminin', label: 'Féminin' },
];

const NIVEAU_SCOLAIRE_OPTIONS = [
  { value: 'Maternelle', label: 'Maternelle' },
  { value: 'Primaire', label: 'Primaire' },
  { value: 'Collège', label: 'Collège' },
  { value: 'Lycée', label: 'Lycée' },
  { value: 'Université', label: 'Université' },
  { value: 'Non scolarisé', label: 'Non scolarisé' },
];

export function ChildrenSection({ form, children, onChildrenChange }: ChildrenSectionProps) {
  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      nom: '',
      prenom: '',
      gender: '',
      niveauScolaire: '',
      notes: '',
    };
    const updatedChildren = [...children, newChild];
    onChildrenChange(updatedChildren);
    form.setValue('children', updatedChildren.length);
  };

  const removeChild = (childId: string) => {
    const updatedChildren = children.filter(child => child.id !== childId);
    onChildrenChange(updatedChildren);
    form.setValue('children', updatedChildren.length);
  };

  const updateChild = (childId: string, field: keyof Child, value: string) => {
    const updatedChildren = children.map(child =>
      child.id === childId ? { ...child, [field]: value } : child
    );
    onChildrenChange(updatedChildren);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-redCrescent-red">Informations des enfants</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addChild}
          className="border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un enfant
        </Button>
      </div>

      {children.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun enfant ajouté. Cliquez sur "Ajouter un enfant" pour commencer.</p>
        </div>
      )}

      {children.map((child, index) => (
        <Card key={child.id} className="border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                Enfant {index + 1}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeChild(child.id!)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nom de l'enfant"
                    value={child.nom}
                    onChange={(e) => updateChild(child.id!, 'nom', e.target.value)}
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Prénom de l'enfant"
                    value={child.prenom}
                    onChange={(e) => updateChild(child.id!, 'prenom', e.target.value)}
                  />
                </FormControl>
              </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  value={child.gender}
                  onValueChange={(value) => updateChild(child.id!, 'gender', value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem>
                <FormLabel>Niveau scolaire</FormLabel>
                <Select
                  value={child.niveauScolaire}
                  onValueChange={(value) => updateChild(child.id!, 'niveauScolaire', value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le niveau" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NIVEAU_SCOLAIRE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes concernant cet enfant..."
                  rows={2}
                  value={child.notes || ''}
                  onChange={(e) => updateChild(child.id!, 'notes', e.target.value)}
                />
              </FormControl>
            </FormItem>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
