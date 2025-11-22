import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Screen } from '../../../components/layouts/Screen';
import { Header } from '../../../components/layouts/Header';
import { PhotoCapture } from '../components/PhotoCapture';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { getCurrentLocation, LocationUpdate } from '../../../lib/location/backgroundLocation';
import { runInsert } from '../../../lib/db/init';
import { syncQueue } from '../../../lib/sync/SyncQueue';

type IncidentType = 'accident' | 'breakdown' | 'damage' | 'other';

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'accident', label: 'Accident' },
  { value: 'breakdown', label: 'Breakdown' },
  { value: 'damage', label: 'Vehicle Damage' },
  { value: 'other', label: 'Other' },
];

export default function IncidentReportScreen() {
  const [incidentType, setIncidentType] = useState<IncidentType>('accident');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | undefined>();
  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    const currentLocation = await getCurrentLocation();
    setLocation(currentLocation);
  };

  const handlePhotoCapture = (uri: string) => {
    setPhotos(prev => [...prev, uri]);
  };

  const handleVoiceRecording = (uri: string, duration: number) => {
    setVoiceNoteUri(uri);
    console.log('Voice note recorded:', { uri, duration });
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please provide a description of the incident.');
      return;
    }

    setIsSubmitting(true);

    try {
      const incidentId = `incident_${Date.now()}`;
      const now = Date.now();

      const incidentData = {
        id: incidentId,
        type: incidentType,
        description,
        photos: JSON.stringify(photos),
        voice_note_uri: voiceNoteUri,
        latitude: location?.latitude,
        longitude: location?.longitude,
        timestamp: now,
        synced: 0,
      };

      // Save to SQLite (we'll need to create an incidents table)
      // For now, just add to sync queue
      await syncQueue.addToQueue('trip', incidentId, 'create', incidentData);

      Alert.alert(
        'Incident Reported',
        'Your incident report has been saved and will be synced when online.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setDescription('');
              setPhotos([]);
              setVoiceNoteUri(undefined);
              setIncidentType('accident');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting incident:', error);
      Alert.alert('Error', 'Failed to save incident report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scrollable>
      <Header title="Report Incident" showBack />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Incident Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Incident Type *</Text>
          <View style={styles.typeContainer}>
            {INCIDENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  incidentType === type.value && styles.typeButtonActive,
                ]}
                onPress={() => setIncidentType(type.value)}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    incidentType === type.value && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what happened..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Location */}
        {location && (
          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                GPS: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
              {location.accuracy && (
                <Text style={styles.locationAccuracy}>
                  Accuracy: ±{location.accuracy.toFixed(0)}m
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.label}>Photos</Text>
          <PhotoCapture
            onPhotoCapture={handlePhotoCapture}
            photos={photos}
            maxPhotos={5}
          />
        </View>

        {/* Voice Note */}
        <View style={styles.section}>
          <Text style={styles.label}>Voice Note (Optional)</Text>
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecording}
            recordingUri={voiceNoteUri}
            maxDuration={120}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 120,
  },
  locationBox: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  locationText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  locationAccuracy: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    height: 32,
  },
});
