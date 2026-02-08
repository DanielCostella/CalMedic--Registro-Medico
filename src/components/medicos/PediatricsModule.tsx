import React, { useState, useEffect } from 'react';
import { Baby, TrendingUp, Syringe, Scale, Ruler, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GrowthMeasure {
    date: Date;
    age: number; // in months
    weight: number; // in kg
    height: number; // in cm
    headCircumference: number; // in cm
    weightPercentile: number;
    heightPercentile: number;
    hcPercentile: number;
    observations?: string;
}

interface Vaccine {
    name: string;
    age: string;
    date?: Date;
    applied: boolean;
    lot?: string;
    observations?: string;
    adverseReaction?: boolean;
}

interface PsychomotorDevelopment {
    area: 'gross_motor' | 'fine_motor' | 'language' | 'social' | 'cognitive';
    milestone: string;
    expectedAge: number; // in months
    achievedAge?: number; // in months
    achieved: boolean;
    observations?: string;
}

interface NutritionalEvaluation {
    date: Date;
    feedingType: 'exclusive_breastfeeding' | 'mixed_breastfeeding' | 'formula' | 'complementary_feeding';
    allergies: string[];
    supplements: string[];
    observations: string;
    recommendations: string[];
}

const PediatricsModule: React.FC = () => {
    const [measures, setMeasures] = useState<GrowthMeasure[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [development, setDevelopment] = useState<PsychomotorDevelopment[]>([]);
    const [newMeasure, setNewMeasure] = useState({
        weight: 0,
        height: 0,
        headCircumference: 0,
        observations: ''
    });

    const vaccinationSchedule: Vaccine[] = [
        // Newborn
        { name: 'BCG', age: 'Newborn', applied: false },
        { name: 'Hepatitis B', age: 'Newborn', applied: false },

        // 2 months
        { name: 'Pentavalent (1st dose)', age: '2 months', applied: false },
        { name: 'Polio (1st dose)', age: '2 months', applied: false },
        { name: 'Rotavirus (1st dose)', age: '2 months', applied: false },
        { name: 'Pneumococcal (1st dose)', age: '2 months', applied: false },

        // 4 months
        { name: 'Pentavalent (2nd dose)', age: '4 months', applied: false },
        { name: 'Polio (2nd dose)', age: '4 months', applied: false },
        { name: 'Rotavirus (2nd dose)', age: '4 months', applied: false },
        { name: 'Pneumococcal (2nd dose)', age: '4 months', applied: false },

        // 6 months
        { name: 'Pentavalent (3rd dose)', age: '6 months', applied: false },
        { name: 'Polio (3rd dose)', age: '6 months', applied: false },
        { name: 'Influenza (1st dose)', age: '6 months', applied: false },

        // 12 months
        { name: 'MMR (Measles, Mumps, Rubella)', age: '12 months', applied: false },
        { name: 'Pneumococcal (booster)', age: '12 months', applied: false },
        { name: 'Varicella', age: '12 months', applied: false },

        // 18 months
        { name: 'Pentavalent (booster)', age: '18 months', applied: false },
        { name: 'Polio (booster)', age: '18 months', applied: false },

        // 5 years
        { name: 'MMR (booster)', age: '5 years', applied: false },
        { name: 'DPT (booster)', age: '5 years', applied: false }
    ];

    const developmentMilestones: PsychomotorDevelopment[] = [
        // Gross motor
        { area: 'gross_motor', milestone: 'Holds head up', expectedAge: 3, achieved: false },
        { area: 'gross_motor', milestone: 'Sits without support', expectedAge: 6, achieved: false },
        { area: 'gross_motor', milestone: 'Crawls', expectedAge: 9, achieved: false },
        { area: 'gross_motor', milestone: 'Walks alone', expectedAge: 12, achieved: false },
        { area: 'gross_motor', milestone: 'Runs', expectedAge: 18, achieved: false },
        { area: 'gross_motor', milestone: 'Jumps with both feet', expectedAge: 24, achieved: false },

        // Fine motor
        { area: 'fine_motor', milestone: 'Grasps objects', expectedAge: 4, achieved: false },
        { area: 'fine_motor', milestone: 'Pincer grasp', expectedAge: 9, achieved: false },
        { area: 'fine_motor', milestone: 'Scribbles', expectedAge: 15, achieved: false },
        { area: 'fine_motor', milestone: 'Copies circle', expectedAge: 36, achieved: false },

        // Language
        { area: 'language', milestone: 'Social smile', expectedAge: 2, achieved: false },
        { area: 'language', milestone: 'Babbles', expectedAge: 6, achieved: false },
        { area: 'language', milestone: 'First word', expectedAge: 12, achieved: false },
        { area: 'language', milestone: '10 words', expectedAge: 18, achieved: false },
        { area: 'language', milestone: '2-word phrases', expectedAge: 24, achieved: false },

        // Social
        { area: 'social', milestone: 'Recognizes mother', expectedAge: 3, achieved: false },
        { area: 'social', milestone: 'Plays peek-a-boo', expectedAge: 9, achieved: false },
        { area: 'social', milestone: 'Imitates activities', expectedAge: 18, achieved: false },
        { area: 'social', milestone: 'Parallel play', expectedAge: 24, achieved: false }
    ];

    useEffect(() => {
        setVaccines(vaccinationSchedule);
        setDevelopment(developmentMilestones);

        // Mock data
        const mockMeasures: GrowthMeasure[] = [
            {
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                age: 6,
                weight: 7.5,
                height: 67,
                headCircumference: 43,
                weightPercentile: 50,
                heightPercentile: 45,
                hcPercentile: 55
            },
            {
                date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
                age: 4,
                weight: 6.8,
                height: 63,
                headCircumference: 41,
                weightPercentile: 45,
                heightPercentile: 40,
                hcPercentile: 50
            }
        ];

        setMeasures(mockMeasures);
    }, []);

    const calculatePercentile = (value: number, type: 'weight' | 'height' | 'hc', age: number): number => {
        // Simulation of percentile calculation based on WHO growth charts
        if (type === 'weight') {
            if (age <= 6) return Math.min(95, Math.max(5, 30 + (value / age) * 10));
            return Math.min(95, Math.max(5, 25 + (value / age) * 8));
        } else if (type === 'height') {
            return Math.min(95, Math.max(5, 20 + (value / age) * 0.8));
        } else {
            return Math.min(95, Math.max(5, 35 + (value / age) * 1.2));
        }
    };

    const addMeasure = () => {
        if (newMeasure.weight <= 0 || newMeasure.height <= 0) return;

        const age = 6; // Mock - in real implementation would be calculated based on birth date

        const measure: GrowthMeasure = {
            date: new Date(),
            age,
            weight: newMeasure.weight,
            height: newMeasure.height,
            headCircumference: newMeasure.headCircumference,
            weightPercentile: calculatePercentile(newMeasure.weight, 'weight', age),
            heightPercentile: calculatePercentile(newMeasure.height, 'height', age),
            hcPercentile: calculatePercentile(newMeasure.headCircumference, 'hc', age),
            observations: newMeasure.observations
        };

        setMeasures(prev => [measure, ...prev]);
        setNewMeasure({ weight: 0, height: 0, headCircumference: 0, observations: '' });
    };

    const markVaccine = (index: number, applied: boolean) => {
        setVaccines(prev => prev.map((v, i) =>
            i === index ? { ...v, applied, date: applied ? new Date() : undefined } : v
        ));
    };

    const markMilestone = (index: number, achieved: boolean) => {
        setDevelopment(prev => prev.map((m, i) =>
            i === index ? { ...m, achieved, achievedAge: achieved ? 6 : undefined } : m
        ));
    };

    const getPercentileColor = (percentile: number): string => {
        if (percentile < 10) return 'text-red-600 bg-red-50';
        if (percentile < 25) return 'text-orange-600 bg-orange-50';
        if (percentile > 90) return 'text-blue-600 bg-blue-50';
        return 'text-green-600 bg-green-50';
    };

    const getAreaColor = (area: string): string => {
        switch (area) {
            case 'gross_motor': return 'bg-blue-100 text-blue-800';
            case 'fine_motor': return 'bg-green-100 text-green-800';
            case 'language': return 'bg-purple-100 text-purple-800';
            case 'social': return 'bg-orange-100 text-orange-800';
            case 'cognitive': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Baby className="w-6 h-6 text-pink-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Pediatrics Module</h2>
                        <p className="text-gray-600">Comprehensive tracking of child growth and development</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Growth Charts
                    </Button>
                    <Button>
                        <Calendar className="w-4 h-4 mr-2" />
                        Next Consultation
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="growth" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="growth">Growth</TabsTrigger>
                    <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
                    <TabsTrigger value="development">Development</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="growth" className="space-y-6">
                    {/* New measure */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scale className="w-5 h-5" />
                                Register New Measurement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={newMeasure.weight || ''}
                                        onChange={(e) => setNewMeasure(prev => ({ ...prev, weight: Number(e.target.value) }))}
                                        placeholder="0.0"
                                    />
                                </div>

                                <div>
                                    <Label>Height (cm)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={newMeasure.height || ''}
                                        onChange={(e) => setNewMeasure(prev => ({ ...prev, height: Number(e.target.value) }))}
                                        placeholder="0.0"
                                    />
                                </div>

                                <div>
                                    <Label>Head Circumference (cm)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={newMeasure.headCircumference || ''}
                                        onChange={(e) => setNewMeasure(prev => ({ ...prev, headCircumference: Number(e.target.value) }))}
                                        placeholder="0.0"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button onClick={addMeasure} className="w-full">
                                        <Scale className="w-4 h-4 mr-2" />
                                        Register
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label>Observations</Label>
                                <Textarea
                                    value={newMeasure.observations}
                                    onChange={(e) => setNewMeasure(prev => ({ ...prev, observations: e.target.value }))}
                                    placeholder="Measurement observations..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Growth curves */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Weight</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {measures.slice(0, 3).map((measure, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{measure.weight} kg</p>
                                                <p className="text-sm text-gray-600">{measure.date.toLocaleDateString()}</p>
                                            </div>
                                            <Badge className={getPercentileColor(measure.weightPercentile)}>
                                                P{measure.weightPercentile}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Height</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {measures.slice(0, 3).map((measure, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{measure.height} cm</p>
                                                <p className="text-sm text-gray-600">{measure.date.toLocaleDateString()}</p>
                                            </div>
                                            <Badge className={getPercentileColor(measure.heightPercentile)}>
                                                P{measure.heightPercentile}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Head Circumference</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {measures.slice(0, 3).map((measure, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{measure.headCircumference} cm</p>
                                                <p className="text-sm text-gray-600">{measure.date.toLocaleDateString()}</p>
                                            </div>
                                            <Badge className={getPercentileColor(measure.hcPercentile)}>
                                                P{measure.hcPercentile}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mock Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Growth Curve - Weight/Age</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>WHO Growth Curve Charts</p>
                                    <p className="text-sm mt-2">Chart.js integration in development</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="vaccination" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Syringe className="w-5 h-5" />
                                Vaccination Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {vaccines.map((vaccine, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${vaccine.applied
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-gray-300 hover:border-green-400'
                                                    }`}
                                                onClick={() => markVaccine(index, !vaccine.applied)}
                                            >
                                                {vaccine.applied && <CheckCircle className="w-4 h-4 text-white" />}
                                            </div>

                                            <div>
                                                <h4 className="font-medium">{vaccine.name}</h4>
                                                <p className="text-sm text-gray-600">{vaccine.age}</p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            {vaccine.applied ? (
                                                <div>
                                                    <Badge className="bg-green-100 text-green-800">Applied</Badge>
                                                    {vaccine.date && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {vaccine.date.toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <Badge variant="outline">Pending</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vaccination Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Vaccines Applied</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {vaccines.filter(v => v.applied).length}
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Vaccines Pending</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {vaccines.filter(v => !v.applied).length}
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Coverage</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {Math.round((vaccines.filter(v => v.applied).length / vaccines.length) * 100)}%
                                        </p>
                                    </div>
                                    <Syringe className="w-8 h-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="development" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Psychomotor Development Milestones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {['gross_motor', 'fine_motor', 'language', 'social'].map(area => (
                                    <div key={area}>
                                        <h4 className="font-medium mb-3 capitalize flex items-center gap-2">
                                            <Badge className={getAreaColor(area)}>
                                                {area.replace('_', ' ')}
                                            </Badge>
                                        </h4>

                                        <div className="space-y-2">
                                            {development.filter(h => h.area === area).map((milestone, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${milestone.achieved
                                                                    ? 'bg-green-500 border-green-500'
                                                                    : 'border-gray-300 hover:border-green-400'
                                                                }`}
                                                            onClick={() => markMilestone(development.indexOf(milestone), !milestone.achieved)}
                                                        >
                                                            {milestone.achieved && <CheckCircle className="w-3 h-3 text-white" />}
                                                        </div>

                                                        <div>
                                                            <p className="font-medium">{milestone.milestone}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Expected age: {milestone.expectedAge} months
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {milestone.achieved ? (
                                                        <Badge className="bg-green-100 text-green-800">Achieved</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Pending</Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="nutrition">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nutritional Evaluation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Feeding Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="exclusive_breastfeeding">Exclusive Breastfeeding</SelectItem>
                                                <SelectItem value="mixed_breastfeeding">Mixed Breastfeeding</SelectItem>
                                                <SelectItem value="formula">Formula</SelectItem>
                                                <SelectItem value="complementary_feeding">Complementary Feeding</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Supplements</Label>
                                        <Input placeholder="Vitamin D, Iron, etc." />
                                    </div>
                                </div>

                                <div>
                                    <Label>Food Allergies</Label>
                                    <Textarea placeholder="Register known allergies..." />
                                </div>

                                <div>
                                    <Label>Nutritional Recommendations</Label>
                                    <Textarea placeholder="Specific age-related recommendations..." />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="alerts">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                Alerts and Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <h4 className="font-medium text-orange-800">Pending Vaccine</h4>
                                    </div>
                                    <p className="text-sm text-orange-700">
                                        Pentavalent (2nd dose) scheduled for 4 months
                                    </p>
                                </div>

                                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <h4 className="font-medium text-blue-800">Growth Tracking</h4>
                                    </div>
                                    <p className="text-sm text-blue-700">
                                        Next measurement scheduled in 2 weeks
                                    </p>
                                </div>

                                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <h4 className="font-medium text-green-800">Normal Development</h4>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        All development milestones are within the expected range
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PediatricsModule;
