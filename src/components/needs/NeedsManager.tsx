
import { useState } from 'react';
import { Need } from '@/services/needsService';
import { useNeeds } from '@/hooks/useNeeds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const needSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().optional(),
  category: z.string().min(1, 'La catégorie est requise'),
  isActive: z.boolean(),
});

type NeedFormData = z.infer<typeof needSchema>;

const CATEGORIES = [
  'Alimentaire',
  'Vestimentaire',
  'Médical',
  'Éducation',
  'Logement',
  'Transport',
  'Autres'
];

interface NeedsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NeedsManager({ open, onOpenChange }: NeedsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingNeed, setEditingNeed] = useState<Need | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const {
    needs,
    isLoading,
    createNeed,
    updateNeed,
    deleteNeed,
    isCreating,
    isUpdating,
  } = useNeeds();

  const form = useForm<NeedFormData>({
    resolver: zodResolver(needSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      isActive: true,
    },
  });

  const filteredNeeds = needs.filter(need => {
    const matchesSearch = need.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || need.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (data: NeedFormData) => {
    const today = new Date().toISOString();
    const needData: Omit<Need, 'id'> = {
      name: data.name,
      description: data.description || '',
      category: data.category,
      isActive: data.isActive,
      createdAt: editingNeed?.createdAt || today,
      updatedAt: today,
    };

    if (editingNeed?.id) {
      updateNeed({ id: editingNeed.id, data: needData });
    } else {
      createNeed(needData);
    }
    setShowForm(false);
    setEditingNeed(null);
    form.reset();
  };

  const handleEdit = (need: Need) => {
    setEditingNeed(need);
    form.reset({
      name: need.name,
      description: need.description || '',
      category: need.category,
      isActive: need.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce besoin ?')) {
      deleteNeed(id);
    }
  };

  const openNewForm = () => {
    setEditingNeed(null);
    form.reset({
      name: '',
      description: '',
      category: '',
      isActive: true,
    });
    setShowForm(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des Besoins</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Actions et filtres */}
          <div className="flex gap-4 items-center flex-wrap">
            <Button onClick={openNewForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau besoin
            </Button>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Liste des besoins */}
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : (
              filteredNeeds.map((need) => (
                <Card key={need.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{need.name}</h3>
                          <Badge variant="secondary">{need.category}</Badge>
                          <Badge variant={need.isActive ? "default" : "outline"}>
                            {need.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        {need.description && (
                          <p className="text-sm text-gray-600">{need.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(need)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => need.id && handleDelete(need.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Formulaire de création/modification */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingNeed ? 'Modifier le besoin' : 'Nouveau besoin'}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du besoin</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Aide alimentaire d'urgence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Description détaillée du besoin..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Besoin actif</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Ce besoin peut être sélectionné pour les familles
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {isCreating || isUpdating ? 'Enregistrement...' : editingNeed ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
