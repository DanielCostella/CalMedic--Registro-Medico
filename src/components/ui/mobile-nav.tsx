import React, { useState } from 'react';
import { Menu, X, Home, Users, Calendar, Pill, FileText, BarChart3, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TouchFeedback } from '@/components/ui/touch-feedback';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'recetario', label: 'Recetas', icon: Pill },
  { id: 'historial', label: 'Historial', icon: FileText },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'busqueda', label: 'Búsqueda', icon: Search },
  { id: 'notificaciones', label: 'Alertas', icon: Bell }
];

export const MobileNav: React.FC<MobileNavProps> = ({ currentSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <TouchFeedback>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-5 h-5" />
                  </Button>
                </TouchFeedback>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Sistema Médico
                      </h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="p-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">EstiloLibre</p>
                  </div>
                  
                  <div className="flex-1 py-4">
                    <nav className="space-y-1 px-3">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentSection === item.id;
                        
                        return (
                          <TouchFeedback
                            key={item.id}
                            onTap={() => handleNavClick(item.id)}
                          >
                            <div
                              className={cn(
                                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              <Icon className={cn(
                                'w-5 h-5',
                                isActive ? 'text-blue-600' : 'text-gray-500'
                              )} />
                              {item.label}
                            </div>
                          </TouchFeedback>
                        );
                      })}
                    </nav>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {navItems.find(item => item.id === currentSection)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <TouchFeedback
                key={item.id}
                onTap={() => handleNavClick(item.id)}
              >
                <div
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )} />
                  <span className="text-xs font-medium truncate">
                    {item.label}
                  </span>
                </div>
              </TouchFeedback>
            );
          })}
        </div>
      </div>
    </>
  );
};