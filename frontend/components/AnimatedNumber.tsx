/**
 * AnimatedNumber — counts from 0 to a target value over a duration.
 * Built on Reanimated useAnimatedProps + TextInput trick.
 *
 * Usage:
 *   <AnimatedNumber value={8760.18} prefix="₹" decimals={2} />
 *   <AnimatedNumber value={0.0042} suffix=" SOL" decimals={4} />
 */

import React, { useEffect } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Text } from 'react-native';

// We use a JS-driven approach for simplicity/compatibility:
// Track value with useSharedValue, update a state on each frame via useAnimatedReaction

import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
  easing?: (t: number) => number;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 800,
  style,
}: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.value = 0;
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  useAnimatedReaction(
    () => animatedValue.value,
    (current) => {
      runOnJS(setDisplayValue)(current);
    }
  );

  const formatted = `${prefix}${displayValue.toFixed(decimals)}${suffix}`;

  return <Text style={style}>{formatted}</Text>;
}
