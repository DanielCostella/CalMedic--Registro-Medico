import { useState, useEffect, useCallback } from 'react';

interface Metrics {
  pacientesTotal: number;
  citasHoy: number;
  recetasEmitidas: number;
  ingresosMes: number;
  pacientesNuevos: number;
  citasSemana: number;
  satisfaccionPromedio: number;
  lastUpdate: string;
}

const initialMetrics: Metrics = {
  pacientesTotal: 156,
  citasHoy: 8,
  recetasEmitidas: 23,
  ingresosMes: 18750,
  pacientesNuevos: 12,
  citasSemana: 42,
  satisfaccionPromedio: 4.8,
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
    
    // Simular delay de actualización
    setTimeout(() => {
      setMetrics(prev => ({
        pacientesTotal: generateRandomChange(prev.pacientesTotal, 2),
        citasHoy: generateRandomChange(prev.citasHoy, 1),
        recetasEmitidas: generateRandomChange(prev.recetasEmitidas, 3),
        ingresosMes: generateRandomChange(prev.ingresosMes, 500),
        pacientesNuevos: generateRandomChange(prev.pacientesNuevos, 1),
        citasSemana: generateRandomChange(prev.citasSemana, 2),
        satisfaccionPromedio: Math.max(3.0, Math.min(5.0, prev.satisfaccionPromedio + (Math.random() - 0.5) * 0.2)),
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