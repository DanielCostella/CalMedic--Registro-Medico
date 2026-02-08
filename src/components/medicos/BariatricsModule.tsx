import React, { useState, useEffect } from 'react';
import { Scale, TrendingDown, Apple, Activity, AlertTriangle, CheckCircle, Calendar, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface BariatricEvaluation {
    patient: string;
    evaluationDate: Date;
    initialWeight: number;
    height: number;
    initialBMI: number;
    idealWeight: number;
    excessWeight: number;

    // Comorbidities
    type2Diabetes: boolean;
    hypertension: boolean;
    sleepApnea: boolean;
    dyslipidemia: boolean;
    arthritis: boolean;
    gastricReflux: boolean;

    // Required evaluations
    psychologicalEvaluation: 'pending' | 'approved' | 'rejected';
    nutritionalEvaluation: 'pending' | 'approved' | 'rejected';
    cardiologicalEvaluation: 'pending' | 'approved' | 'rejected';
    endocrinologicalEvaluation: 'pending' | 'approved' | 'rejected';

    // Pre-operative studies
    upperEndoscopy: 'pending' | 'normal' | 'abnormal';
    abdominalUltrasound: 'pending' | 'normal' | 'abnormal';
    bariumSeries: 'pending' | 'normal' | 'abnormal';

    candidate: boolean;
    observations: string;
}

interface WeightFollowUp {
    date: Date;
    weight: number;
    bmi: number;
    weightLossPercentage: number;
    excessLostPercentage: number;
    abdominalCircumference: number;
    bloodPressure: string;
    glucose: number;
    observations?: string;
}

interface BariatricLab {
    date: Date;
    // Nutritional follow-up
    albumin: number;
    prealbumin: number;
    transferrin: number;

    // Vitamins and minerals
    vitaminB12: number;
    folicAcid: number;
    vitaminD: number;
    iron: number;
    ferritin: number;
    calcium: number;
    magnesium: number;
    zinc: number;

    // Metabolism
    glucose: number;
    hba1c: number;
    insulin: number;
    totalCholesterol: number;
    hdl: number;
    ldl: number;
    triglycerides: number;

    // Liver function
    alt: number;
    ast: number;
    bilirubin: number;

    deficiencies: string[];
    recommendations: string[];
}

const BariatricsModule: React.FC = () => {
    const [evaluations, setEvaluations] = useState<BariatricEvaluation[]>([]);
    const [followUps, setFollowUps] = useState<WeightFollowUp[]>([]);
    const [labs, setLabs] = useState<BariatricLab[]>([]);

    const [newEvaluation, setNewEvaluation] = useState({
        patient: '',
        initialWeight: 0,
        height: 0,
        observations: ''
    });

    const [newFollowUp, setNewFollowUp] = useState({
        weight: 0,
        abdominalCircumference: 0,
        bloodPressure: '',
        glucose: 0,
        observations: ''
    });

    useEffect(() => {
        // Mock data
        const mockEvaluations: BariatricEvaluation[] = [
            {
                patient: 'Mary Smith',
                evaluationDate: new Date(),
                initialWeight: 120,
                height: 165,
                initialBMI: 44.1,
                idealWeight: 65,
                excessWeight: 55,
                type2Diabetes: true,
                hypertension: true,
                sleepApnea: false,
                dyslipidemia: true,
                arthritis: false,
                gastricReflux: true,
                psychologicalEvaluation: 'approved',
                nutritionalEvaluation: 'approved',
                cardiologicalEvaluation: 'pending',
                endocrinologicalEvaluation: 'approved',
                upperEndoscopy: 'normal',
                abdominalUltrasound: 'normal',
                bariumSeries: 'pending',
                candidate: true,
                observations: 'Ideal candidate for gastric sleeve'
            }
        ];

        const mockFollowUps: WeightFollowUp[] = [
            {
                date: new Date(),
                weight: 95,
                bmi: 34.9,
                weightLossPercentage: 20.8,
                excessLostPercentage: 45.5,
                abdominalCircumference: 95,
                bloodPressure: '130/85',
                glucose: 110,
                observations: 'Excellent progress, continue with nutritional plan'
            }
        ];

        setEvaluations(mockEvaluations);
        setFollowUps(mockFollowUps);
    }, []);

    const calculateBMI = (weight: number, height: number): number => {
        if (weight <= 0 || height <= 0) return 0;
        return weight / ((height / 100) ** 2);
    };

    const calculateIdealWeight = (height: number): number => {
        return height > 150 ? 50 + 0.91 * (height - 152.4) : 45.5;
    };

    const addEvaluation = () => {
        if (!newEvaluation.patient || newEvaluation.initialWeight <= 0 || newEvaluation.height <= 0) return;
        const bmi = calculateBMI(newEvaluation.initialWeight, newEvaluation.height);
        const idealWeight = calculateIdealWeight(newEvaluation.height);
        const evaluation: BariatricEvaluation = {
            patient: newEvaluation.patient,
            evaluationDate: new Date(),
            initialWeight: newEvaluation.initialWeight,
            height: newEvaluation.height,
            initialBMI: bmi,
            idealWeight,
            excessWeight: newEvaluation.initialWeight - idealWeight,
            type2Diabetes: false,
            hypertension: false,
            sleepApnea: false,
            dyslipidemia: false,
            arthritis: false,
            gastricReflux: false,
            psychologicalEvaluation: 'pending',
            nutritionalEvaluation: 'pending',
            cardiologicalEvaluation: 'pending',
            endocrinologicalEvaluation: 'pending',
            upperEndoscopy: 'pending',
            abdominalUltrasound: 'pending',
            bariumSeries: 'pending',
            candidate: bmi >= 40 || (bmi >= 35 && true),
            observations: newEvaluation.observations
        };
        setEvaluations(prev => [evaluation, ...prev]);
        setNewEvaluation({ patient: '', initialWeight: 0, height: 0, observations: '' });
    };

    const getBMIColor = (bmi: number): string => {
        if (bmi < 25) return 'text-green-600 bg-green-50';
        if (bmi < 30) return 'text-yellow-600 bg-yellow-50';
        if (bmi < 35) return 'text-orange-600 bg-orange-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Scale className="w-6 h-6 text-orange-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Bariatric Surgery Module</h2>
                        <p className="text-gray-600">Comprehensive weight loss surgery tracking</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><TrendingDown className="w-4 h-4 mr-2" />Progress Chart</Button>
                    <Button><Target className="w-4 h-4 mr-2" />New Evaluation</Button>
                </div>
            </div>

            <Tabs defaultValue="evaluation" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                    <TabsTrigger value="follow-up">Follow-up</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="labs">Labs</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent value="evaluation" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>New Bariatric Evaluation</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input placeholder="Patient Name" value={newEvaluation.patient} onChange={(e) => setNewEvaluation(prev => ({ ...prev, patient: e.target.value }))} />
                                <Input type="number" placeholder="Initial Weight (kg)" value={newEvaluation.initialWeight || ''} onChange={(e) => setNewEvaluation(prev => ({ ...prev, initialWeight: Number(e.target.value) }))} />
                                <Input type="number" placeholder="Height (cm)" value={newEvaluation.height || ''} onChange={(e) => setNewEvaluation(prev => ({ ...prev, height: Number(e.target.value) }))} />
                                <Button onClick={addEvaluation} className="w-full">Create Evaluation</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {evaluations.map((ev, i) => (
                        <Card key={i} className="mb-4">
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h4 className="font-bold">{ev.patient}</h4>
                                        <p className="text-sm text-gray-500">{ev.evaluationDate.toLocaleDateString()}</p>
                                    </div>
                                    <Badge className={getBMIColor(ev.initialBMI)}>BMI: {ev.initialBMI.toFixed(1)}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div><p>Weight: {ev.initialWeight} kg</p><p>Ideal: {ev.idealWeight.toFixed(1)} kg</p></div>
                                    <div><p>Candidate: {ev.candidate ? 'Yes' : 'No'}</p></div>
                                    <div><p>Status: {ev.psychologicalEvaluation}</p></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="follow-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card><CardContent className="p-6 text-center">
                            <h4 className="text-sm text-gray-500 mb-1">Current Weight</h4>
                            <p className="text-3xl font-bold">{followUps[0]?.weight || 0} kg</p>
                        </CardContent></Card>
                        <Card><CardContent className="p-6 text-center">
                            <h4 className="text-sm text-gray-500 mb-1">Weight Loss</h4>
                            <p className="text-3xl font-bold text-green-600">{followUps[0]?.weightLossPercentage.toFixed(1) || 0}%</p>
                        </CardContent></Card>
                    </div>
                </TabsContent>

                <TabsContent value="nutrition">
                    <div className="text-center py-12 text-gray-500">
                        <Apple className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Nutritional plans and supplement tracking</p>
                    </div>
                </TabsContent>

                <TabsContent value="labs">
                    <div className="text-center py-12 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Specialized bariatric lab panels tracking</p>
                    </div>
                </TabsContent>

                <TabsContent value="stats">
                    <div className="text-center py-12 text-gray-500">
                        <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Population health and outcomes statistics</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BariatricsModule;
