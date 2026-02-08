import { useState, useEffect, useCallback } from 'react';

interface Metrics {
  totalPatients: number;
  appointmentsToday: number;
  prescriptionsIssued: number;
  monthlyIncome: number;
  newPatients: number;
  weeklyAppointments: number;
  averageSatisfaction: number;
  lastUpdate: string;
}

const initialMetrics: Metrics = {
  totalPatients: 156,
  appointmentsToday: 8,
  prescriptionsIssued: 23,
  monthlyIncome: 18750,
  newPatients: 12,
  weeklyAppointments: 42,
  averageSatisfaction: 4.8,
  lastUpdate: new Date().toISOString()
};

export const useRealTimeMetrics = (updateInterval: number = 30000) => {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [isUpdating, setIsUpdating] = useState(false);

  const generateRandomChange = (current: number, maxChange: number = 5) => {
    const change = Math.floor(Math.random() * (maxChange * 2 + 1)) - maxChange;
    return Math.max(0, current + change);
  };

  const updateMetrics = useCallback(() => {
    setIsUpdating(true);

    // Simulate update delay
    setTimeout(() => {
      setMetrics(prev => ({
        totalPatients: generateRandomChange(prev.totalPatients, 2),
        appointmentsToday: generateRandomChange(prev.appointmentsToday, 1),
        prescriptionsIssued: generateRandomChange(prev.prescriptionsIssued, 3),
        monthlyIncome: generateRandomChange(prev.monthlyIncome, 500),
        newPatients: generateRandomChange(prev.newPatients, 1),
        weeklyAppointments: generateRandomChange(prev.weeklyAppointments, 2),
        averageSatisfaction: Math.max(3.0, Math.min(5.0, prev.averageSatisfaction + (Math.random() - 0.5) * 0.2)),
        lastUpdate: new Date().toISOString()
      }));
      setIsUpdating(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, updateInterval);
    return () => clearInterval(interval);
  }, [updateMetrics, updateInterval]);

  return { metrics, isUpdating, updateMetrics };
};
