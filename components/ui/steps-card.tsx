import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from './text';
import { ChevronRight } from 'lucide-react-native';
import { useHealthData } from '@/hooks/useHealthData';

export function StepsCard() {
  const { steps: stepCount, hourlySteps, loading, error } = useHealthData();
  const maxSteps = Math.max(...(hourlySteps ?? [0]));

  return (
    <View className="w-full rounded-xl bg-[#16171A] p-4">
      <View className="mb-3 flex-row items-center justify-between pb-2">
        <Text className="text-xl font-extrabold text-[#E8EAED]">Кроки</Text>
        <ChevronRight size={20} color="#B399FF" />
      </View>
      <View className="-mx-4 mb-3 h-px bg-white/5" />
      <View className="mb-4">
        <Text className="text-sm text-[#B7BBC2]">Сьогодні</Text>
        {loading && !error && <ActivityIndicator size="small" color="#B399FF" />}
        {error && <Text className="text-sm text-red-400">Нет данных</Text>}
        {stepCount != null && !error && !loading && (
          <Text className="text-4xl font-light tabular-nums text-[#B399FF]">
            {stepCount.toLocaleString()}
          </Text>
        )}
      </View>
      <View>
        <View className="h-16 flex-row items-end justify-between gap-1">
          {(hourlySteps ?? Array(24).fill(0)).map((steps, index) => {
            const height = maxSteps > 0 ? (steps / maxSteps) * 100 : 0;
            return (
              <View
                key={index}
                className="relative h-16 flex-1 overflow-hidden rounded-sm bg-[#23232A]">
                <View
                  className="absolute bottom-0 left-0 right-0 rounded-sm bg-[#B399FF]"
                  style={{ height: `${height}%`, opacity: hourlySteps ? 1 : 0.25 }}
                />
              </View>
            );
          })}
        </View>
        <View className="mt-1 flex-row justify-between">
          {['00', '06', '12', '18'].map((label) => (
            <Text key={label} className="text-xs text-[#B7BBC2]">
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
