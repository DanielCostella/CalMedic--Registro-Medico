import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DoctorApprovalProps {
  onBack?: () => void;
}

interface PendingDoctor {
  id: string;
  first_names: string;
  last_names: string;
  email: string;
  medical_license_number: string;
  specialty: string;
  profession_category: string;
  license_status: 'In Review' | 'Active' | 'Suspended';
}

const DoctorApproval: React.FC<DoctorApprovalProps> = ({ onBack }) => {
  const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      // Usamos profiles (left join por defecto) en vez de inner para depurar si falla la unión
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id,
          medical_license_number,
          specialty,
          profession_category,
          license_status,
          profiles (
            first_names,
            last_names,
            email,
            national_id
          )
        `)
        .eq('license_status', 'In Review');
      
      if (error) {
         console.error("Supabase Query Error:", error);
         throw error;
      }

      console.log("Doctors Raw Data:", data);

      const formatted = (data || []).map((d: any) => ({
        id: d.id,
        // Usamos el perfil unido para los nombres
        first_names: d.profiles?.first_names || 'Desconocido',
        last_names: d.profiles?.last_names || '',
        email: d.profiles?.email || 'Sin email',
        // Lógica para mostrar matrícula o DNI
        medical_license_number: d.medical_license_number || d.profiles?.national_id || 'N/A',
        specialty: d.specialty,
        profession_category: d.profession_category,
        license_status: d.license_status
      }));

      setDoctors(formatted);

    } catch (error: any) {
      console.error('Error fetching doctors:', error);
      toast.error("Error al cargar médicos: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ license_status: 'Active' })
        .eq('id', id);

      if (error) throw error;

      toast.success("Médico aprobado correctamente");
      fetchPendingDoctors(); // Refresh list
    } catch (error) {
       console.error('Error approving:', error);
       toast.error("Error al aprobar");
    }
  };

  const handleReject = async (id: string) => {
     try {
      const { error } = await supabase
        .from('doctors')
        .update({ license_status: 'Suspended' })
        .eq('id', id);

      if (error) throw error;

      toast.success("Solicitud rechazada/suspendida");
      fetchPendingDoctors(); // Refresh list
    } catch (error) {
       console.error('Error rejecting:', error);
       toast.error("Error al rechazar");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Aprobación de Profesionales</h2>
           <p className="text-slate-500">Revisa y aprueba las solicitudes de registro.</p>
        </div>
        <Button variant="outline" onClick={fetchPendingDoctors}>Actualizar</Button>
      </div>

       <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-2">
         <Search className="w-4 h-4 text-gray-400" />
         <Input 
           placeholder="Buscar por nombre o matricula..." 
           className="border-none shadow-none focus-visible:ring-0"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
       </div>

       {loading ? (
         <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
       ) : (
         <div className="grid grid-cols-1 gap-4">
            {doctors.filter(d => 
              d.first_names?.toLowerCase().includes(search.toLowerCase()) || 
              d.last_names?.toLowerCase().includes(search.toLowerCase()) ||
              d.profession_category?.toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
                <div className="text-center py-10 text-gray-400">No hay solicitudes pendientes</div>
            ) : (
                 doctors.filter(d => 
                    d.first_names?.toLowerCase().includes(search.toLowerCase()) || 
                    d.last_names?.toLowerCase().includes(search.toLowerCase())
                 ).map((doctor) => (
                    <Card key={doctor.id} className="overflow-hidden">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                             <div className={`w-full sm:w-2 bg-yellow-400`} title="Pendiente"></div>
                             <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{doctor.first_names} {doctor.last_names}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary">{doctor.profession_category}</Badge>
                                            <span className="text-sm text-gray-500">{doctor.email}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">En Revisión</Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-600">
                                     <div>
                                        <span className="font-semibold block text-gray-700">Especialidad:</span>
                                        {doctor.specialty}
                                     </div>
                                      <div>
                                        <span className="font-semibold block text-gray-700">Matrícula/Licencia:</span>
                                        {doctor.medical_license_number || "N/A"}
                                     </div>
                                </div>

                                <div className="flex gap-3 mt-6 justify-end">
                                     <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" size="sm" onClick={() => handleReject(doctor.id)}>
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Rechazar
                                     </Button>
                                     <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm" onClick={() => handleApprove(doctor.id)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Aprobar Acceso
                                     </Button>
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                 ))
            )}
         </div>
       )}
    </div>
  );
}

export default DoctorApproval;
