import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Calendar,
    Users,
    FileText,
    Heart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Activity,
    Clock,
    AlertCircle,
    BarChart3,
    PieChart,
    Wallet,
    CreditCard,
    Banknote
} from 'lucide-react';

interface MonthlyIncome {
    month: string;
    consultations: number;
    incomeUSD: number;
    incomeBs: number;
    exchangeRate: number;
}

interface FinancialStatistic {
    totalConsultations: number;
    totalIncomeUSD: number;
    totalIncomeBs: number;
    averageConsultationUSD: number;
    averageConsultationBs: number;
    monthlyGrowth: number;
}

interface DoctorFinanceDashboardProps {
    doctorId: string;
    doctorName: string;
    specialty: string;
}

// Mock monthly income data
const getMonthlyIncome = (): MonthlyIncome[] => [
    {
        month: 'January 2024',
        consultations: 85,
        incomeUSD: 4250,
        incomeBs: 153000,
        exchangeRate: 36
    },
    {
        month: 'February 2024',
        consultations: 92,
        incomeUSD: 4600,
        incomeBs: 165600,
        exchangeRate: 36
    },
    {
        month: 'March 2024',
        consultations: 78,
        incomeUSD: 3900,
        incomeBs: 140400,
        exchangeRate: 36
    },
    {
        month: 'April 2024',
        consultations: 95,
        incomeUSD: 4750,
        incomeBs: 171000,
        exchangeRate: 36
    },
    {
        month: 'May 2024',
        consultations: 88,
        incomeUSD: 4400,
        incomeBs: 158400,
        exchangeRate: 36
    },
    {
        month: 'June 2024',
        consultations: 102,
        incomeUSD: 5100,
        incomeBs: 183600,
        exchangeRate: 36
    },
    {
        month: 'July 2024',
        consultations: 96,
        incomeUSD: 4800,
        incomeBs: 172800,
        exchangeRate: 36
    },
    {
        month: 'August 2024',
        consultations: 89,
        incomeUSD: 4450,
        incomeBs: 160200,
        exchangeRate: 36
    },
    {
        month: 'September 2024',
        consultations: 105,
        incomeUSD: 5250,
        incomeBs: 189000,
        exchangeRate: 36
    }
];

// Rates by consultation type
const consultationRates = {
    'General Consultation': { usd: 45, bs: 1620 },
    'Follow-up': { usd: 40, bs: 1440 },
    'First Visit': { usd: 55, bs: 1980 },
    'Emergency': { usd: 80, bs: 2880 },
    'Specialized': { usd: 65, bs: 2340 }
};

export default function DoctorFinanceDashboard({ doctorId, doctorName, specialty }: DoctorFinanceDashboardProps) {
    const [monthlyIncome] = useState<MonthlyIncome[]>(getMonthlyIncome());
    const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'BS'>('USD');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('current-month');
    const [currentExchangeRate] = useState(36); // Mocked current exchange rate

    // Calculate financial statistics
    const calculateStatistics = (): FinancialStatistic => {
        const totalConsultations = monthlyIncome.reduce((sum, m) => sum + m.consultations, 0);
        const totalIncomeUSD = monthlyIncome.reduce((sum, m) => sum + m.incomeUSD, 0);
        const totalIncomeBs = monthlyIncome.reduce((sum, m) => sum + m.incomeBs, 0);

        const averageConsultationUSD = totalConsultations > 0 ? totalIncomeUSD / totalConsultations : 0;
        const averageConsultationBs = totalConsultations > 0 ? totalIncomeBs / totalConsultations : 0;

        // Calculate growth by comparing last 3 months vs previous 3 months
        const lastThreeMonths = monthlyIncome.slice(-3);
        const previousThreeMonths = monthlyIncome.slice(-6, -3);

        const incomeLastThree = lastThreeMonths.reduce((sum, m) => sum + m.incomeUSD, 0);
        const incomePreviousThree = previousThreeMonths.reduce((sum, m) => sum + m.incomeUSD, 0);

        const monthlyGrowth = incomePreviousThree > 0
            ? ((incomeLastThree - incomePreviousThree) / incomePreviousThree) * 100
            : 0;

        return {
            totalConsultations,
            totalIncomeUSD,
            totalIncomeBs,
            averageConsultationUSD,
            averageConsultationBs,
            monthlyGrowth
        };
    };

    const statistics = calculateStatistics();

    // Get current month data
    const currentMonth = monthlyIncome[monthlyIncome.length - 1];
    const previousMonth = monthlyIncome[monthlyIncome.length - 2];

    const formatCurrency = (amount: number, currency: 'USD' | 'BS') => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        } else {
            return new Intl.NumberFormat('es-VE', {
                style: 'currency',
                currency: 'VES',
                minimumFractionDigits: 0
            }).format(amount);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getGrowthColor = (growth: number) => {
        if (growth > 0) return 'text-green-600';
        if (growth < 0) return 'text-red-600';
        return 'text-slate-600';
    };

    const getGrowthIcon = (growth: number) => {
        if (growth > 0) return <TrendingUp className="h-4 w-4" />;
        if (growth < 0) return <TrendingDown className="h-4 w-4" />;
        return <Activity className="h-4 w-4" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h2>
                    <p className="text-slate-600">Dr. {doctorName} - {specialty}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select value={selectedCurrency} onValueChange={(value: 'USD' | 'BS') => setSelectedCurrency(value)}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>USD</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="BS">
                                <div className="flex items-center space-x-2">
                                    <Banknote className="h-4 w-4" />
                                    <span>Bs.</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Badge variant="outline" className="text-sm">
                        Rate: {currentExchangeRate} Bs/USD
                    </Badge>
                </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Monthly Income</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {selectedCurrency === 'USD'
                                        ? formatCurrency(currentMonth.incomeUSD, 'USD')
                                        : formatCurrency(currentMonth.incomeBs, 'BS')
                                    }
                                </p>
                                <div className="flex items-center space-x-1 mt-1">
                                    {getGrowthIcon(statistics.monthlyGrowth)}
                                    <span className={`text-xs ${getGrowthColor(statistics.monthlyGrowth)}`}>
                                        {statistics.monthlyGrowth > 0 ? '+' : ''}{statistics.monthlyGrowth.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Wallet className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Monthly Consultations</p>
                                <p className="text-2xl font-bold text-blue-600">{currentMonth.consultations}</p>
                                <p className="text-xs text-slate-500">
                                    {currentMonth.consultations > previousMonth.consultations ? '+' : ''}
                                    {currentMonth.consultations - previousMonth.consultations} vs previous month
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Avg. per Consultation</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {selectedCurrency === 'USD'
                                        ? formatCurrency(statistics.averageConsultationUSD, 'USD')
                                        : formatCurrency(statistics.averageConsultationBs, 'BS')
                                    }
                                </p>
                                <p className="text-xs text-slate-500">Based on {statistics.totalConsultations} consultations</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">Annual Total</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {selectedCurrency === 'USD'
                                        ? formatCurrency(statistics.totalIncomeUSD, 'USD')
                                        : formatCurrency(statistics.totalIncomeBs, 'BS')
                                    }
                                </p>
                                <p className="text-xs text-slate-500">{statistics.totalConsultations} total consultations</p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different views */}
            <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="income">Monthly Income</TabsTrigger>
                    <TabsTrigger value="rates">Consultation Rates</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                    <TabsTrigger value="projections">Projections</TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <span>Monthly Income Evolution</span>
                            </CardTitle>
                            <CardDescription>
                                Income and consultations by month in {selectedCurrency === 'USD' ? 'US Dollars' : 'Bolívares'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyIncome.slice(-6).map((m, index) => (
                                    <div key={m.month} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    {m.month.split(' ')[0].slice(0, 3)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-800">{m.month}</p>
                                                <p className="text-sm text-slate-500">{m.consultations} consultations</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-green-600">
                                                {selectedCurrency === 'USD'
                                                    ? formatCurrency(m.incomeUSD, 'USD')
                                                    : formatCurrency(m.incomeBs, 'BS')
                                                }
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {selectedCurrency === 'USD'
                                                    ? `${formatCurrency(m.incomeUSD / m.consultations, 'USD')} average`
                                                    : `${formatCurrency(m.incomeBs / m.consultations, 'BS')} average`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rates" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <PieChart className="h-5 w-5 text-blue-600" />
                                <span>Rates by Consultation Type</span>
                            </CardTitle>
                            <CardDescription>
                                Current prices in USD and Bs. (Rate: {currentExchangeRate} Bs/USD)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(consultationRates).map(([type, rate]) => (
                                    <Card key={type} className="border-l-4 border-l-blue-500">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-slate-800">{type}</h4>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-slate-600">USD:</span>
                                                        <span className="font-medium text-green-600">
                                                            {formatCurrency(rate.usd, 'USD')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-slate-600">Bs.:</span>
                                                        <span className="font-medium text-blue-600">
                                                            {formatCurrency(rate.bs, 'BS')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="statistics" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Consultations (9 months):</span>
                                    <span className="font-bold text-slate-800">{formatNumber(statistics.totalConsultations)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Income USD:</span>
                                    <span className="font-bold text-green-600">
                                        {formatCurrency(statistics.totalIncomeUSD, 'USD')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Total Income Bs.:</span>
                                    <span className="font-bold text-blue-600">
                                        {formatCurrency(statistics.totalIncomeBs, 'BS')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Monthly Average USD:</span>
                                    <span className="font-bold text-purple-600">
                                        {formatCurrency(statistics.totalIncomeUSD / 9, 'USD')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Monthly Average Bs.:</span>
                                    <span className="font-bold text-orange-600">
                                        {formatCurrency(statistics.totalIncomeBs / 9, 'BS')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Consultations per month (avg):</span>
                                    <span className="font-bold text-slate-800">
                                        {Math.round(statistics.totalConsultations / 9)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Quarterly growth:</span>
                                    <div className="flex items-center space-x-1">
                                        {getGrowthIcon(statistics.monthlyGrowth)}
                                        <span className={`font-bold ${getGrowthColor(statistics.monthlyGrowth)}`}>
                                            {statistics.monthlyGrowth > 0 ? '+' : ''}{statistics.monthlyGrowth.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Best month (consultations):</span>
                                    <span className="font-bold text-green-600">
                                        {Math.max(...monthlyIncome.map(m => m.consultations))} consultations
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Best month (income USD):</span>
                                    <span className="font-bold text-green-600">
                                        {formatCurrency(Math.max(...monthlyIncome.map(m => m.incomeUSD)), 'USD')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Best month (income Bs.):</span>
                                    <span className="font-bold text-blue-600">
                                        {formatCurrency(Math.max(...monthlyIncome.map(m => m.incomeBs)), 'BS')}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="projections" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                                <span>Financial Projections</span>
                            </CardTitle>
                            <CardDescription>
                                Estimates based on performance over the last 3 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-l-4 border-l-green-500">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-800">Next Month</h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                {selectedCurrency === 'USD'
                                                    ? formatCurrency(currentMonth.incomeUSD * 1.05, 'USD')
                                                    : formatCurrency(currentMonth.incomeBs * 1.05, 'BS')
                                                }
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ~{Math.round(currentMonth.consultations * 1.05)} consultations
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-800">Next Quarter</h4>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {selectedCurrency === 'USD'
                                                    ? formatCurrency(currentMonth.incomeUSD * 3 * 1.08, 'USD')
                                                    : formatCurrency(currentMonth.incomeBs * 3 * 1.08, 'BS')
                                                }
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ~{Math.round(currentMonth.consultations * 3 * 1.08)} consultations
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-l-4 border-l-purple-500">
                                    <CardContent className="p-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-slate-800">End of Year</h4>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {selectedCurrency === 'USD'
                                                    ? formatCurrency(statistics.totalIncomeUSD + (currentMonth.incomeUSD * 3 * 1.1), 'USD')
                                                    : formatCurrency(statistics.totalIncomeBs + (currentMonth.incomeBs * 3 * 1.1), 'BS')
                                                }
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                ~{statistics.totalConsultations + Math.round(currentMonth.consultations * 3 * 1.1)} total consultations
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-blue-800">Note on Projections</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Projections are based on the average growth of the last 3 months ({statistics.monthlyGrowth.toFixed(1)}%)
                                            and may vary due to external factors such as seasonality, rate changes, or market conditions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Consultations this week:</span>
                                <Badge variant="secondary">24 consultations</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Income this week:</span>
                                <Badge className="bg-green-100 text-green-800">
                                    {selectedCurrency === 'USD' ? '$1,200' : 'Bs. 43,200'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Appointments scheduled today:</span>
                                <Badge className="bg-blue-100 text-blue-800">8 appointments</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">New patients this month:</span>
                                <Badge className="bg-purple-100 text-purple-800">12 patients</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Heart className="h-5 w-5 text-red-600" />
                            <span>Patient Summary</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total active patients:</span>
                                <Badge variant="secondary">347 patients</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Patients with insurance:</span>
                                <Badge className="bg-blue-100 text-blue-800">89%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Private patients:</span>
                                <Badge className="bg-orange-100 text-orange-800">11%</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Average satisfaction:</span>
                                <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
