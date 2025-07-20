
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Check, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les marqueurs par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLat?: number;
  initialLng?: number;
  address?: string;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function LocationPicker({
  open,
  onOpenChange,
  initialLat = 33.8869,
  initialLng = 9.5375,
  address,
  onLocationSelect
}: LocationPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (initialLat && initialLng) {
      setSelectedPosition([initialLat, initialLng]);
    }
  }, [initialLat, initialLng]);

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    setSelectedPosition([lat, lng]);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      console.log('Confirming position:', selectedPosition);
      onLocationSelect(selectedPosition[0], selectedPosition[1]);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const createRedIcon = () => {
    return L.divIcon({
      className: 'custom-red-marker',
      html: `
        <div style="
          background-color: #ef4444;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transform: translate(-50%, -50%);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const handleMapReady = (map: L.Map) => {
    mapRef.current = map;
    
    // Add click event listener to the map
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      handleMapClick(lat, lng);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Sélectionner la position exacte
          </DialogTitle>
          {address && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Adresse: {address}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Cliquez sur la carte pour placer le marqueur à la position exacte de la famille
            </p>
          </div>

          <div style={{ height: '400px' }} className="w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={selectedPosition || [initialLat, initialLng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
              ref={handleMapReady}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {selectedPosition && (
                <Marker
                  position={selectedPosition}
                  icon={createRedIcon()}
                />
              )}
            </MapContainer>
          </div>

          {selectedPosition && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="h-4 w-4" />
                <span>Position sélectionnée:</span>
                <span className="font-mono font-semibold">
                  {selectedPosition[0].toFixed(6)}, {selectedPosition[1].toFixed(6)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedPosition}
            className="bg-red-500 hover:bg-red-600"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirmer la position
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
