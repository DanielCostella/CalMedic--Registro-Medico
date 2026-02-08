import React, { useState, useEffect } from 'react';
import { Search, Filter, Mic, X, Clock, TrendingUp, User, Calendar, FileText, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { searchService, useSearch } from '@/lib/searchService';
import { mockPacientes, mockMedicos, mockCitas, mockHistorialMedico, mockRecetas } from '@/data/mockData';
import { SearchFilters, SearchResult } from '@/types/medical';

interface AdvancedSearchProps {
    doctorId?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ doctorId }) => {
    const [query, setQuery] = useState('');
    const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({});
    const [searchTypes, setSearchTypes] = useState<string[]>(['general']);
    const [showFilters, setShowFilters] = useState(false);
    const [voiceSearchActive, setVoiceSearchActive] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);

    const { results, loading, suggestions, search, getSuggestions } = useSearch();

    // Combined data for searching
    const allData = {
        pacientes: mockPacientes,
        medicos: mockMedicos,
        citas: mockCitas,
        historiales: mockHistorialMedico,
        recetas: mockRecetas
    };

    useEffect(() => {
        // Load search history from localStorage
        const history = localStorage.getItem('searchHistory');
        if (history) {
            setSearchHistory(JSON.parse(history));
        }
    }, []);

    useEffect(() => {
        // Get suggestions when query changes
        if (query.length > 2) {
            getSuggestions(query);

            // Autocomplete
            const autocomplete = searchService.getAutocomplete(query, [
                ...mockPacientes,
                ...mockMedicos
            ]);
            setAutocompleteSuggestions(autocomplete);
        } else {
            setAutocompleteSuggestions([]);
        }
    }, [query, getSuggestions]);

    const handleSearch = async () => {
        if (query.trim()) {
            // Save to history
            const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
            setSearchHistory(newHistory);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));

            // Perform search
            const searchType = searchTypes.includes('general') ? 'general' : searchTypes[0];
            await search(query, allData, searchType, advancedFilters);
        }
    };

    const handleVoiceSearch = async () => {
        setVoiceSearchActive(true);
        try {
            const text = await searchService.voiceSearch();
            setQuery(text);
            setVoiceSearchActive(false);
            // Automatically search after recognition
            setTimeout(() => handleSearch(), 500);
        } catch (error) {
            console.error('Voice search error:', error);
            setVoiceSearchActive(false);
            alert('Voice recognition error. Please verify that your browser supports this function.');
        }
    };

    const clearFilters = () => {
        setAdvancedFilters({});
        setSearchTypes(['general']);
    };

    const applyQuickFilter = (filter: string, value: string) => {
        setAdvancedFilters(prev => ({ ...prev, [filter]: value }));
        handleSearch();
    };

    const getIconByType = (type: string) => {
        switch (type) {
            case 'Patient': return <User className="w-4 h-4" />;
            case 'Doctor': return <User className="w-4 h-4" />;
            case 'Appointment': return <Calendar className="w-4 h-4" />;
            case 'History': return <FileText className="w-4 h-4" />;
            case 'Prescription': return <Pill className="w-4 h-4" />;
            default: return <Search className="w-4 h-4" />;
        }
    };

    const getColorByType = (type: string) => {
        switch (type) {
            case 'Patient': return 'bg-blue-100 text-blue-800';
            case 'Doctor': return 'bg-green-100 text-green-800';
            case 'Appointment': return 'bg-purple-100 text-purple-800';
            case 'History': return 'bg-orange-100 text-orange-800';
            case 'Prescription': return 'bg-pink-100 text-pink-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
                    <p className="text-gray-600">Intelligent search engine with AI</p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => searchService.clearHistory()}
                    >
                        Clear History
                    </Button>

                    <Dialog open={showFilters} onOpenChange={setShowFilters}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Advanced Filters
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Advanced Search Filters</DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="general">General</TabsTrigger>
                                    <TabsTrigger value="dates">Dates</TabsTrigger>
                                    <TabsTrigger value="specific">Specifics</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4">
                                    <div>
                                        <Label>Search types</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {['general', 'patients', 'doctors', 'appointments', 'histories', 'prescriptions'].map(type => (
                                                <Button
                                                    key={type}
                                                    variant={searchTypes.includes(type) ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => {
                                                        if (type === 'general') {
                                                            setSearchTypes(['general']);
                                                        } else {
                                                            setSearchTypes(prev =>
                                                                prev.includes(type)
                                                                    ? prev.filter(t => t !== type && t !== 'general')
                                                                    : [...prev.filter(t => t !== 'general'), type]
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={advancedFilters.status || 'all'}
                                                onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                    <SelectItem value="Completed">Completed</SelectItem>
                                                    <SelectItem value="Canceled">Canceled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="specialty">Specialty</Label>
                                            <Select
                                                value={advancedFilters.specialty || 'all'}
                                                onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, specialty: value === 'all' ? undefined : value }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select specialty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All</SelectItem>
                                                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                                                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                                                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="dates" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input
                                                type="date"
                                                value={advancedFilters.startDate || ''}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="endDate">End Date</Label>
                                            <Input
                                                type="date"
                                                value={advancedFilters.endDate || ''}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const today = new Date().toISOString().split('T')[0];
                                                setAdvancedFilters(prev => ({ ...prev, startDate: today, endDate: today }));
                                            }}
                                        >
                                            Today
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const today = new Date();
                                                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                                setAdvancedFilters(prev => ({
                                                    ...prev,
                                                    startDate: weekAgo.toISOString().split('T')[0],
                                                    endDate: today.toISOString().split('T')[0]
                                                }));
                                            }}
                                        >
                                            Last week
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const today = new Date();
                                                const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
                                                setAdvancedFilters(prev => ({
                                                    ...prev,
                                                    startDate: monthAgo.toISOString().split('T')[0],
                                                    endDate: today.toISOString().split('T')[0]
                                                }));
                                            }}
                                        >
                                            Last month
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="specific" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="diagnosis">Diagnosis</Label>
                                            <Input
                                                placeholder="Search by diagnosis..."
                                                value={advancedFilters.diagnosis || ''}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, diagnosis: e.target.value }))}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="medication">Medication</Label>
                                            <Input
                                                placeholder="Search by medication..."
                                                value={advancedFilters.medication || ''}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, medication: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="priority">Priority</Label>
                                        <Select
                                            value={advancedFilters.priority || 'all'}
                                            onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, priority: value === 'all' ? undefined : value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear
                                </Button>
                                <Button onClick={() => { handleSearch(); setShowFilters(false); }}>
                                    Apply Filters
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main search bar */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search patients, doctors, appointments, histories, prescriptions..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10 text-lg h-12"
                            />

                            {/* Autocomplete suggestions */}
                            {autocompleteSuggestions.length > 0 && (
                                <div className="absolute top-14 left-0 right-0 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {autocompleteSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                            onClick={() => {
                                                setQuery(suggestion);
                                                setAutocompleteSuggestions([]);
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span>{suggestion}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleVoiceSearch}
                            variant="outline"
                            disabled={voiceSearchActive}
                            className="h-12"
                        >
                            <Mic className={`w-5 h-5 ${voiceSearchActive ? 'text-red-500 animate-pulse' : ''}`} />
                        </Button>

                        <Button onClick={handleSearch} disabled={loading} className="h-12 px-8">
                            {loading ? <LoadingSpinner size="sm" /> : 'Search'}
                        </Button>
                    </div>

                    {/* Quick filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className="text-sm text-gray-600 mr-2">Quick filters:</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyQuickFilter('status', 'Active')}
                        >
                            Active
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyQuickFilter('specialty', 'Cardiology')}
                        >
                            Cardiology
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyQuickFilter('specialty', 'Pediatrics')}
                        >
                            Pediatrics
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                applyQuickFilter('startDate', today);
                            }}
                        >
                            Today
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search history */}
            {searchHistory.length > 0 && !query && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Recent Searches
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {searchHistory.slice(0, 8).map((historyItem, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setQuery(historyItem);
                                        handleSearch();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Clock className="w-3 h-3" />
                                    {historyItem}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search results */}
            {loading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <LoadingSpinner size="lg" text="Searching..." />
                    </CardContent>
                </Card>
            )}

            {!loading && results.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Search results ({results.length})
                        </h2>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                                Sorted by relevance
                            </span>
                        </div>
                    </div>

                    {results.map((resultado, index) => (
                        <Card key={`${resultado.type}-${resultado.id}`} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge className={getColorByType(resultado.type)}>
                                                {getIconByType(resultado.type)}
                                                <span className="ml-1">{resultado.type}</span>
                                            </Badge>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-xs text-gray-500">
                                                    {Math.round(resultado.relevance)}% relevance
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {resultado.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {resultado.subtitle}
                                        </p>
                                        <p className="text-sm text-gray-700 mb-3">
                                            {resultado.description}
                                        </p>

                                        {resultado.matches.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                <span className="text-xs text-gray-500 mr-1">Matches:</span>
                                                {resultado.matches.map((match, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {match}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500">
                                            Date: {new Date(resultado.date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                // Details logic here
                                                console.log('View detail:', resultado);
                                            }}
                                        >
                                            View Detail
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && query && results.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                        <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg mb-2">No results found</p>
                        <p className="text-sm">
                            Try different terms or adjust search filters
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Search suggestions */}
            {suggestions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Popular Suggestions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setQuery(suggestion.text);
                                        handleSearch();
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <span>{suggestion.text}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {suggestion.frequency}
                                    </Badge>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdvancedSearch;
