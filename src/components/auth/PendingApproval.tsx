import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, LogOut, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';

interface PendingApprovalProps {
  onLogout?: () => void;
  status?: string;
}

const PendingApproval: React.FC<PendingApprovalProps> = ({ onLogout, status = 'In Review' }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await authService.logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-t-4 border-t-yellow-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {status === 'Suspended' ? 'Cuenta Suspendida' : 'Registro Pendiente'}
          </CardTitle>
          <CardDescription className="text-slate-600 mt-2">
            {status === 'Suspended' 
              ? 'Tu cuenta ha sido suspendida temporalmente.' 
              : 'Gracias por registrarte en CalMedic.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white border rounded-lg p-4 text-sm text-slate-600 space-y-3">
            <p>
              {status === 'Suspended' 
                ? 'Por favor, contacta con la administración para resolver esta situación.' 
                : 'Tu perfil profesional está siendo revisado por nuestro equipo. Este proceso ayuda a mantener la seguridad y calidad de nuestra plataforma.'}
            </p>
            <p className="font-medium text-slate-900">
              {status === 'Suspended' 
                ? 'El acceso a tu panel está restringido.' 
                : 'Te notificaremos por correo electrónico y WhatsApp una vez que tu cuenta sea aprobada.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
              onClick={() => window.open('https://wa.me/XXXXXXXXXX', '_blank')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contactar Soporte
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
