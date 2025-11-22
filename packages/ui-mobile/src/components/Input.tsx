import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  disabled = false,
  value,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const actualLeftIcon = leftIcon || icon;
  const [isFocused, setIsFocused] = useState(false);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(labelAnimation, {
      toValue: 1,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.spring(labelAnimation, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();
    }
    onBlur?.(e);
  };

  const labelStyle = {
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.fontSize.base, typography.fontSize.xs],
    }),
    backgroundColor: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#ffffff'],
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {actualLeftIcon && <View style={styles.iconContainer}>{actualLeftIcon}</View>}

        <View style={styles.inputWrapper}>
          {label && (
            <Animated.Text
              style={[
                styles.label,
                labelStyle,
                isFocused && styles.labelFocused,
                error && styles.labelError,
              ]}
            >
              {label}
            </Animated.Text>
          )}

          <TextInput
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
              styles.input,
              actualLeftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
            ]}
            placeholderTextColor={colors.text.muted}
            editable={!disabled}
            {...props}
          />
        </View>

        {rightIcon && (
          onRightIconPress ? (
            <TouchableOpacity onPress={onRightIconPress} style={styles.iconContainer}>
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={styles.iconContainer}>{rightIcon}</View>
          )
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderWidth: 1.5,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.lg,
    minHeight: 56,
    ...shadows.sm,
    transition: 'all 0.2s',
  },
  inputContainerFocused: {
    borderColor: colors.accent.DEFAULT,
    ...shadows.glowSm,
  },
  inputContainerError: {
    borderColor: colors.error.DEFAULT,
  },
  inputContainerDisabled: {
    opacity: 0.5,
    backgroundColor: colors.background.tertiary,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    left: spacing.md,
    paddingHorizontal: spacing.xs,
    color: colors.text.muted,
    fontWeight: typography.fontWeight.medium,
  },
  labelFocused: {
    color: colors.accent.DEFAULT,
  },
  labelError: {
    color: colors.error.DEFAULT,
  },
  input: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontWeight: typography.fontWeight.normal,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  iconContainer: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error.DEFAULT,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },
  helperText: {
    color: colors.text.muted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
  },
});
