
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Stock } from '@/services/stockService';
import { TrendingUp, TrendingDown } from 'lucide-react';

const movementSchema = z.object({
  stockId: z.number().min(1, 'Veuillez sélectionner un article'),
  type: z.enum(['in', 'out'], { required_error: 'Le type de mouvement est obligatoire' }),
  quantity: z.number().min(1, 'La quantité doit être positive'),
  reason: z.string().min(1, 'La raison est obligatoire'),
  notes: z.string().optional(),
});

type MovementFormData = z.infer<typeof movementSchema>;

interface StockMovementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stocks: Stock[];
  onSubmit: (data: MovementFormData) => void;
  isLoading?: boolean;
}

const movementReasons = {
  in: [
    'Réception de commande',
    'Don reçu',
    'Retour de distribution',
    'Correction inventaire',
    'Autre'
  ],
  out: [
    'Distribution aux familles',
    'Péremption',
    'Perte/Casse',
    'Don vers autre organisation',
    'Correction inventaire',
    'Autre'
  ]
};

export function StockMovementForm({ open, onOpenChange, stocks, onSubmit, isLoading }: StockMovementFormProps) {
  const form = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      stockId: 0,
      type: 'out',
      quantity: 1,
      reason: '',
      notes: '',
    },
  });

  const watchedType = form.watch('type');
  const watchedStockId = form.watch('stockId');
  const selectedStock = stocks.find(s => s.id === watchedStockId);

  const handleSubmit = (data: MovementFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-redCrescent-red flex items-center">
            {watchedType === 'in' ? (
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
            )}
            Mouvement de stock
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de mouvement *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                          Entrée de stock
                        </div>
                      </SelectItem>
                      <SelectItem value="out">
                        <div className="flex items-center">
                          <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                          Sortie de stock
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un article" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stocks.map((stock) => (
                        <SelectItem key={stock.id} value={stock.id!.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{stock.name}</span>
                            <span className="text-sm text-gray-500">
                              Stock actuel: {stock.quantity} {stock.unit}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedStock && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stock actuel:</span>
                  <span className="text-lg font-bold">
                    {selectedStock.quantity} {selectedStock.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Emplacement:</span>
                  <span className="text-sm">{selectedStock.location}</span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max={watchedType === 'out' ? selectedStock?.quantity : undefined}
                      placeholder="Quantité"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  {watchedType === 'out' && selectedStock && field.value > selectedStock.quantity && (
                    <p className="text-sm text-red-600">
                      Quantité supérieure au stock disponible ({selectedStock.quantity} {selectedStock.unit})
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une raison" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movementReasons[watchedType].map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes additionnelles..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || (watchedType === 'out' && selectedStock && form.watch('quantity') > selectedStock.quantity)}
                className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer le mouvement'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
