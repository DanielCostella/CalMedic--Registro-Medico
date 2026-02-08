import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { doctorService } from '@/services/doctorService';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, ShieldCheck } from 'lucide-react';

const DoctorInsurancesModule: React.FC = () => {
    const { toast } = useToast();
    const [allInsurances, setAllInsurances] = useState<{ id: string, name: string }[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    useEffect(() => {
        const loadUserAndData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error("No user found");
                
                setDoctorId(user.id);

                // Parallel fetch
                const [insurances, myIds] = await Promise.all([
                    doctorService.getAllInsurances(),
                    doctorService.getDoctorInsuranceIds(user.id)
                ]);
                
                setAllInsurances(insurances);
                setSelectedIds(myIds);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "No se pudieron cargar las obras sociales.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        loadUserAndData();
    }, []);

    const handleToggle = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(x => x !== id));
        }
    };

    const handleSave = async () => {
        if (!doctorId) return;
        setSaving(true);
        try {
            const success = await doctorService.updateDoctorInsurances(doctorId, selectedIds);
            if (success) {
                toast({
                    title: "Guardado",
                    description: "Tus obras sociales aceptadas han sido actualizadas.",
                });
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudieron guardar los cambios.",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="text-purple-600" />
                    Obras Sociales y Prepagas
                </CardTitle>
                <CardDescription>
                    Selecciona las coberturas que aceptas en tus consultas. Esto permitirá que los pacientes te encuentren al filtrar.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allInsurances.map(ins => (
                        <div key={ins.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                            <Checkbox 
                                id={ins.id} 
                                checked={selectedIds.includes(ins.id)}
                                onCheckedChange={(checked) => handleToggle(ins.id, checked as boolean)}
                            />
                            <label
                                htmlFor={ins.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                            >
                                {ins.name}
                            </label>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DoctorInsurancesModule;
