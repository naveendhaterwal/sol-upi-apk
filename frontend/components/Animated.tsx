/**
 * Shared Animated Components for SolUPI
 * Built on Moti (Framer Motion API for React Native) + Reanimated
 *
 * Components:
 *  - FadeSlideIn       — fade + slide on mount, respects reduced motion
 *  - ScalePressable    — spring scale on press (replaces Pressable)
 *  - StaggerChildren   — auto-staggers children entrance
 *  - PulsingDot        — animated status indicator
 */

import React, { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  useReducedMotion,
} from 'react-native-reanimated';

// ─────────────────────────────────────────────────────────────────
// FadeSlideIn
// Wraps any content with a fade + slide entrance animation.
// ─────────────────────────────────────────────────────────────────
interface FadeSlideInProps {
  children: ReactNode;
  delay?: number;
  fromY?: number;
  fromX?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeSlideIn({
  children,
  delay = 0,
  fromY = 18,
  fromX = 0,
  duration = 420,
  style,
}: FadeSlideInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: fromY, translateX: fromX }}
      animate={{ opacity: 1, translateY: 0, translateX: 0 }}
      transition={{
        type: 'timing',
        duration,
        delay,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
}

// ─────────────────────────────────────────────────────────────────
// ScalePressable
// Spring-scales on press. Drop-in replacement for Pressable.
// ─────────────────────────────────────────────────────────────────
interface ScalePressableProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  springDamping?: number;
}

export function ScalePressable({
  children,
  style,
  scaleTo = 0.96,
  springDamping = 15,
  onPressIn,
  onPressOut,
  ...rest
}: ScalePressableProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={(e) => {
        scale.value = withSpring(scaleTo, { damping: springDamping, stiffness: 200 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: springDamping, stiffness: 200 });
        onPressOut?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[animStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────
// StaggerChildren
// Wraps children and staggers their entrance by `staggerMs`.
// ─────────────────────────────────────────────────────────────────
interface StaggerChildrenProps {
  children: ReactNode[];
  staggerMs?: number;
  fromY?: number;
  fromX?: number;
  baseDelay?: number;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export function StaggerChildren({
  children,
  staggerMs = 60,
  fromY = 20,
  fromX = 0,
  baseDelay = 0,
  wrapperStyle,
}: StaggerChildrenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {React.Children.map(children, (child, i) =>
        reduceMotion ? (
          child
        ) : (
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: fromY, translateX: fromX }}
            animate={{ opacity: 1, translateY: 0, translateX: 0 }}
            transition={{
              type: 'timing',
              duration: 380,
              delay: baseDelay + i * staggerMs,
            }}
            style={wrapperStyle}
          >
            {child}
          </MotiView>
        )
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// PulsingDot
// A dot that breathes (opacity pulse) — use for live/active states.
// ─────────────────────────────────────────────────────────────────
interface PulsingDotProps {
  color?: string;
  size?: number;
}

export function PulsingDot({ color = '#22C55E', size = 8 }: PulsingDotProps) {
  return (
    <MotiView
      from={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 0.3, scale: 1.4 }}
      transition={{
        type: 'timing',
        duration: 900,
        loop: true,
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// ShakeView
// Shakes horizontally on trigger — use for form errors.
// ─────────────────────────────────────────────────────────────────
interface ShakeViewProps {
  children: ReactNode;
  trigger: boolean; // flip to `true` to play shake
  style?: StyleProp<ViewStyle>;
}

export function ShakeView({ children, trigger, style }: ShakeViewProps) {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-4, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    }
  }, [trigger]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[animStyle, style]}>{children}</Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────
// SpringEntrance
// Spring-based entrance (bouncier than FadeSlideIn).
// Perfect for checkmarks, modals, success icons.
// ─────────────────────────────────────────────────────────────────
interface SpringEntranceProps {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export function SpringEntrance({ children, delay = 0, style }: SpringEntranceProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        delay,
        damping: 12,
        stiffness: 140,
        mass: 0.8,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
}
