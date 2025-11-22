import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, shadows } from '../theme/tokens';

export interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  enableHaptics?: boolean;
}

export function CustomSwitch({
  value,
  onValueChange,
  disabled = false,
  enableHaptics = true,
}: CustomSwitchProps) {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [value, animation]);

  const handlePress = () => {
    if (disabled) return;

    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animated press feedback
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onValueChange(!value);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 27],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background.elevated, colors.accent.DEFAULT],
  });

  const thumbScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.track,
            {
              backgroundColor,
            },
            value && styles.trackActive,
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                transform: [
                  { translateX },
                  { scale: thumbScale },
                ],
              },
              value && styles.thumbActive,
            ]}
          />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    width: 52,
    height: 28,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    ...shadows.sm,
  },
  trackActive: {
    ...shadows.glowSm,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.DEFAULT,
    ...shadows.md,
  },
  thumbActive: {
    backgroundColor: '#ffffff',
  },
  disabled: {
    opacity: 0.5,
  },
});
