import React from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

export const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                ¡Instala EstiloLibre!
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Accede más rápido desde tu dispositivo
              </p>
              
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={installApp}
                  className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-7"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Instalar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPrompt(false)}
                  className="text-xs px-3 py-1 h-7"
                >
                  <X className="w-3 h-3 mr-1" />
                  Ahora no
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};