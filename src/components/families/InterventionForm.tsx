
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Intervention } from '@/services/interventionService';

const interventionSchema = z.object({
  type: z.string().min(1, 'Le type d\'intervention est requis'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  date: z.date({ required_error: 'La date est requise' }),
  amount: z.number().optional(),
  status: z.string(),
  volunteer: z.string().optional(),
  notes: z.string().optional(),
});

type InterventionFormData = z.infer<typeof interventionSchema>;

interface InterventionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyId: number;
  intervention?: Intervention;
  onSubmit: (data: Omit<Intervention, 'id'>) => void;
  isLoading?: boolean;
}

const INTERVENTION_TYPES = [
  'Aide alimentaire',
  'Aide vestimentaire', 
  'Aide médicale',
  'Soutien scolaire',
  'Autre'
];

const STATUS_OPTIONS = [
  'Planifiée',
  'En cours',
  'Terminée',
  'Annulée'
];

export function InterventionForm({ 
  open, 
  onOpenChange, 
  familyId,
  intervention, 
  onSubmit, 
  isLoading 
}: InterventionFormProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(intervention?.items || []);
  const [newItem, setNewItem] = useState('');

  const form = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      type: intervention?.type || '',
      description: intervention?.description || '',
      date: intervention?.date ? new Date(intervention.date) : new Date(),
      amount: intervention?.amount || undefined,
      status: intervention?.status || 'Planifiée',
      volunteer: intervention?.volunteer || '',
      notes: intervention?.notes || '',
    },
  });

  const handleSubmit = (data: InterventionFormData) => {
    const formattedData: Omit<Intervention, 'id'> = {
      familyId,
      type: data.type as any,
      description: data.description,
      date: data.date.toISOString().split('T')[0],
      amount: data.amount,
      items: selectedItems,
      status: data.status as any,
      volunteer: data.volunteer,
      notes: data.notes,
      createdAt: intervention?.createdAt || new Date().toISOString(),
    };
    onSubmit(formattedData);
  };

  const addItem = () => {
    if (newItem.trim() && !selectedItems.includes(newItem.trim())) {
      setSelectedItems([...selectedItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (item: string) => {
    setSelectedItems(selectedItems.filter(i => i !== item));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {intervention ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'intervention</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INTERVENTION_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez l'intervention en détail..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'intervention</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (TND)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="volunteer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bénévole responsable</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du bénévole" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gestion des articles */}
            <div>
              <FormLabel>Articles fournis</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Ajouter un article..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                />
                <Button type="button" onClick={addItem} variant="outline">
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedItems.map((item, index) => (
                  <div key={index} className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {item}
                    <button
                      type="button"
                      onClick={() => removeItem(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes supplémentaires..."
                      rows={2}
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
                {isLoading ? 'Enregistrement...' : intervention ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
