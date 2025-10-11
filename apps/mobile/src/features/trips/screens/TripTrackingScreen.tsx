import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../../components/layouts/Screen';
import { Header } from '../../../components/layouts/Header';

export default function TripTrackingScreen() {
  return (
    <Screen>
      <Header title="Trip Tracking" />
      <View style={styles.container}>
        <Text style={styles.text}>Trip Tracking Screen - T191</Text>
        <Text style={styles.subtext}>Features: Start/stop trip, live stats, auto-save to SQLite</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
