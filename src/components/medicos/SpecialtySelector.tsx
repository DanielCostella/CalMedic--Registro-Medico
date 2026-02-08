import React from 'react';
import { Stethoscope, Baby, Eye, Scissors, Scale, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SpecialtySelectorProps {
    onSpecialtyChange: (specialty: string) => void;
    currentSpecialty: string;
}

const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({
    onSpecialtyChange,
    currentSpecialty
}) => {
    const specialties = [
        {
            id: 'general',
            name: 'General Medicine',
            description: 'General modules for all specialties',
            icon: <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-blue-500',
            modulesCount: 18,
            doctor: 'Dr. John Doe - General Medicine'
        },
        {
            id: 'dentistry',
            name: 'Dentistry',
            description: 'Digital odontogram and dental treatments',
            icon: <Zap className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-green-600',
            modulesCount: 1,
            isNew: true,
            doctor: 'Dr. Jane Smith - Dentist'
        },
        {
            id: 'pediatrics',
            name: 'Pediatrics',
            description: 'Growth curves and pediatric tracking',
            icon: <Baby className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-pink-600',
            modulesCount: 1,
            isNew: true,
            doctor: 'Dr. Robert Brown - Pediatrician'
        },
        {
            id: 'ophthalmology',
            name: 'Ophthalmology',
            description: 'Eye evaluation and lens prescription',
            icon: <Eye className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-purple-600',
            modulesCount: 1,
            isNew: true,
            doctor: 'Dr. Emily Davis - Ophthalmologist'
        },
        {
            id: 'surgery',
            name: 'General Surgery',
            description: 'Pre, intra, and post-operative tracking',
            icon: <Scissors className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-red-600',
            modulesCount: 1,
            isNew: true,
            doctor: 'Dr. Michael Wilson - General Surgeon'
        },
        {
            id: 'bariatrics',
            name: 'Bariatric Surgery',
            description: 'Weight loss surgery tracking',
            icon: <Scale className="w-4 h-4 sm:w-6 sm:h-6" />,
            color: 'bg-orange-600',
            modulesCount: 1,
            isNew: true,
            doctor: 'Dr. Sarah Miller - Bariatric Surgeon'
        }
    ];

    return (
        <div className="space-y-3 sm:space-y-4">
            <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">Select Specialty</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                    Choose a specialty to see specific available modules
                </p>
            </div>

            {/* Responsive Grid - Changes from 2 columns on mobile to 6 on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                {specialties.map((specialty) => (
                    <Card
                        key={specialty.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative ${currentSpecialty === specialty.id
                                ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50'
                                : 'hover:shadow-md'
                            }`}
                        onClick={() => onSpecialtyChange(specialty.id)}
                    >
                        {specialty.isNew && (
                            <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white z-10 text-xs scale-75 sm:scale-100">
                                New
                            </Badge>
                        )}

                        <CardContent className="p-2 sm:p-4">
                            <div className="flex flex-col items-center text-center space-y-1 sm:space-y-3">
                                <div className={`p-2 sm:p-3 rounded-lg ${specialty.color} text-white`}>
                                    {specialty.icon}
                                </div>

                                <div className="min-w-0 w-full">
                                    <h4 className="font-semibold text-xs sm:text-sm line-clamp-2">{specialty.name}</h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 hidden sm:block">
                                        {specialty.description}
                                    </p>
                                </div>

                                <Badge variant="outline" className="text-xs scale-75 sm:scale-100">
                                    {specialty.modulesCount} module{specialty.modulesCount > 1 ? 's' : ''}
                                </Badge>

                                {/* Example Doctor - Only visible on medium and large screens */}
                                <div className="text-xs text-blue-600 bg-blue-50 px-1 sm:px-2 py-1 rounded hidden md:block line-clamp-2">
                                    {specialty.doctor}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Current specialty information - Responsive */}
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-700">
                    <strong>Current Specialty:</strong> {
                        specialties.find(e => e.id === currentSpecialty)?.name || 'General Medicine'
                    }
                </p>
                <p className="text-xs text-blue-600 mt-1 hidden sm:block">
                    {specialties.find(e => e.id === currentSpecialty)?.description}
                </p>
                <p className="text-xs text-green-600 mt-1 sm:mt-2 font-medium">
                    👨‍⚕️ {specialties.find(e => e.id === currentSpecialty)?.doctor}
                </p>
            </div>
        </div>
    );
};

export default SpecialtySelector;
