import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, shadows } from '../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'solid' | 'glass' | 'elevated';
  padding?: keyof typeof spacing;
  onPress?: (event: GestureResponderEvent) => void;
  enableHaptics?: boolean;
}

export function Card({
  children,
  style,
  variant = 'solid',
  padding,
  onPress,
  enableHaptics = true,
}: CardProps) {
  const handlePress = (event: GestureResponderEvent) => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(event);
  };

  const paddingValue = padding ? spacing[padding] : spacing.lg;

  if (variant === 'glass') {
    const Container = onPress ? TouchableOpacity : View;
    return (
      <Container
        onPress={onPress ? handlePress : undefined}
        activeOpacity={onPress ? 0.8 : 1}
        style={[styles.container, styles.glass, style]}
      >
        <BlurView intensity={20} tint="dark" style={[styles.blurContainer, { padding: paddingValue }]}>
          <View style={styles.glassBorder} />
          {children}
        </BlurView>
      </Container>
    );
  }

  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress ? handlePress : undefined}
      activeOpacity={onPress ? 0.95 : 1}
      style={[
        styles.container,
        variantStyles[variant],
        { padding: paddingValue },
        onPress && styles.pressable,
        style,
      ]}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  glass: {
    backgroundColor: 'transparent',
  },
  blurContainer: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  glassBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  pressable: {
    transform: [{ scale: 1 }],
  },
});

const variantStyles = StyleSheet.create({
  solid: {
    backgroundColor: colors.background.card,
    ...shadows.md,
  },
  glass: {
    backgroundColor: 'transparent',
  },
  elevated: {
    backgroundColor: colors.background.elevated,
    ...shadows.lg,
  },
});
