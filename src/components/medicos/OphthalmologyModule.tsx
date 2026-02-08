import React, { useState, useEffect } from 'react';
import { Eye, Camera, Glasses, TrendingUp, Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VisualExam {
    date: Date;
    rightEyeUC: string; // Uncorrected
    leftEyeUC: string;
    rightEyeCC: string; // Corrected
    leftEyeCC: string;
    binocularVision: string;
    observations?: string;
}

interface IntraocularPressure {
    date: Date;
    rightEyeMorning: number;
    leftEyeMorning: number;
    rightEyeAfternoon?: number;
    leftEyeAfternoon?: number;
    method: 'goldmann' | 'tonopen' | 'pneumatic';
    observations?: string;
}

interface LensPrescription {
    id: string;
    date: Date;
    type: 'distance' | 'near' | 'bifocal' | 'progressive';
    rightEyeSphere: number;
    rightEyeCylinder: number;
    rightEyeAxis: number;
    leftEyeSphere: number;
    leftEyeCylinder: number;
    leftEyeAxis: number;
    addition?: number;
    pupillaryDistance: number;
    observations?: string;
    status: 'active' | 'expired' | 'replaced';
}

interface OcularStudy {
    type: 'fundus' | 'visual_field' | 'oct' | 'angiography' | 'topography';
    date: Date;
    results: string;
    findings: string[];
    recommendations: string[];
    images?: string[];
}

interface OcularPathology {
    name: string;
    eye: 'right' | 'left' | 'both';
    diagnosisDate: Date;
    status: 'active' | 'controlled' | 'resolved';
    treatment: string;
    followUp: string;
}

const OphthalmologyModule: React.FC = () => {
    const [exams, setExams] = useState<VisualExam[]>([]);
    const [pressures, setPressures] = useState<IntraocularPressure[]>([]);
    const [prescriptions, setPrescriptions] = useState<LensPrescription[]>([]);
    const [studies, setStudies] = useState<OcularStudy[]>([]);
    const [pathologies, setPathologies] = useState<OcularPathology[]>([]);

    const [newExam, setNewExam] = useState({
        rightEyeUC: '',
        leftEyeUC: '',
        rightEyeCC: '',
        leftEyeCC: '',
        binocularVision: '',
        observations: ''
    });

    const [newPressure, setNewPressure] = useState({
        rightEyeMorning: 0,
        leftEyeMorning: 0,
        method: 'goldmann' as const,
        observations: ''
    });

    const [newPrescription, setNewPrescription] = useState({
        type: 'distance' as const,
        rightEyeSphere: 0,
        rightEyeCylinder: 0,
        rightEyeAxis: 0,
        leftEyeSphere: 0,
        leftEyeCylinder: 0,
        leftEyeAxis: 0,
        pupillaryDistance: 0,
        observations: ''
    });

    useEffect(() => {
        // Mock data
        const mockExams: VisualExam[] = [
            {
                date: new Date(),
                rightEyeUC: '20/30',
                leftEyeUC: '20/25',
                rightEyeCC: '20/20',
                leftEyeCC: '20/20',
                binocularVision: '20/20',
                observations: 'Patient reports occasional blurred vision'
            }
        ];

        const mockPressures: IntraocularPressure[] = [
            {
                date: new Date(),
                rightEyeMorning: 16,
                leftEyeMorning: 14,
                method: 'goldmann',
                observations: 'Pressure within normal limits'
            }
        ];

        const mockPrescriptions: LensPrescription[] = [
            {
                id: '1',
                date: new Date(),
                type: 'distance',
                rightEyeSphere: -1.25,
                rightEyeCylinder: -0.50,
                rightEyeAxis: 90,
                leftEyeSphere: -1.00,
                leftEyeCylinder: -0.25,
                leftEyeAxis: 85,
                pupillaryDistance: 62,
                status: 'active',
                observations: 'Initial prescription for mild myopia'
            }
        ];

        setExams(mockExams);
        setPressures(mockPressures);
        setPrescriptions(mockPrescriptions);
    }, []);

    const addExam = () => {
        if (!newExam.rightEyeUC || !newExam.leftEyeUC) return;
        const exam: VisualExam = { date: new Date(), ...newExam };
        setExams(prev => [exam, ...prev]);
        setNewExam({
            rightEyeUC: '',
            leftEyeUC: '',
            rightEyeCC: '',
            leftEyeCC: '',
            binocularVision: '',
            observations: ''
        });
    };

    const getPressureColor = (pressure: number): string => {
        if (pressure > 21) return 'text-red-600 bg-red-50';
        if (pressure > 18) return 'text-orange-600 bg-orange-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-purple-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Ophthalmology Module</h2>
                        <p className="text-gray-600">Comprehensive evaluation of eye and visual health</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Fundus Photo
                    </Button>
                    <Button>
                        <Glasses className="w-4 h-4 mr-2" />
                        New Prescription
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="acuity" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="acuity">Visual Acuity</TabsTrigger>
                    <TabsTrigger value="pressure">Eye Pressure</TabsTrigger>
                    <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    <TabsTrigger value="studies">Studies</TabsTrigger>
                    <TabsTrigger value="pathologies">Pathologies</TabsTrigger>
                    <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
                </TabsList>

                <TabsContent value="acuity" className="space-y-6">
                    {/* New Exam */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                New Visual Acuity Exam
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label>OD Uncorrected</Label>
                                    <Select value={newExam.rightEyeUC} onValueChange={(val) => setNewExam(prev => ({ ...prev, rightEyeUC: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="20/20">20/20</SelectItem><SelectItem value="20/30">20/30</SelectItem><SelectItem value="20/40">20/40</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>OI Uncorrected</Label>
                                    <Select value={newExam.leftEyeUC} onValueChange={(val) => setNewExam(prev => ({ ...prev, leftEyeUC: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="20/20">20/20</SelectItem><SelectItem value="20/30">20/30</SelectItem><SelectItem value="20/40">20/40</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button onClick={addExam} className="w-full"><Eye className="w-4 h-4 mr-2" />Register</Button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label>Observations</Label>
                                <Textarea value={newExam.observations} onChange={(e) => setNewExam(prev => ({ ...prev, observations: e.target.value }))} placeholder="Exam notes..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exam History */}
                    <Card>
                        <CardHeader><CardTitle>Visual Acuity History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {exams.map((exam, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3 font-medium">
                                            <span>Visual Acuity Exam</span>
                                            <span className="text-sm text-gray-500">{exam.date.toLocaleDateString()}</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div><p className="text-gray-600">OD U/C</p><p className="font-medium">{exam.rightEyeUC}</p></div>
                                            <div><p className="text-gray-600">OI U/C</p><p className="font-medium">{exam.leftEyeUC}</p></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pressure" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Intraocular Pressure History</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pressures.map((p, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium">IOP Measurement</h4>
                                            <Badge variant="outline">{p.method}</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                                <span>Right Eye: <strong>{p.rightEyeMorning} mmHg</strong></span>
                                                <Badge className={getPressureColor(p.rightEyeMorning)}>Normal</Badge>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                                <span>Left Eye: <strong>{p.leftEyeMorning} mmHg</strong></span>
                                                <Badge className={getPressureColor(p.leftEyeMorning)}>Normal</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="prescriptions">
                    <Card>
                        <CardHeader><CardTitle>Lens Prescriptions</CardTitle></CardHeader>
                        <CardContent>
                            {prescriptions.map((presc) => (
                                <div key={presc.id} className="border rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold">Lenses for {presc.type}</h4>
                                        <Badge className="bg-green-100 text-green-800">{presc.status.toUpperCase()}</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 text-sm">
                                        <div>
                                            <p className="font-bold border-b mb-2">Right Eye</p>
                                            <p>Sphere: {presc.rightEyeSphere}</p>
                                            <p>Cylinder: {presc.rightEyeCylinder}</p>
                                            <p>Axis: {presc.rightEyeAxis}°</p>
                                        </div>
                                        <div>
                                            <p className="font-bold border-b mb-2">Left Eye</p>
                                            <p>Sphere: {presc.leftEyeSphere}</p>
                                            <p>Cylinder: {presc.leftEyeCylinder}</p>
                                            <p>Axis: {presc.leftEyeAxis}°</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="studies">
                    <div className="text-center py-12 text-gray-500">
                        <Camera className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Imaging and studies panel in development</p>
                    </div>
                </TabsContent>

                <TabsContent value="pathologies">
                    <div className="text-center py-12 text-gray-500">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Chronic conditions tracking in development</p>
                    </div>
                </TabsContent>

                <TabsContent value="follow-up">
                    <div className="space-y-4">
                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                            <h4 className="font-bold text-blue-800 mb-1">Upcoming Control</h4>
                            <p className="text-sm text-blue-700">IOP check scheduled in 3 months</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OphthalmologyModule;
