import * as React from 'react';
import {
  initHealth,
  getTodayStepCount,
  getHourlySteps,
  getTodayDistanceKm,
  getTodayActiveEnergyKcal,
  getHourlyDistanceKm,
  getHourlyActiveEnergyKcal,
} from '@/lib/health';

export interface UseHealthDataOptions {
  autoRefreshIntervalMs?: number; // optional polling for live updates
}

export interface HealthDataState {
  loading: boolean;
  error: string | null;
  steps: number | null;
  distanceKm: number | null;
  activeEnergyKcal: number | null;
  hourlySteps: number[] | null;
  hourlyDistanceKm: number[] | null;
  hourlyActiveEnergyKcal: number[] | null;
  refresh: () => Promise<void>;
}

export function useHealthData(options: UseHealthDataOptions = {}): HealthDataState {
  const { autoRefreshIntervalMs } = options;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [steps, setSteps] = React.useState<number | null>(null);
  const [distanceKm, setDistanceKm] = React.useState<number | null>(null);
  const [activeEnergyKcal, setActiveEnergyKcal] = React.useState<number | null>(null);
  const [hourlySteps, setHourlySteps] = React.useState<number[] | null>(null);
  const [hourlyDistanceKm, setHourlyDistanceKm] = React.useState<number[] | null>(null);
  const [hourlyActiveEnergyKcal, setHourlyActiveEnergyKcal] = React.useState<number[] | null>(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await initHealth();
      const [s, d, e, hs, hd, he] = await Promise.all([
        getTodayStepCount().catch(() => 0),
        getTodayDistanceKm().catch(() => 0),
        getTodayActiveEnergyKcal().catch(() => 0),
        getHourlySteps().catch(() => Array(24).fill(0)),
        getHourlyDistanceKm().catch(() => Array(24).fill(0)),
        getHourlyActiveEnergyKcal().catch(() => Array(24).fill(0)),
      ]);
      setSteps(s);
      setDistanceKm(d);
      setActiveEnergyKcal(e);
      setHourlySteps(hs);
      setHourlyDistanceKm(hd);
      setHourlyActiveEnergyKcal(he);
    } catch (e: any) {
      setError(e?.message || 'Health unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    if (autoRefreshIntervalMs && autoRefreshIntervalMs > 0) {
      const id = setInterval(load, autoRefreshIntervalMs);
      return () => clearInterval(id);
    }
  }, [autoRefreshIntervalMs, load]);

  return {
    loading,
    error,
    steps,
    distanceKm,
    activeEnergyKcal,
    hourlySteps,
    hourlyDistanceKm,
    hourlyActiveEnergyKcal,
    refresh: load,
  };
}
