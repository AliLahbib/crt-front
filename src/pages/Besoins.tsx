
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NeedsManager } from '@/components/needs/NeedsManager';
import { Plus } from 'lucide-react';

export default function Besoins() {
  const [showNeedsManager, setShowNeedsManager] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Besoins</h1>
          <p className="text-gray-600 mt-1">Gérez les types de besoins pour les familles</p>
        </div>
        <Button onClick={() => setShowNeedsManager(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Gérer les besoins
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Types de besoins disponibles</h2>
        <p className="text-gray-600">
          Cliquez sur "Gérer les besoins" pour créer, modifier ou supprimer les types de besoins 
          que les familles peuvent avoir (alimentaire, vestimentaire, médical, etc.).
        </p>
      </div>

      <NeedsManager 
        open={showNeedsManager} 
        onOpenChange={setShowNeedsManager} 
      />
    </div>
  );
}
