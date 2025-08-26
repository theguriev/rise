import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/lib/theme';
import { format } from 'date-fns';
import { BlurView } from 'expo-blur';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Animated, Text, View } from 'react-native';
import { StepsCard } from '../components/ui/steps-card';

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function getFormattedDate() {
  const now = new Date();
  return format(now, 'EEEE, dd MMM').toUpperCase();
}

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const isDark = (colorScheme ?? 'light') === 'dark';
  const bg = isDark ? THEME.dark.background : THEME.light.background;

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const HEADER_EXPANDED = 140;
  const HEADER_COLLAPSED = 96; // height of compact header

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED - HEADER_COLLAPSED],
    outputRange: [HEADER_EXPANDED, HEADER_COLLAPSED],
    extrapolate: 'clamp',
  });

  const bigHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 100],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      {/* Animated container for dynamic spacing */}
      <Animated.View
        className="absolute left-0 right-0 top-0 z-10"
        style={{ height: headerHeight }}>
        {/* Blur background for compact state */}
        <Animated.View
          className="absolute inset-0"
          style={{ flex: 1, opacity: compactTitleOpacity }}>
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={{ flex: 1 }} />
        </Animated.View>

        {/* Big header content */}
        <Animated.View
          className="flex-1 px-5 pb-5 pt-12"
          style={{ backgroundColor: bg, opacity: bigHeaderOpacity }}>
          <View className="flex-1 flex-row items-end justify-between">
            <View>
              <Text className="mb-1 text-[12px] font-bold uppercase text-[#B7BBC2]">
                {getFormattedDate()}
              </Text>
              <Text className="text-4xl font-bold" style={{ color: isDark ? '#E8EAED' : '#111' }}>
                Rise
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </Animated.View>

        {/* Compact header overlay */}
        <Animated.View
          pointerEvents="none"
          className="absolute left-0 right-0 top-0 items-center justify-end"
          style={{ height: HEADER_COLLAPSED, opacity: compactTitleOpacity }}>
          <Text
            className="mb-2 text-lg font-semibold"
            style={{ color: isDark ? '#E8EAED' : '#111' }}>
            Rise
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Scrollable content with top padding to avoid overlap */}
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: HEADER_EXPANDED }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}>
        <View className="gap-4 px-4">
          <StepsCard />
          <StepsCard />
          <StepsCard />
          <StepsCard />
          <StepsCard />
          <StepsCard />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

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
