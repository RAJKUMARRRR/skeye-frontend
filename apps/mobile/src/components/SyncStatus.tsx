import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { syncManager } from '../lib/sync/SyncManager';

export function SyncStatus() {
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe((status) => {
      setQueueSize(status.queueSize);
      setIsSyncing(status.status === 'syncing');
    });

    // Load initial status
    loadStatus();

    return unsubscribe;
  }, []);

  const loadStatus = async () => {
    const status = await syncManager.getSyncStatus();
    setQueueSize(status.queueSize);
  };

  const handlePress = () => {
    syncManager.sync();
  };

  if (queueSize === 0) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} disabled={isSyncing}>
      <Ionicons
        name={isSyncing ? 'sync' : 'cloud-upload'}
        size={16}
        color="#3b82f6"
        style={isSyncing ? styles.spinning : undefined}
      />
      <Text style={styles.text}>
        {isSyncing ? 'Syncing...' : `${queueSize} pending`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  spinning: {
    // Animation would be handled with Animated API
  },
});
