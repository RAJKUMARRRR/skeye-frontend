import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../theme';

export interface LoadingSkeletonProps {
  /**
   * Width of the skeleton
   */
  width?: number | string;

  /**
   * Height of the skeleton
   */
  height?: number;

  /**
   * Border radius
   */
  borderRadius?: number;

  /**
   * Skeleton variant
   * - default: Rectangle skeleton
   * - circle: Circular skeleton (for avatars)
   * - text: Text line skeleton
   */
  variant?: 'default' | 'circle' | 'text';

  /**
   * Custom styles
   */
  style?: ViewStyle;
}

/**
 * Premium loading skeleton with smooth shimmer animation
 * Modern alternative to activity indicators for content loading
 */
export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius: customBorderRadius,
  variant = 'default',
  style,
}: LoadingSkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  let finalBorderRadius = customBorderRadius ?? borderRadius.sm;

  if (variant === 'circle') {
    finalBorderRadius = typeof height === 'number' ? height / 2 : 50;
  } else if (variant === 'text') {
    finalBorderRadius = borderRadius.sm;
  }

  const containerStyle = [
    styles.skeleton,
    {
      width,
      height: variant === 'circle' ? (typeof width === 'number' ? width : height) : height,
      borderRadius: finalBorderRadius,
    },
    style,
  ];

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(20, 184, 166, 0.05)',
            'rgba(20, 184, 166, 0.1)',
            'rgba(20, 184, 166, 0.05)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

/**
 * Pre-built skeleton layouts for common use cases
 */

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={styles.textContainer}>
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          variant="text"
          height={16}
          width={index === lines - 1 ? '70%' : '100%'}
          style={{ marginBottom: 8 }}
        />
      ))}
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <LoadingSkeleton variant="circle" width={48} height={48} />
        <View style={styles.cardHeaderText}>
          <LoadingSkeleton height={16} width="60%" style={{ marginBottom: 8 }} />
          <LoadingSkeleton height={14} width="40%" />
        </View>
      </View>
      <View style={styles.cardBody}>
        <SkeletonText lines={2} />
      </View>
    </View>
  );
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: items }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <LoadingSkeleton variant="circle" width={40} height={40} />
          <View style={styles.listItemText}>
            <LoadingSkeleton height={14} width="70%" style={{ marginBottom: 6 }} />
            <LoadingSkeleton height={12} width="50%" />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.background.secondary,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    width: 350,
    height: '100%',
  },
  textContainer: {
    width: '100%',
  },
  cardContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  cardBody: {
    marginTop: 8,
  },
  listContainer: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    marginBottom: 8,
  },
  listItemText: {
    flex: 1,
    marginLeft: 12,
  },
});
