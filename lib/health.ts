import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'rn-apple-healthkit';
import { Platform } from 'react-native';

type StepSample = {
  startDate: string;
  endDate: string;
  value: number;
};

// Attempt to use constants if present, otherwise fall back to raw strings
const HK_ANY: any = AppleHealthKit as any;
const Perms = HK_ANY?.Constants?.Permissions || {};

const permissions: HealthKitPermissions = {
  permissions: {
    read: [
      Perms.StepCount || 'StepCount',
      Perms.DistanceWalkingRunning || 'DistanceWalkingRunning',
      Perms.ActiveEnergyBurned || 'ActiveEnergyBurned',
    ],
    write: [],
  },
};

export function initHealth(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios') {
      // HealthKit only on iOS – resolve silently
      return resolve();
    }
    const native: any = AppleHealthKit as any;
    if (!native || typeof native.initHealthKit !== 'function') {
      return reject(
        new Error(
          '[Health] Native module not linked. Rebuild the iOS app with HealthKit capability enabled (expo prebuild / run:ios + add HealthKit capability).'
        )
      );
    }
    native.initHealthKit(permissions, (error: unknown) => {
      if (error) return reject(error as any);
      resolve();
    });
  });
}

export async function getTodayStepCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios') return resolve(0);
    const options = { date: new Date().toISOString() };
    (AppleHealthKit as any).getStepCount?.(options, (err: string, result: HealthValue) => {
      if (err || !result) {
        reject(err);
        return;
      }
      resolve(result.value);
    });
  });
}

export async function getHourlySteps(): Promise<number[]> {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios') return resolve(Array(24).fill(0));
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Fallback implementation: API differences across versions. Try getSamples if available.
    const fn: any = (AppleHealthKit as any).getSamples;
    if (!fn) {
      resolve(Array(24).fill(0));
      return;
    }
    fn(
      {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        type: 'StepCount',
        ascending: true,
        limit: 1000,
      },
      (err: string, samples: StepSample[]) => {
        if (err) {
          reject(err);
          return;
        }
        const hours = Array(24).fill(0);
        samples.forEach((s) => {
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
    if (Platform.OS !== 'ios') return resolve(0);
    const options = { date: new Date().toISOString() } as any;
    const fn: any = (AppleHealthKit as any).getDistanceWalkingRunning;
    if (!fn) return resolve(0);
    fn(options, (err: string, result: HealthValue) => {
      if (err || !result) return resolve(0);
      // result.value in meters
      resolve(result.value / 1000);
    });
  });
}

export async function getTodayActiveEnergyKcal(): Promise<number> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') return resolve(0);
    const options = { date: new Date().toISOString() } as any;
    const fn: any = (AppleHealthKit as any).getActiveEnergyBurned;
    if (!fn) return resolve(0);
    fn(options, (err: string, result: HealthValue) => {
      if (err || !result) return resolve(0);
      resolve(result.value); // already in kCal
    });
  });
}

export async function getHourlyDistanceKm(): Promise<number[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') return resolve(Array(24).fill(0));
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
      (err: string, samples: any[]) => {
        if (err) return resolve(Array(24).fill(0));
        const hours = Array(24).fill(0);
        samples.forEach((s) => {
          const hour = new Date(s.startDate).getHours();
          // value likely in meters => convert to km
          hours[hour] += (s.value || 0) / 1000;
        });
        resolve(hours);
      }
    );
  });
}

export async function getHourlyActiveEnergyKcal(): Promise<number[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') return resolve(Array(24).fill(0));
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
      (err: string, samples: any[]) => {
        if (err) return resolve(Array(24).fill(0));
        const hours = Array(24).fill(0);
        samples.forEach((s) => {
          const hour = new Date(s.startDate).getHours();
          hours[hour] += s.value || 0;
        });
        resolve(hours);
      }
    );
  });
}
