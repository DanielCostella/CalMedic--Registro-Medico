import React from 'react';
import { Loader2, Heart, Activity } from 'lucide-react';

interface PreloaderProps {
  loading: boolean;
  message?: string;
}

export const Preloader: React.FC<PreloaderProps> = ({ 
  loading, 
  message = "Cargando Sistema Médico..." 
}) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8">
        {/* Logo animado */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <Heart className="w-20 h-20 text-red-500 animate-pulse" />
            <Activity className="w-8 h-8 text-blue-600 absolute top-6 left-6 animate-bounce" />
          </div>
          
          {/* Círculo de carga */}
          <div className="absolute -inset-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">EstiloLibre</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {message}
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
        </div>

        {/* Puntos de carga */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;