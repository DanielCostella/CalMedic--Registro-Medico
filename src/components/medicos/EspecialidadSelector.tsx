import React from 'react';
import { Stethoscope, Baby, Eye, Scissors, Scale, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EspecialidadSelectorProps {
  onEspecialidadChange: (especialidad: string) => void;
  especialidadActual: string;
}

const EspecialidadSelectorComponent: React.FC<EspecialidadSelectorProps> = ({
  onEspecialidadChange,
  especialidadActual
}) => {
  const especialidades = [
    {
      id: 'general',
      nombre: 'Medicina General',
      descripcion: 'Módulos generales para todas las especialidades',
      icono: <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-blue-500',
      modulosCount: 18,
      medico: 'Dr. Juan Pérez - Medicina General'
    },
    {
      id: 'odontologia',
      nombre: 'Odontología',
      descripcion: 'Odontograma digital y tratamientos dentales',
      icono: <Zap className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-green-600',
      modulosCount: 1,
      nuevo: true,
      medico: 'Dra. María González - Odontóloga'
    },
    {
      id: 'pediatria',
      nombre: 'Pediatría',
      descripcion: 'Curvas de crecimiento y seguimiento pediátrico',
      icono: <Baby className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-pink-600',
      modulosCount: 1,
      nuevo: true,
      medico: 'Dr. Carlos Rodríguez - Pediatra'
    },
    {
      id: 'oftalmologia',
      nombre: 'Oftalmología',
      descripcion: 'Evaluación ocular y prescripción de lentes',
      icono: <Eye className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-purple-600',
      modulosCount: 1,
      nuevo: true,
      medico: 'Dra. Ana Martínez - Oftalmóloga'
    },
    {
      id: 'cirugia',
      nombre: 'Cirugía General',
      descripcion: 'Seguimiento pre, intra y post operatorio',
      icono: <Scissors className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-red-600',
      modulosCount: 1,
      nuevo: true,
      medico: 'Dr. Luis Fernández - Cirujano General'
    },
    {
      id: 'bariatrica',
      nombre: 'Cirugía Bariátrica',
      descripcion: 'Seguimiento de cirugía de pérdida de peso',
      icono: <Scale className="w-4 h-4 sm:w-6 sm:h-6" />,
      color: 'bg-orange-600',
      modulosCount: 1,
      nuevo: true,
      medico: 'Dr. Roberto Silva - Cirujano Bariátrico'
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Seleccionar Especialidad</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Elige una especialidad para ver los módulos específicos disponibles
        </p>
      </div>
      
      {/* Grid responsive - Cambia de 2 columnas en móvil a 6 en desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        {especialidades.map((especialidad) => (
          <Card
            key={especialidad.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative ${
              especialidadActual === especialidad.id
                ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => onEspecialidadChange(especialidad.id)}
          >
            {especialidad.nuevo && (
              <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white z-10 text-xs scale-75 sm:scale-100">
                Nuevo
              </Badge>
            )}
            
            <CardContent className="p-2 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-3">
                <div className={`p-2 sm:p-3 rounded-lg ${especialidad.color} text-white`}>
                  {especialidad.icono}
                </div>
                
                <div className="min-w-0 w-full">
                  <h4 className="font-semibold text-xs sm:text-sm line-clamp-2">{especialidad.nombre}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2 hidden sm:block">
                    {especialidad.descripcion}
                  </p>
                </div>
                
                <Badge variant="outline" className="text-xs scale-75 sm:scale-100">
                  {especialidad.modulosCount} módulo{especialidad.modulosCount > 1 ? 's' : ''}
                </Badge>

                {/* Médico de prueba - Solo visible en pantallas medianas y grandes */}
                <div className="text-xs text-blue-600 bg-blue-50 px-1 sm:px-2 py-1 rounded hidden md:block line-clamp-2">
                  {especialidad.medico}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Información de especialidad actual - Responsive */}
      <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-700">
          <strong>Especialidad actual:</strong> {
            especialidades.find(e => e.id === especialidadActual)?.nombre || 'Medicina General'
          }
        </p>
        <p className="text-xs text-blue-600 mt-1 hidden sm:block">
          {especialidades.find(e => e.id === especialidadActual)?.descripcion}
        </p>
        <p className="text-xs text-green-600 mt-1 sm:mt-2 font-medium">
          👨‍⚕️ {especialidades.find(e => e.id === especialidadActual)?.medico}
        </p>
      </div>
    </div>
  );
};

export default EspecialidadSelectorComponent;