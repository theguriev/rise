import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Text, View } from 'react-native';
import { StepsCard } from '../components/ui/steps-card';
import { format } from 'date-fns';

const SCREEN_OPTIONS = {
  light: {
    headerTransparent: true,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: THEME.light.background },
    headerRight: () => <ThemeToggle />,
    headerTitle: () => (
      <View style={{ alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#B7BBC2', textTransform: 'uppercase', marginBottom: 2 }}>
          {getFormattedDate()}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#E8EAED' }}>Rise</Text>
      </View>
    ),
  },
  dark: {
    headerTransparent: true,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: THEME.dark.background },
    headerRight: () => <ThemeToggle />,
    headerTitle: () => (
      <View style={{ alignItems: 'flex-start' }}>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#B7BBC2', textTransform: 'uppercase', marginBottom: 2 }}>
          {getFormattedDate()}
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#E8EAED' }}>Rise</Text>
      </View>
    ),
  },
};

function getFormattedDate() {
  const now = new Date();
  // Формат: SATURDAY, 23 AUG
  return format(now, 'EEEE, dd MMM').toUpperCase();
}

export default function Screen() {
  const { colorScheme } = useColorScheme();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} />
      <View className="flex-1 items-center p-4">
        <View className="w-full mb-4">
          <Text className="text-xs font-bold text-[#B7BBC2] uppercase mb-2 text-center">{getFormattedDate()}</Text>
          <StepsCard />
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
