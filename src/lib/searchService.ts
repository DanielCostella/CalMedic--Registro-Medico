// Advanced AI Search Service
import React from 'react';
import { Patient, Doctor, Appointment, MedicalHistory, Prescription, SearchResult, SearchFilters, Medication, Exam } from '@/types/medical';

export interface SearchSuggestion {
  text: string;
  type: string;
  frequency: number;
}

interface SearchData {
  pacientes?: Patient[];
  medicos?: Doctor[];
  citas?: Appointment[];
  historiales?: MedicalHistory[];
  recetas?: Prescription[];
}

export class SearchService {
  private static instance: SearchService;
  private searchHistory: string[] = [];
  private suggestions: SearchSuggestion[] = [];

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Main intelligent search
  async intelligentSearch(
    query: string,
    data: SearchData,
    type: string,
    filters?: SearchFilters
  ): Promise<SearchResult[]> {
    try {
      // Add to history
      this.addToHistory(query);

      // Normalize query
      const normalizedQuery = this.normalizeText(query);
      const keywords = this.extractKeywords(normalizedQuery);

      let results: SearchResult[] = [];

      // Search in different data types
      switch (type) {
        case 'patients':
          results = this.searchPatients(data.pacientes || [], keywords, filters);
          break;
        case 'doctors':
          results = this.searchDoctors(data.medicos || [], keywords, filters);
          break;
        case 'appointments':
          results = this.searchAppointments(data.citas || [], keywords, filters);
          break;
        case 'histories':
          results = this.searchHistories(data.historiales || [], keywords, filters);
          break;
        case 'prescriptions':
          results = this.searchPrescriptions(data.recetas || [], keywords, filters);
          break;
        case 'general':
          results = this.generalSearch(data, keywords, filters);
          break;
        default:
          results = this.generalSearch(data, keywords, filters);
      }

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      // Apply additional filters
      if (filters) {
        results = this.applyFilters(results, filters);
      }

      return results.slice(0, 50); // Limit to 50 results
    } catch (error) {
      console.error('Error in intelligent search:', error);
      return [];
    }
  }

  // Search patients
  private searchPatients(patients: Patient[], keywords: string[], filters?: SearchFilters): SearchResult[] {
    return patients.map(patient => {
      const fullText = `
        ${patient.firstName} ${patient.lastName} ${patient.nationalId} 
        ${patient.email} ${patient.phone} ${patient.address}
        ${patient.bloodType} ${patient.allergies?.join(' ') || ''}
      `.toLowerCase();

      const matches = this.findMatches(fullText, keywords);
      const relevance = this.calculateRelevance(matches, keywords);

      return {
        type: 'Patient' as const,
        id: patient.id,
        title: `${patient.firstName} ${patient.lastName}`,
        subtitle: `${patient.nationalId} - ${patient.bloodType}`,
        description: `Tel: ${patient.phone} | Email: ${patient.email}`,
        date: patient.registrationDate,
        relevance,
        data: patient,
        matches
      };
    }).filter(result => result.relevance > 0);
  }

  // Search doctors
  private searchDoctors(doctors: Doctor[], keywords: string[], filters?: SearchFilters): SearchResult[] {
    return doctors.map(doctor => {
      const fullText = `
        ${doctor.firstName} ${doctor.lastName} ${doctor.specialty}
        ${doctor.nationalId} ${doctor.email} ${doctor.licenseNumber}
      `.toLowerCase();

      const matches = this.findMatches(fullText, keywords);
      const relevance = this.calculateRelevance(matches, keywords);

      return {
        type: 'Doctor' as const,
        id: doctor.id,
        title: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        subtitle: doctor.specialty,
        description: `Lic: ${doctor.licenseNumber} | Tel: ${doctor.phone}`,
        date: doctor.registrationDate,
        relevance,
        data: doctor,
        matches
      };
    }).filter(result => result.relevance > 0);
  }

  // Search appointments
  private searchAppointments(appointments: Appointment[], keywords: string[], filters?: SearchFilters): SearchResult[] {
    return appointments.map(appointment => {
      const fullText = `
        ${appointment.reason} ${appointment.type} ${appointment.status}
        ${appointment.notes || ''}
      `.toLowerCase();

      const matches = this.findMatches(fullText, keywords);
      const relevance = this.calculateRelevance(matches, keywords);

      return {
        type: 'Appointment' as const,
        id: appointment.id,
        title: appointment.reason,
        subtitle: `${appointment.date} ${appointment.time} - ${appointment.status}`,
        description: `Type: ${appointment.type} | Duration: ${appointment.duration} min`,
        date: appointment.date,
        relevance,
        data: appointment,
        matches
      };
    }).filter(result => result.relevance > 0);
  }

  // Search medical histories
  private searchHistories(histories: MedicalHistory[], keywords: string[], filters?: SearchFilters): SearchResult[] {
    return histories.map(history => {
      const fullText = `
        ${history.reason} ${history.symptoms} ${history.diagnosis}
        ${history.treatment} ${history.notes || ''}
        ${history.medications?.map((m) => m.name).join(' ') || ''}
      `.toLowerCase();

      const matches = this.findMatches(fullText, keywords);
      const relevance = this.calculateRelevance(matches, keywords);

      return {
        type: 'History' as const,
        id: history.id,
        title: history.reason,
        subtitle: history.diagnosis,
        description: `Symptoms: ${history.symptoms.substring(0, 100)}...`,
        date: history.date,
        relevance,
        data: history,
        matches
      };
    }).filter(result => result.relevance > 0);
  }

  // Search prescriptions
  private searchPrescriptions(prescriptions: Prescription[], keywords: string[], filters?: SearchFilters): SearchResult[] {
    return prescriptions.map(prescription => {
      const fullText = `
        ${prescription.prescriptionNumber} ${prescription.indications || ''}
        ${prescription.medications?.map((m) => `${m.name} ${m.dosage}`).join(' ') || ''}
      `.toLowerCase();

      const matches = this.findMatches(fullText, keywords);
      const relevance = this.calculateRelevance(matches, keywords);

      return {
        type: 'Prescription' as const,
        id: prescription.id,
        title: `Prescription ${prescription.prescriptionNumber}`,
        subtitle: `${prescription.medications?.length || 0} medications - ${prescription.status}`,
        description: `Validity: ${prescription.validity}`,
        date: prescription.date,
        relevance,
        data: prescription,
        matches
      };
    }).filter(result => result.relevance > 0);
  }

  // General search (all types)
  private generalSearch(allData: SearchData, keywords: string[], filters?: SearchFilters): SearchResult[] {
    let results: SearchResult[] = [];

    // Search in each data type if exists
    if (allData.pacientes) {
      results = results.concat(this.searchPatients(allData.pacientes, keywords, filters));
    }
    if (allData.medicos) {
      results = results.concat(this.searchDoctors(allData.medicos, keywords, filters));
    }
    if (allData.citas) {
      results = results.concat(this.searchAppointments(allData.citas, keywords, filters));
    }
    if (allData.historiales) {
      results = results.concat(this.searchHistories(allData.historiales, keywords, filters));
    }
    if (allData.recetas) {
      results = results.concat(this.searchPrescriptions(allData.recetas, keywords, filters));
    }

    return results;
  }

  // Search utilities
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  private extractKeywords(text: string): string[] {
    const commonWords = ['the', 'and', 'for', 'with', 'that', 'this', 'was', 'were', 'from', 'but', 'not'];

    return text
      .split(' ')
      .filter(word => word.length > 2 && !commonWords.includes(word))
      .slice(0, 10); // Limit to 10 keywords
  }

  private findMatches(text: string, keywords: string[]): string[] {
    const matches: string[] = [];

    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matches.push(keyword);
      }
    });

    return matches;
  }

  private calculateRelevance(matches: string[], keywords: string[]): number {
    if (keywords.length === 0) return 0;

    let score = 0;

    // Base score for matches
    score += (matches.length / keywords.length) * 100;

    // Bonus for exact matches
    matches.forEach(match => {
      if (keywords.includes(match)) {
        score += 10;
      }
    });

    return Math.min(score, 100);
  }

  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    return results.filter(result => {
      // Date filter
      if (filters.startDate && result.date < filters.startDate) return false;
      if (filters.endDate && result.date > filters.endDate) return false;

      // Specific type filter
      const data = result.data as unknown as Record<string, string | number | boolean>;
      if (filters.specialty && data.specialty !== filters.specialty) return false;
      if (filters.status && data.status !== filters.status) return false;
      if (filters.type && data.type !== filters.type) return false;

      return true;
    });
  }

  // History and suggestions management
  private addToHistory(query: string): void {
    if (query.trim().length > 2) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 50); // Keep last 50
      this.updateSuggestions(query);
    }
  }

  private updateSuggestions(query: string): void {
    const existingSuggestion = this.suggestions.find(s => s.text === query);

    if (existingSuggestion) {
      existingSuggestion.frequency++;
    } else {
      this.suggestions.push({
        text: query,
        type: 'history',
        frequency: 1
      });
    }

    // Keep only the 20 most frequent suggestions
    this.suggestions.sort((a, b) => b.frequency - a.frequency);
    this.suggestions = this.suggestions.slice(0, 20);
  }

  // Get search suggestions
  getSuggestions(query: string): SearchSuggestion[] {
    const normalizedQuery = this.normalizeText(query);

    return this.suggestions
      .filter(suggestion =>
        this.normalizeText(suggestion.text).includes(normalizedQuery)
      )
      .slice(0, 5);
  }

  // Intelligent autocomplete
  getAutocomplete(query: string, data: (Patient | Doctor)[]): string[] {
    const suggestions: string[] = [];
    const normalizedQuery = this.normalizeText(query);

    // History suggestions
    this.searchHistory
      .filter(search => this.normalizeText(search).includes(normalizedQuery))
      .slice(0, 3)
      .forEach(search => suggestions.push(search));

    // Patient name suggestions
    data.forEach((item) => {
      if ('firstName' in item && 'lastName' in item) {
        const fullName = `${item.firstName} ${item.lastName}`;
        if (this.normalizeText(fullName).includes(normalizedQuery)) {
          suggestions.push(fullName);
        }
      }
    });

    return [...new Set(suggestions)].slice(0, 8);
  }

  // Voice search (if available)
  async voiceSearch(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Voice recognition not available'));
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Voice recognition not available'));
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Recognition error: ${event.error}`));
      };

      recognition.start();
    });
  }

  // Clear history
  clearHistory(): void {
    this.searchHistory = [];
    this.suggestions = [];
  }

  // Get search statistics
  getStatistics(): {
    totalSearches: number;
    mostFrequentSearches: SearchSuggestion[];
    lastSearches: string[];
  } {
    return {
      totalSearches: this.searchHistory.length,
      mostFrequentSearches: this.suggestions.slice(0, 5),
      lastSearches: this.searchHistory.slice(0, 10)
    };
  }
}

// Global service instance
export const searchService = SearchService.getInstance();

// React Hook
export const useSearch = () => {
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);

  const search = async (query: string, data: SearchData, type: string, filters?: SearchFilters) => {
    setLoading(true);
    try {
      const results = await searchService.intelligentSearch(query, data, type, filters);
      setResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = (query: string) => {
    const suggestions = searchService.getSuggestions(query);
    setSuggestions(suggestions);
  };

  return {
    results,
    loading,
    suggestions,
    search,
    getSuggestions,
    clearResults: () => setResults([])
  };
};