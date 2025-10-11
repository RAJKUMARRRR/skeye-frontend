import React, { ReactNode } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  keyboardAvoiding?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: any;
  style?: any;
}

export function Screen({
  children,
  scrollable = false,
  safeArea = true,
  keyboardAvoiding = false,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  style,
}: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        ) : undefined
      }
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, style]}>{children}</View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {safeArea ? <SafeAreaView style={styles.container}>{content}</SafeAreaView> : content}
      </KeyboardAvoidingView>
    );
  }

  return safeArea ? <SafeAreaView style={styles.container}>{content}</SafeAreaView> : content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});
