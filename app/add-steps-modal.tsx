import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function AddStepsModal() {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="mb-4 text-xl font-semibold">Добавить данные</Text>
      <Text className="text-sm text-muted-foreground">
        Здесь будет форма добавления/редактирования данных шагов.
      </Text>
    </View>
  );
}
