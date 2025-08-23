import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import { ChevronRight } from "lucide-react-native";

export function StepsCard() {
  const stepCount = 3672;
  const hourlySteps = [
    0, 0, 0, 0, 0, 0, // 00-05
    120, 180, 250, 320, 180, 290, // 06-11
    450, 380, 520, 340, 280, 190, // 12-17
    420, 380, 290, 180, 120, 80, // 18-23
  ];
  const maxSteps = Math.max(...hourlySteps);

  return (
    <View className="w-full bg-[#16171A] rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xl font-extrabold text-[#E8EAED]">Кроки</Text>
        <ChevronRight size={20} color="#B399FF" />
      </View>
      <View className="mb-4">
        <Text className="text-sm text-[#B7BBC2]">Сьогодні</Text>
        <Text className="text-4xl font-light text-[#B399FF] tabular-nums">{stepCount.toLocaleString()}</Text>
      </View>
      <View>
        <View className="flex-row items-end justify-between h-16 gap-1">
          {hourlySteps.map((steps, index) => {
            const height = maxSteps > 0 ? (steps / maxSteps) * 100 : 0;
            return (
              <View key={index} className="flex-1 bg-[#23232A] rounded-sm relative overflow-hidden h-16">
                <View
                  className="absolute bottom-0 left-0 right-0 bg-[#B399FF] rounded-sm"
                  style={{ height: `${height}%` }}
                />
              </View>
            );
          })}
        </View>
        <View className="flex-row justify-between mt-1">
          {['00', '06', '12', '18'].map((label) => (
            <Text key={label} className="text-xs text-[#B7BBC2]">{label}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}
