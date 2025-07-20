
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Family } from '@/services/familyService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Phone } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour ajuster la vue de la carte
function MapBounds({ families }: { families: Family[] }) {
  const map = useMap();

  useEffect(() => {
    if (families.length > 0) {
      const validFamilies = families.filter(f => f.latitude && f.longitude);
      
      if (validFamilies.length > 0) {
        const bounds = L.latLngBounds(
          validFamilies.map(f => [f.latitude!, f.longitude!])
        );
        map.fitBounds(bounds, { padding: [20, 20] });
      } else {
        // Centrer sur la Tunisie si aucune famille n'a de coordonnées
        map.setView([33.8869, 9.5375], 6);
      }
    }
  }, [families, map]);

  return null;
}

interface FamilyMapProps {
  families: Family[];
  onFamilySelect?: (family: Family) => void;
  height?: string;
  showControls?: boolean;
}

export function FamilyMap({ 
  families, 
  onFamilySelect, 
  height = "400px",
  showControls = true 
}: FamilyMapProps) {
  // Filtrer les familles qui ont des coordonnées GPS
  const familiesWithCoords = families.filter(f => f.latitude && f.longitude);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#ef4444'; // red-500
      case 'Moyen': return '#f59e0b'; // amber-500
      case 'Faible': return '#10b981'; // emerald-500
      default: return '#6b7280'; // gray-500
    }
  };

  const createCustomIcon = (priority: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${getPriorityColor(priority)};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <Card className="w-full">
      {showControls && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Carte des Familles
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">
                {familiesWithCoords.length} familles géolocalisées
              </span>
            </div>
          </CardTitle>
          
          {/* Légende des priorités */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Urgent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Moyen</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>Faible</span>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={showControls ? "" : "p-0"}>
        <div style={{ height }} className="w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[33.8869, 9.5375]} // Coordonnées de la Tunisie
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapBounds families={families} />
            
            {familiesWithCoords.map((family) => (
              <Marker
                key={family.id}
                position={[family.latitude!, family.longitude!]}
                icon={createCustomIcon(family.priority)}
                eventHandlers={{
                  click: () => onFamilySelect?.(family),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{family.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          family.priority === 'Urgent' ? 'border-red-500 text-red-600' :
                          family.priority === 'Moyen' ? 'border-amber-500 text-amber-600' :
                          'border-emerald-500 text-emerald-600'
                        }`}
                      >
                        {family.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">{family.zone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">
                          {family.members} membres ({family.children} enfants)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-600">{family.contact}</span>
                      </div>
                    </div>
                    
                    {onFamilySelect && (
                      <button
                        onClick={() => onFamilySelect(family)}
                        className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      >
                        Voir détails
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
