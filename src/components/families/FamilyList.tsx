
import { useState } from 'react';
import { Family } from '@/services/familyService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Phone, MapPin, Users, Edit, Trash2, Search, Eye, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNeeds } from '@/hooks/useNeeds';

interface FamilyListProps {
  families: Family[];
  isLoading: boolean;
  onEdit: (family: Family) => void;
  onDelete: (id: number) => void;
  onView: (family: Family) => void;
}

export function FamilyList({ families, isLoading, onEdit, onDelete, onView }: FamilyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtres avancés
  const [minMembers, setMinMembers] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [minChildren, setMinChildren] = useState('');
  const [maxChildren, setMaxChildren] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const { activeNeeds } = useNeeds();

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || family.priority === priorityFilter;
    
    // Filtres avancés par nombre de membres
    const matchesMinMembers = !minMembers || family.members >= parseInt(minMembers);
    const matchesMaxMembers = !maxMembers || family.members <= parseInt(maxMembers);
    
    // Filtres avancés par nombre d'enfants
    const matchesMinChildren = !minChildren || family.children >= parseInt(minChildren);
    const matchesMaxChildren = !maxChildren || family.children <= parseInt(maxChildren);
    
    // Filtre par besoins
    const matchesNeeds = selectedNeeds.length === 0 || 
                        selectedNeeds.every(need => family.needs?.includes(need));

    return matchesSearch && matchesPriority && matchesMinMembers && 
           matchesMaxMembers && matchesMinChildren && matchesMaxChildren && matchesNeeds;
  });

  const handleNeedToggle = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('');
    setMinMembers('');
    setMaxMembers('');
    setMinChildren('');
    setMaxChildren('');
    setSelectedNeeds([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres de base */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par nom ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Toutes les priorités</option>
          <option value="Urgent">Urgent</option>
          <option value="Moyen">Moyen</option>
          <option value="Faible">Faible</option>
        </select>
        
        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtres avancés
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
        
        <Button variant="outline" onClick={clearFilters}>
          Effacer les filtres
        </Button>
      </div>

      {/* Filtres avancés */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleContent className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Filtres avancés</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Filtres par nombre de membres */}
                <div>
                  <label className="block text-sm font-medium mb-1">Membres min</label>
                  <Input
                    type="number"
                    placeholder="Ex: 2"
                    value={minMembers}
                    onChange={(e) => setMinMembers(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Membres max</label>
                  <Input
                    type="number"
                    placeholder="Ex: 8"
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                  />
                </div>
                
                {/* Filtres par nombre d'enfants */}
                <div>
                  <label className="block text-sm font-medium mb-1">Enfants min</label>
                  <Input
                    type="number"
                    placeholder="Ex: 1"
                    value={minChildren}
                    onChange={(e) => setMinChildren(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Enfants max</label>
                  <Input
                    type="number"
                    placeholder="Ex: 5"
                    value={maxChildren}
                    onChange={(e) => setMaxChildren(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtres par besoins */}
              <div>
                <label className="block text-sm font-medium mb-2">Besoins identifiés</label>
                <div className="flex flex-wrap gap-2">
                  {activeNeeds.map((need) => (
                    <Badge
                      key={need.id}
                      variant={selectedNeeds.includes(need.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleNeedToggle(need.name)}
                    >
                      {need.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Résultats de filtrage */}
      <div className="text-sm text-gray-600">
        {filteredFamilies.length} famille(s) trouvée(s) sur {families.length} au total
      </div>

      {/* Version mobile - Cartes */}
      <div className="md:hidden space-y-4">
        {filteredFamilies.map((family) => (
          <Card key={family.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">{family.name}</h3>
                <Badge className={getPriorityColor(family.priority)}>
                  {family.priority}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {family.contact}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {family.address}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {family.members} membres ({family.children} enfants)
                </div>
                {family.needs && family.needs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {family.needs.map((need, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {need}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onView(family)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(family)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => family.id && onDelete(family.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Version desktop - Tableau */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Famille</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Membres</TableHead>
              <TableHead>Besoins</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFamilies.map((family) => (
              <TableRow key={family.id}>
                <TableCell className="font-medium">{family.name}</TableCell>
                <TableCell>{family.contact}</TableCell>
                <TableCell>{family.address}</TableCell>
                <TableCell>{family.members} ({family.children} enfants)</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {family.needs?.slice(0, 2).map((need, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {need}
                      </Badge>
                    ))}
                    {family.needs && family.needs.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{family.needs.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(family.priority)}>
                    {family.priority}
                  </Badge>
                </TableCell>
                <TableCell>{family.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(family)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEdit(family)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => family.id && onDelete(family.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredFamilies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune famille trouvée avec les critères sélectionnés
        </div>
      )}
    </div>
  );
}
