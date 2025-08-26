import React from 'react';
import { View, ActivityIndicator, useColorScheme, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from './text';
import { ChevronRight } from 'lucide-react-native';
import { useHealthData } from '@/hooks/useHealthData';

export function StepsCard() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { steps: stepCount, hourlySteps, loading, error } = useHealthData();
  const maxSteps = Math.max(...(hourlySteps ?? [0]));

  return (
    <Pressable
      onPress={() => router.push('/steps')}
      className="w-full rounded-xl border border-border bg-card p-4 dark:shadow-none active:opacity-80"
    >
      <View className="mb-3 flex-row items-center justify-between pb-2">
        <Text className="text-xl font-extrabold text-card-foreground">Кроки</Text>
        <ChevronRight size={20} color={dark ? '#C4B5FD' : '#7C3AED'} />
      </View>
      <View className="-mx-4 mb-3 h-px bg-border/40" />
      <View className="mb-4">
        <Text className="text-sm text-muted-foreground">Сьогодні</Text>
        {loading && !error && (
          <ActivityIndicator size="small" color={dark ? '#C4B5FD' : '#7C3AED'} />
        )}
        {error && <Text className="text-sm text-destructive">Нет данных</Text>}
        {stepCount != null && !error && !loading && (
          <Text className="text-4xl font-light tabular-nums text-violet-600 dark:text-violet-300">
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
                className="relative h-16 flex-1 overflow-hidden rounded-sm bg-muted dark:bg-secondary">
                <View
                  className="absolute bottom-0 left-0 right-0 rounded-sm bg-violet-600 dark:bg-violet-400"
                  style={{ height: `${height}%`, opacity: hourlySteps ? 1 : 0.25 }}
                />
              </View>
            );
          })}
        </View>
        <View className="mt-1 flex-row justify-between">
          {['00', '06', '12', '18'].map((label) => (
            <Text key={label} className="text-xs text-muted-foreground">
              {label}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}
