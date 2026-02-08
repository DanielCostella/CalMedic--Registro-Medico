import React, { useState, useEffect } from 'react';
import { Scissors, Calendar, AlertTriangle, CheckCircle, Clock, FileText, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface PreoperativeEvaluation {
    patient: string;
    surgery: string;
    surgeryDate: Date;
    anestheticRisk: 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV';
    exams: PreoperativeExam[];
    consent: boolean;
    fasting: boolean;
    previousMedication: string[];
    allergies: string[];
    observations: string;
    status: 'pending' | 'completed' | 'incomplete';
}

interface PreoperativeExam {
    type: string;
    result: string;
    date: Date;
    normal: boolean;
    observations?: string;
}

interface SurgicalProcedure {
    id: string;
    patient: string;
    surgery: string;
    date: Date;
    duration: number; // in minutes
    surgeon: string;
    anesthesiologist: string;
    scrubNurse: string;
    anesthesiaType: 'general' | 'regional' | 'local' | 'sedation';
    incidents: string[];
    materialsUsed: string[];
    findings: string;
    procedure: string;
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface PostoperativeFollowUp {
    surgery: string;
    surgeryDate: Date;
    day: number;
    pain: number; // scale 1-10
    vitals: {
        temperature: number;
        systolicBP: number;
        diastolicBP: number;
        heartRate: number;
        respiratoryRate: number;
    };
    wound: {
        appearance: 'clean' | 'erythematous' | 'secretion' | 'dehiscence';
        pain: number;
        edema: boolean;
        bleeding: boolean;
    };
    mobility: 'normal' | 'limited' | 'restricted';
    complications: string[];
    medications: string[];
    observations: string;
    nextVisit: Date;
}

const SurgeryModule: React.FC = () => {
    const [evaluations, setEvaluations] = useState<PreoperativeEvaluation[]>([]);
    const [procedures, setProcedures] = useState<SurgicalProcedure[]>([]);
    const [followUps, setFollowUps] = useState<PostoperativeFollowUp[]>([]);

    const [newEvaluation, setNewEvaluation] = useState({
        patient: '',
        surgery: '',
        anestheticRisk: 'ASA I' as const,
        observations: ''
    });

    const [newFollowUp, setNewFollowUp] = useState({
        pain: 0,
        temperature: 36.5,
        systolicBP: 120,
        diastolicBP: 80,
        heartRate: 70,
        woundAppearance: 'clean' as const,
        observations: ''
    });

    useEffect(() => {
        // Mock data
        const mockEvaluations: PreoperativeEvaluation[] = [
            {
                patient: 'Mary Smith',
                surgery: 'Laparoscopic Cholecystectomy',
                surgeryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                anestheticRisk: 'ASA II',
                exams: [
                    { type: 'CBC', result: 'Normal', date: new Date(), normal: true },
                    { type: 'ECG', result: 'Normal sinus rhythm', date: new Date(), normal: true }
                ],
                consent: true,
                fasting: false,
                previousMedication: ['Omeprazole 20mg'],
                allergies: [],
                observations: 'Patient anxious, requires premedication',
                status: 'completed'
            }
        ];

        const mockProcedures: SurgicalProcedure[] = [
            {
                id: '1',
                patient: 'John Doe',
                surgery: 'Appendectomy',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                duration: 45,
                surgeon: 'Dr. Smith',
                anesthesiologist: 'Dr. Jones',
                scrubNurse: 'Nurse Williams',
                anesthesiaType: 'general',
                incidents: [],
                materialsUsed: ['Staplers', 'Trocars', 'Clips'],
                findings: 'Inflamed appendix without perforation',
                procedure: 'Laparoscopic appendectomy without complications',
                status: 'completed'
            }
        ];

        setEvaluations(mockEvaluations);
        setProcedures(mockProcedures);
    }, []);

    const addEvaluation = () => {
        if (!newEvaluation.patient || !newEvaluation.surgery) return;
        const evaluation: PreoperativeEvaluation = {
            ...newEvaluation,
            surgeryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            exams: [],
            consent: false,
            fasting: false,
            previousMedication: [],
            allergies: [],
            status: 'pending'
        };
        setEvaluations(prev => [evaluation, ...prev]);
        setNewEvaluation({ patient: '', surgery: '', anestheticRisk: 'ASA I', observations: '' });
    };

    const getRiskColor = (risk: string): string => {
        switch (risk) {
            case 'ASA I': return 'bg-green-100 text-green-800';
            case 'ASA II': return 'bg-yellow-100 text-yellow-800';
            case 'ASA III': return 'bg-orange-100 text-orange-800';
            case 'ASA IV': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
            case 'scheduled': return <Calendar className="w-4 h-4 text-orange-600" />;
            case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
            default: return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-red-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Surgery Module</h2>
                        <p className="text-gray-600">Comprehensive pre, intra, and postoperative tracking</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline"><FileText className="w-4 h-4 mr-2" />Surgical Protocol</Button>
                    <Button><Calendar className="w-4 h-4 mr-2" />Schedule Surgery</Button>
                </div>
            </div>

            <Tabs defaultValue="preoperative" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="preoperative">Pre-operative</TabsTrigger>
                    <TabsTrigger value="intraoperative">Intra-operative</TabsTrigger>
                    <TabsTrigger value="postoperative">Post-operative</TabsTrigger>
                    <TabsTrigger value="complications">Complications</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="preoperative" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>New Pre-operative Evaluation</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input placeholder="Patient Name" value={newEvaluation.patient} onChange={(e) => setNewEvaluation(prev => ({ ...prev, patient: e.target.value }))} />
                                <Select value={newEvaluation.surgery} onValueChange={(val) => setNewEvaluation(prev => ({ ...prev, surgery: val }))}>
                                    <SelectTrigger><SelectValue placeholder="Surgery Type..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="appendectomy">Appendectomy</SelectItem>
                                        <SelectItem value="cholecystectomy">Cholecystectomy</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={newEvaluation.anestheticRisk} onValueChange={(val: any) => setNewEvaluation(prev => ({ ...prev, anestheticRisk: val }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ASA I">ASA I - Healthy</SelectItem>
                                        <SelectItem value="ASA II">ASA II - Mild systemic disease</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={addEvaluation} className="mt-4">Create Evaluation</Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {evaluations.map((ev, i) => (
                            <Card key={i}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(ev.status)}
                                            <div>
                                                <h4 className="font-bold">{ev.patient}</h4>
                                                <p className="text-sm text-gray-600">{ev.surgery}</p>
                                            </div>
                                        </div>
                                        <Badge className={getRiskColor(ev.anestheticRisk)}>{ev.anestheticRisk}</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="intraoperative">
                    {procedures.map((p) => (
                        <Card key={p.id} className="mb-4">
                            <CardContent className="pt-6">
                                <div className="flex justify-between mb-4">
                                    <h4 className="font-bold">{p.patient} - {p.surgery}</h4>
                                    <span className="text-sm text-gray-500">{p.date.toLocaleDateString()}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <h5 className="font-bold mb-1">Team</h5>
                                        <p>Surgeon: {p.surgeon}</p>
                                        <p>Anesthesia: {p.anesthesiaType}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-1">Details</h5>
                                        <p>Findings: {p.findings}</p>
                                        <p>Duration: {p.duration} min</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="postoperative">
                    <div className="text-center py-12 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Postoperative tracking panel</p>
                    </div>
                </TabsContent>

                <TabsContent value="complications">
                    <div className="text-center py-12 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No complications recorded</p>
                    </div>
                </TabsContent>

                <TabsContent value="statistics">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card><CardContent className="p-6">Surgeries: {procedures.length}</CardContent></Card>
                        <Card><CardContent className="p-6">Avg Duration: 45 min</CardContent></Card>
                        <Card><CardContent className="p-6">Complication Rate: 0%</CardContent></Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SurgeryModule;
