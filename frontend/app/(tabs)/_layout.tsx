import { Tabs } from 'expo-router';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MotiView } from 'moti';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home' as const, iconOutline: 'home-outline' as const },
  { name: 'wallet', label: 'Wallet', icon: 'wallet' as const, iconOutline: 'wallet-outline' as const },
  { name: 'activity', label: 'Activity', icon: 'receipt' as const, iconOutline: 'receipt-outline' as const },
  { name: 'profile', label: 'Profile', icon: 'person' as const, iconOutline: 'person-outline' as const },
];

function AnimatedTabItem({
  tab,
  focused,
  onPress,
}: {
  tab: typeof TABS[0];
  focused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(focused ? 1 : 0.55);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(1.22, { damping: 10, stiffness: 180 }, () => {
      scale.value = withSpring(1, { damping: 12, stiffness: 180 });
    });
    onPress();
  };

  // Animate opacity when focused changes
  useEffect(() => {
    opacity.value = withTiming(focused ? 1 : 0.55, { duration: 200 });
  }, [focused, opacity]);

  return (
    <Pressable
      onPress={handlePress}
      style={styles.tabItem}
    >
      {/* Animated pill background */}
      <MotiView
        animate={{
          opacity: focused ? 1 : 0,
          scaleX: focused ? 1 : 0.4,
        }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        style={styles.tabPill}
      />

      {/* Icon */}
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? tab.icon : tab.iconOutline}
          size={22}
          color={focused ? Colors.primary : Colors.textMuted}
        />
      </Animated.View>

      {/* Label */}
      <MotiView
        animate={{ opacity: focused ? 1 : 0.5 }}
        transition={{ type: 'timing', duration: 200 }}
      >
        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
          {tab.label}
        </Text>
      </MotiView>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  const getTabIndex = (name: string) =>
    state.routes.findIndex((r: any) => r.name === name);

  return (
    <MotiView
      from={{ translateY: 80, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 180, delay: 300 }}
      style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {TABS.map((tab) => {
        const tabIdx = getTabIndex(tab.name);
        const focused = state.index === tabIdx;

        return (
          <AnimatedTabItem
            key={tab.name}
            tab={tab}
            focused={focused}
            onPress={() => navigation.navigate(tab.name)}
          />
        );
      })}
    </MotiView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: Colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingTop: 8,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 8,
    right: 8,
    backgroundColor: Colors.primary + '12',
    borderRadius: 14,
  },
  tabLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
    marginTop: 3,
    fontSize: 10,
  },
  tabLabelFocused: {
    color: Colors.primary,
  },
});
