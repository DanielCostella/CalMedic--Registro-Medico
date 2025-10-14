import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GlobalSearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implementar lógica de búsqueda aquí
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Buscar en el sistema..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-64"
        />
        <Button variant="ghost" size="sm" className="ml-2">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && searchQuery && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Resultados de búsqueda</h4>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Buscando "{searchQuery}"...
              </p>
              <div className="text-sm text-gray-500">
                Funcionalidad de búsqueda en desarrollo
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearchComponent;