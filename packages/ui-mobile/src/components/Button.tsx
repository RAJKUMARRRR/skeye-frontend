import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/tokens';

export interface ButtonProps {
  children: string | React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  enableHaptics?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  enableHaptics = true,
}: ButtonProps) {
  const handlePress = (event: GestureResponderEvent) => {
    if (disabled || loading) return;
    
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress?.(event);
  };

  const getButtonContent = () => {
    const textContent = typeof children === 'string' ? (
      <Text style={[styles.text, sizeStyles[size].text, variantStyles[variant].text, textStyle]}>
        {children}
      </Text>
    ) : (
      children
    );

    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : colors.accent.DEFAULT}
        />
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === 'left' && icon}
          {textContent}
          {iconPosition === 'right' && icon}
        </>
      );
    }

    return textContent;
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[
          styles.container,
          sizeStyles[size].container,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.accent.DEFAULT, colors.accent.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles[size].gradient]}
        >
          {getButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.container,
        sizeStyles[size].container,
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {getButtonContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    container: {
      height: 40,
    },
    gradient: {
      height: 40,
      paddingHorizontal: spacing.lg,
    },
    text: {
      fontSize: typography.fontSize.sm,
    },
  },
  md: {
    container: {
      height: 48,
    },
    gradient: {
      height: 48,
      paddingHorizontal: spacing.xl,
    },
    text: {
      fontSize: typography.fontSize.base,
    },
  },
  lg: {
    container: {
      height: 56,
    },
    gradient: {
      height: 56,
      paddingHorizontal: spacing['2xl'],
    },
    text: {
      fontSize: typography.fontSize.lg,
    },
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    container: {
      ...shadows.md,
    },
    text: {
      color: '#ffffff',
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.background.elevated,
      ...shadows.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    text: {
      color: colors.text.primary,
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    text: {
      color: colors.accent.DEFAULT,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    text: {
      color: colors.text.secondary,
    },
  },
});
