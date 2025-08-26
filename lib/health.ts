// Migrated from rn-apple-healthkit to react-native-health
import { HealthKitPermissions, HealthValue } from 'react-native-health';
import { Platform } from 'react-native';
const { AppleHealthKit } = require('react-native').NativeModules;

type StepSample = {
  startDate: string;
  endDate: string;
  value: number;
};

// Build permission list using constants when available
const HK_ANY: any = AppleHealthKit;
const Perms = HK_ANY?.Constants?.Permissions || {};
const READ_PERMS = [
  Perms.StepCount || 'StepCount',
  Perms.DistanceWalkingRunning || 'DistanceWalkingRunning',
  Perms.ActiveEnergyBurned || 'ActiveEnergyBurned',
];

const permissions: HealthKitPermissions = { permissions: { read: READ_PERMS, write: [] } } as any;

let _healthAvailable = false;
export const isHealthAvailable = () => _healthAvailable;

export function initHealth(): Promise<void> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') {
      _healthAvailable = false;
      return resolve();
    }
    const native: any = AppleHealthKit as any;
    if (!native || typeof native.initHealthKit !== 'function') {
      _healthAvailable = false;
      console.warn(
        AppleHealthKit,
        '[Health] react-native-health not linked. Rebuild dev client (prebuild + run:ios).'
      );
      return resolve();
    }
    native.initHealthKit(permissions, (error: unknown) => {
      if (error) {
        console.warn('[Health] init error', error);
        _healthAvailable = false;
      } else {
        _healthAvailable = true;
      }
      resolve();
    });
  });
}

export async function getTodayStepCount(): Promise<number> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(0);
    const options = { date: new Date().toISOString() };
    (AppleHealthKit as any).getStepCount?.(options, (_err: string, result: HealthValue) => {
      if (!result) return resolve(0);
      resolve(result.value);
    });
  });
}

export async function getHourlySteps(): Promise<number[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(Array(24).fill(0));
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const fn: any = (AppleHealthKit as any).getSamples;
    if (!fn) return resolve(Array(24).fill(0));
    fn(
      {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        type: 'StepCount',
        ascending: true,
        limit: 1000,
      },
      (_err: string, samples: StepSample[]) => {
        const hours = Array(24).fill(0);
        (samples || []).forEach((s) => {
          const hour = new Date(s.startDate).getHours();
          hours[hour] += s.value;
        });
        resolve(hours);
      }
    );
  });
}

export async function getTodayDistanceKm(): Promise<number> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(0);
    const options = { date: new Date().toISOString() } as any;
    const fn: any = (AppleHealthKit as any).getDistanceWalkingRunning;
    if (!fn) return resolve(0);
    fn(options, (_err: string, result: HealthValue) => {
      if (!result) return resolve(0);
      resolve(result.value / 1000); // meters -> km
    });
  });
}

export async function getTodayActiveEnergyKcal(): Promise<number> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(0);
    const options = { date: new Date().toISOString() } as any;
    const fn: any = (AppleHealthKit as any).getActiveEnergyBurned;
    if (!fn) return resolve(0);
    fn(options, (_err: string, result: HealthValue) => {
      if (!result) return resolve(0);
      resolve(result.value);
    });
  });
}

export async function getHourlyDistanceKm(): Promise<number[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(Array(24).fill(0));
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const fn: any = (AppleHealthKit as any).getSamples;
    if (!fn) return resolve(Array(24).fill(0));
    fn(
      {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        type: 'DistanceWalkingRunning',
        ascending: true,
        limit: 1000,
      },
      (_err: string, samples: any[]) => {
        const hours = Array(24).fill(0);
        (samples || []).forEach((s) => {
          const hour = new Date(s.startDate).getHours();
          hours[hour] += (s.value || 0) / 1000;
        });
        resolve(hours);
      }
    );
  });
}

export async function getHourlyActiveEnergyKcal(): Promise<number[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios' || !_healthAvailable) return resolve(Array(24).fill(0));
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const fn: any = (AppleHealthKit as any).getSamples;
    if (!fn) return resolve(Array(24).fill(0));
    fn(
      {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        type: 'ActiveEnergyBurned',
        ascending: true,
        limit: 1000,
      },
      (_err: string, samples: any[]) => {
        const hours = Array(24).fill(0);
        (samples || []).forEach((s) => {
          const hour = new Date(s.startDate).getHours();
          hours[hour] += s.value || 0;
        });
        resolve(hours);
      }
    );
  });
}
