import React from 'react';
import { ScrollView, View, RefreshControl, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useHealthData } from '@/hooks/useHealthData';
import { ChevronLeft } from 'lucide-react-native';

export default function StepsScreen() {
  const { steps, hourlySteps, distanceKm, activeEnergyKcal, loading, error, refresh } =
    useHealthData();
  const [refreshing, setRefreshing] = React.useState(false);
  const max = Math.max(...(hourlySteps ?? [0]));

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <ScrollView
      className="flex-1 py-6"
      contentContainerStyle={{ paddingBottom: 64 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="flex h-24 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.replace('/')}
          className="flex flex-row items-center py-1 active:opacity-70">
          <ChevronLeft color="#2563eb" />
          <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">На головну</Text>
        </Pressable>
        <Text className="text-base font-semibold text-card-foreground">Кроки</Text>
        <Pressable
          onPress={() => router.push('/add-steps-modal')}
          className="py-1 pr-2 active:opacity-70">
          <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">Добавить</Text>
        </Pressable>
      </View>
      {error && <Text className="mb-4 text-destructive">Ошибка загрузки</Text>}
      <View className="mb-6 px-4">
        <Text className="text-xs uppercase tracking-wide text-muted-foreground">Всего сегодня</Text>
        {loading ? (
          <Skeleton className="mt-2 h-12 w-40" />
        ) : (
          <Text className="text-5xl font-light tabular-nums text-violet-600 dark:text-violet-300">
            {steps?.toLocaleString() ?? '—'}
          </Text>
        )}
      </View>
      <View className="mb-6 flex-row justify-between gap-6 px-4">
        <Metric
          label="Дистанция"
          value={distanceKm != null ? `${distanceKm.toFixed(2)} км` : '—'}
          loading={loading}
        />
        <Metric
          label="Энергия"
          value={activeEnergyKcal != null ? `${activeEnergyKcal.toFixed(0)} ккал` : '—'}
          loading={loading}
        />
      </View>
      <View className="px-4">
        <Text className="mb-2 text-sm text-muted-foreground">Почасовое распределение</Text>
        <View className="h-40 flex-row items-end gap-[2px]">
          {(hourlySteps ?? Array(24).fill(0)).map((v, i) => {
            const h = max > 0 ? (v / max) * 100 : 0;
            return (
              <View
                key={i}
                className="flex-1 overflow-hidden rounded-sm bg-muted dark:bg-secondary">
                <View
                  style={{ height: `${h}%` }}
                  className="w-full rounded-sm bg-violet-600 dark:bg-violet-400"
                />
              </View>
            );
          })}
        </View>
        <View className="mt-2 flex-row justify-between">
          {['0', '6', '12', '18', '24'].map((l) => (
            <Text key={l} className="text-[10px] text-muted-foreground">
              {l}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function Metric({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <View>
      <Text className="text-xs text-muted-foreground">{label}</Text>
      {loading ? (
        <Skeleton className="mt-1 h-5 w-16" />
      ) : (
        <Text className="text-lg font-medium">{value}</Text>
      )}
    </View>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <View className={`overflow-hidden rounded-md bg-muted dark:bg-secondary ${className}`} />;
}
