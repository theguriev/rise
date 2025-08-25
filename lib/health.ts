import AppleHealthKit, { HealthKitPermissions, HealthValue } from 'rn-apple-healthkit';

type StepSample = {
  startDate: string;
  endDate: string;
  value: number;
};

const permissions: HealthKitPermissions = {
  permissions: {
    read: ['StepCount', 'DistanceWalkingRunning', 'ActiveEnergyBurned'],
    write: [],
  },
};

export function initHealth(): Promise<void> {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export async function getTodayStepCount(): Promise<number> {
  return new Promise((resolve, reject) => {
    const options = { date: new Date().toISOString() };
    AppleHealthKit.getStepCount(options, (err: string, result: HealthValue) => {
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
