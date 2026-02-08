import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Download, Eye, Calendar, User, Stethoscope, Pill, TestTube, Upload, Filter, Clipboard, FlaskConical, UserCheck, Camera, Send, Printer, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Checkbox } from '@/components/ui/checkbox';

interface MedicalHistoryProps {
    patient?: any | null;
    doctor?: any | null;
}

const MedicalHistory: React.FC<MedicalHistoryProps> = ({ patient, doctor }) => {
    const [loading, setLoading] = useState(true);
    const [histories, setHistories] = useState<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="p-6 flex justify-center items-center">Loading medical history...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Medical History</h1>
                    <p className="text-gray-600">Complete record of consultations and treatments</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4 mr-2" />New Record</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Patient Info</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500 italic">Select a patient to view their full history</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <Card className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No medical records found for the selection</p>
                </Card>
            </div>
        </div>
    );
};

export default MedicalHistory;
