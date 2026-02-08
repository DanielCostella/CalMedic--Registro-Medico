import React, { useState, useEffect } from 'react';
import { Zap, Plus, Save, Printer, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tooth {
    number: number;
    name: string;
    status: 'healthy' | 'decay' | 'filled' | 'crown' | 'extraction' | 'implant' | 'root_canal';
    observations?: string;
    date?: string;
    treatment?: string;
}

interface DentalTreatment {
    id: string;
    patient: string;
    date: Date;
    type: string;
    teeth: number[];
    description: string;
    cost: number;
    status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    sessions: number;
    currentSession: number;
}

interface TreatmentPlan {
    id: string;
    patient: string;
    creationDate: Date;
    treatments: DentalTreatment[];
    totalCost: number;
    status: 'proposed' | 'accepted' | 'in_progress' | 'completed';
    observations: string;
}

const DentistryModule: React.FC = () => {
    const [odontogram, setOdontogram] = useState<Tooth[]>([]);
    const [treatments, setTreatments] = useState<DentalTreatment[]>([]);
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [newTreatment, setNewTreatment] = useState({
        type: '',
        description: '',
        cost: 0,
        sessions: 1
    });

    // Initialize odontogram with 32 teeth
    useEffect(() => {
        const initialTeeth: Tooth[] = [];

        // Upper teeth (18-11, 21-28)
        for (let i = 18; i >= 11; i--) {
            initialTeeth.push({
                number: i,
                name: getToothName(i),
                status: 'healthy'
            });
        }
        for (let i = 21; i <= 28; i++) {
            initialTeeth.push({
                number: i,
                name: getToothName(i),
                status: 'healthy'
            });
        }

        // Lower teeth (48-41, 31-38)
        for (let i = 48; i >= 41; i--) {
            initialTeeth.push({
                number: i,
                name: getToothName(i),
                status: 'healthy'
            });
        }
        for (let i = 31; i <= 38; i++) {
            initialTeeth.push({
                number: i,
                name: getToothName(i),
                status: 'healthy'
            });
        }

        setOdontogram(initialTeeth);

        // Mock data
        const mockTreatments: DentalTreatment[] = [
            {
                id: '1',
                patient: 'Mary Smith',
                date: new Date(),
                type: 'Filling',
                teeth: [16, 17],
                description: 'Amalgam filling in upper molars',
                cost: 150.00,
                status: 'completed',
                sessions: 1,
                currentSession: 1
            },
            {
                id: '2',
                patient: 'John Doe',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                type: 'Root Canal',
                teeth: [26],
                description: 'Root canal treatment in upper molar',
                cost: 350.00,
                status: 'planned',
                sessions: 3,
                currentSession: 0
            }
        ];

        setTreatments(mockTreatments);
    }, []);

    const getToothName = (number: number): string => {
        const names: { [key: number]: string } = {
            // Upper Right
            18: 'Third Molar', 17: 'Second Molar', 16: 'First Molar', 15: 'Second Premolar',
            14: 'First Premolar', 13: 'Canine', 12: 'Lateral Incisor', 11: 'Central Incisor',
            // Upper Left
            21: 'Central Incisor', 22: 'Lateral Incisor', 23: 'Canine', 24: 'First Premolar',
            25: 'Second Premolar', 26: 'First Molar', 27: 'Second Molar', 28: 'Third Molar',
            // Lower Right
            48: 'Third Molar', 47: 'Second Molar', 46: 'First Molar', 45: 'Second Premolar',
            44: 'First Premolar', 43: 'Canine', 42: 'Lateral Incisor', 41: 'Central Incisor',
            // Lower Left
            31: 'Central Incisor', 32: 'Lateral Incisor', 33: 'Canine', 34: 'First Premolar',
            35: 'Second Premolar', 36: 'First Molar', 37: 'Second Molar', 38: 'Third Molar'
        };
        return names[number] || 'Tooth';
    };

    const getToothColor = (status: string): string => {
        switch (status) {
            case 'healthy': return 'bg-green-100 border-green-300 text-green-800';
            case 'decay': return 'bg-red-100 border-red-300 text-red-800';
            case 'filled': return 'bg-blue-100 border-blue-300 text-blue-800';
            case 'crown': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'extraction': return 'bg-gray-100 border-gray-300 text-gray-800';
            case 'implant': return 'bg-purple-100 border-purple-300 text-purple-800';
            case 'root_canal': return 'bg-orange-100 border-orange-300 text-orange-800';
            default: return 'bg-gray-100 border-gray-300 text-gray-800';
        }
    };

    const updateTooth = (number: number, newStatus: string, observations?: string) => {
        setOdontogram(prev => prev.map(tooth =>
            tooth.number === number
                ? {
                    ...tooth,
                    status: newStatus as Tooth['status'],
                    observations,
                    date: new Date().toLocaleDateString()
                }
                : tooth
        ));
    };

    const addTreatment = () => {
        if (!selectedTooth || !newTreatment.type) return;

        const treatment: DentalTreatment = {
            id: Date.now().toString(),
            patient: 'Current Patient',
            date: new Date(),
            type: newTreatment.type,
            teeth: [selectedTooth],
            description: newTreatment.description,
            cost: newTreatment.cost,
            status: 'planned',
            sessions: newTreatment.sessions,
            currentSession: 0
        };

        setTreatments(prev => [...prev, treatment]);
        setNewTreatment({ type: '', description: '', cost: 0, sessions: 1 });
        setSelectedTooth(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
            case 'planned': return <Calendar className="w-4 h-4 text-orange-600" />;
            case 'cancelled': return <AlertTriangle className="w-4 h-4 text-red-600" />;
            default: return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <div>
                        <h2 className="text-2xl font-bold">Dentistry Module</h2>
                        <p className="text-gray-600">Digital odontogram and dental treatment management</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print Odontogram
                    </Button>
                    <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="odontogram" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="odontogram">Odontogram</TabsTrigger>
                    <TabsTrigger value="treatments">Treatments</TabsTrigger>
                    <TabsTrigger value="plans">Treatment Plans</TabsTrigger>
                    <TabsTrigger value="history">Dental History</TabsTrigger>
                </TabsList>

                <TabsContent value="odontogram" className="space-y-6">
                    {/* Legend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Odontogram Legend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                {[
                                    { status: 'healthy', label: 'Healthy' },
                                    { status: 'decay', label: 'Decay' },
                                    { status: 'filled', label: 'Filled' },
                                    { status: 'crown', label: 'Crown' },
                                    { status: 'extraction', label: 'Extraction' },
                                    { status: 'implant', label: 'Implant' },
                                    { status: 'root_canal', label: 'Root Canal' }
                                ].map(item => (
                                    <div key={item.status} className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border-2 ${getToothColor(item.status)}`}></div>
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Odontogram */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Digital Odontogram</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {/* Upper Teeth */}
                                <div>
                                    <h4 className="font-medium mb-4 text-center">Upper Jaw</h4>
                                    <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                                        {odontogram.slice(0, 16).map((tooth) => (
                                            <div
                                                key={tooth.number}
                                                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getToothColor(tooth.status)
                                                    } ${selectedTooth === tooth.number ? 'ring-2 ring-blue-500' : ''}`}
                                                onClick={() => setSelectedTooth(tooth.number)}
                                            >
                                                <div className="text-center">
                                                    <div className="text-xs font-bold">{tooth.number}</div>
                                                    <Zap className="w-6 h-6 mx-auto my-1" />
                                                    <div className="text-xs">{tooth.name.split(' ')[0]}</div>
                                                </div>
                                                {tooth.observations && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lower Teeth */}
                                <div>
                                    <h4 className="font-medium mb-4 text-center">Lower Jaw</h4>
                                    <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
                                        {odontogram.slice(16, 32).map((tooth) => (
                                            <div
                                                key={tooth.number}
                                                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getToothColor(tooth.status)
                                                    } ${selectedTooth === tooth.number ? 'ring-2 ring-blue-500' : ''}`}
                                                onClick={() => setSelectedTooth(tooth.number)}
                                            >
                                                <div className="text-center">
                                                    <div className="text-xs font-bold">{tooth.number}</div>
                                                    <Zap className="w-6 h-6 mx-auto my-1" />
                                                    <div className="text-xs">{tooth.name.split(' ')[0]}</div>
                                                </div>
                                                {tooth.observations && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Panel */}
                    {selectedTooth && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Edit Tooth {selectedTooth} - {
                                        odontogram.find(d => d.number === selectedTooth)?.name
                                    }
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tooth Status</Label>
                                        <Select
                                            value={odontogram.find(d => d.number === selectedTooth)?.status}
                                            onValueChange={(value: string) => updateTooth(selectedTooth, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="healthy">Healthy</SelectItem>
                                                <SelectItem value="decay">Decay</SelectItem>
                                                <SelectItem value="filled">Filled</SelectItem>
                                                <SelectItem value="crown">Crown</SelectItem>
                                                <SelectItem value="extraction">Extraction</SelectItem>
                                                <SelectItem value="implant">Implant</SelectItem>
                                                <SelectItem value="root_canal">Root Canal</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Observations</Label>
                                        <Textarea
                                            placeholder="Tooth notes..."
                                            value={odontogram.find(d => d.number === selectedTooth)?.observations || ''}
                                            onChange={(e) => updateTooth(
                                                selectedTooth,
                                                odontogram.find(d => d.number === selectedTooth)?.status || 'healthy',
                                                e.target.value
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="treatments" className="space-y-6">
                    {/* New Treatment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                New Treatment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <Label>Treatment Type</Label>
                                    <Select
                                        value={newTreatment.type}
                                        onValueChange={(value) => setNewTreatment(prev => ({ ...prev, type: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cleaning">Cleaning</SelectItem>
                                            <SelectItem value="filling">Filling</SelectItem>
                                            <SelectItem value="root_canal">Root Canal</SelectItem>
                                            <SelectItem value="extraction">Extraction</SelectItem>
                                            <SelectItem value="crown">Crown</SelectItem>
                                            <SelectItem value="implant">Implant</SelectItem>
                                            <SelectItem value="orthodontics">Orthodontics</SelectItem>
                                            <SelectItem value="whitening">Whitening</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Cost (USD)</Label>
                                    <Input
                                        type="number"
                                        value={newTreatment.cost}
                                        onChange={(e) => setNewTreatment(prev => ({ ...prev, cost: Number(e.target.value) }))}
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <Label>Sessions</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={newTreatment.sessions}
                                        onChange={(e) => setNewTreatment(prev => ({ ...prev, sessions: Number(e.target.value) }))}
                                    />
                                </div>

                                <div className="flex items-end">
                                    <Button onClick={addTreatment} className="w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label>Treatment Description</Label>
                                <Textarea
                                    value={newTreatment.description}
                                    onChange={(e) => setNewTreatment(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed treatment description..."
                                />
                            </div>

                            {selectedTooth && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        Selected tooth: <strong>{selectedTooth}</strong> - {
                                            odontogram.find(d => d.number === selectedTooth)?.name
                                        }
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Treatment List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduled Treatments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {treatments.map((treatment) => (
                                    <div key={treatment.id} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(treatment.status)}
                                                <div>
                                                    <h4 className="font-medium">{treatment.type}</h4>
                                                    <p className="text-sm text-gray-600">{treatment.patient}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    ${treatment.cost.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {treatment.date.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-700 mb-2">{treatment.description}</p>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-4">
                                                <span>Teeth: {treatment.teeth.join(', ')}</span>
                                                <span>Session {treatment.currentSession}/{treatment.sessions}</span>
                                            </div>

                                            <Badge
                                                className={
                                                    treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        treatment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            treatment.status === 'planned' ? 'bg-orange-100 text-orange-800' :
                                                                'bg-red-100 text-red-800'
                                                }
                                            >
                                                {treatment.status.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="plans">
                    <Card>
                        <CardHeader>
                            <CardTitle>Treatment Plans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-gray-500">
                                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Treatment plans functionality in development</p>
                                <p className="text-sm mt-2">Coming soon: Creation and management of comprehensive plans</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Dental History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Dental Cleaning</h4>
                                        <span className="text-sm text-gray-500">2024-01-15</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Complete prophylaxis, fluoride application</p>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filling Tooth 16</h4>
                                        <span className="text-sm text-gray-500">2024-01-08</span>
                                    </div>
                                    <p className="text-sm text-gray-600">Composite resin filling</p>
                                </div>

                                <div className="border-l-4 border-orange-500 pl-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Initial Evaluation</h4>
                                        <span className="text-sm text-gray-500">2023-12-20</span>
                                    </div>
                                    <p className="text-sm text-gray-600">First consultation, panoramic X-rays</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DentistryModule;
