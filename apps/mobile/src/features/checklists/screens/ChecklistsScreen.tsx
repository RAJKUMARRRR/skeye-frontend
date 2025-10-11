import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ChecklistItem {
  id: string;
  label: string;
  type: 'boolean' | 'photo' | 'signature';
  isRequired: boolean;
  value?: boolean;
  photoUri?: string;
  signatureUri?: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

const INSPECTION_CHECKLIST: ChecklistSection[] = [
  {
    title: 'Vehicle Exterior',
    items: [
      { id: '1', label: 'Tires - Proper inflation and condition', type: 'boolean', isRequired: true },
      { id: '2', label: 'Lights - All lights functioning', type: 'boolean', isRequired: true },
      { id: '3', label: 'Mirrors - Clean and properly adjusted', type: 'boolean', isRequired: true },
      { id: '4', label: 'Body damage photo', type: 'photo', isRequired: false },
    ],
  },
  {
    title: 'Vehicle Interior',
    items: [
      { id: '5', label: 'Seat belts - All functioning', type: 'boolean', isRequired: true },
      { id: '6', label: 'Dashboard indicators - All normal', type: 'boolean', isRequired: true },
      { id: '7', label: 'Brakes - Functioning properly', type: 'boolean', isRequired: true },
      { id: '8', label: 'Steering - Responsive', type: 'boolean', isRequired: true },
    ],
  },
  {
    title: 'Fluid Levels',
    items: [
      { id: '9', label: 'Oil level - Within acceptable range', type: 'boolean', isRequired: true },
      { id: '10', label: 'Coolant level - Sufficient', type: 'boolean', isRequired: true },
      { id: '11', label: 'Brake fluid - Adequate level', type: 'boolean', isRequired: true },
    ],
  },
  {
    title: 'Confirmation',
    items: [
      { id: '12', label: 'Driver signature', type: 'signature', isRequired: true },
    ],
  },
];

export default function ChecklistsScreen() {
  const [checklist, setChecklist] = useState<ChecklistSection[]>(INSPECTION_CHECKLIST);
  const [currentType, setCurrentType] = useState<'pre-trip' | 'post-trip'>('pre-trip');

  const handleBooleanToggle = (sectionIndex: number, itemIndex: number) => {
    setChecklist((prev) => {
      const updated = [...prev];
      const item = updated[sectionIndex].items[itemIndex];
      item.value = !item.value;
      return updated;
    });
  };

  const handlePhotoCapture = async (sectionIndex: number, itemIndex: number) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setChecklist((prev) => {
          const updated = [...prev];
          updated[sectionIndex].items[itemIndex].photoUri = result.assets[0].uri;
          return updated;
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleSignature = (sectionIndex: number, itemIndex: number) => {
    // TODO: Navigate to signature pad screen
    Alert.alert('Signature Pad', 'Signature pad screen will open here');
  };

  const isChecklistComplete = () => {
    return checklist.every((section) =>
      section.items.every((item) => {
        if (!item.isRequired) return true;
        if (item.type === 'boolean') return item.value === true;
        if (item.type === 'photo') return !!item.photoUri;
        if (item.type === 'signature') return !!item.signatureUri;
        return false;
      })
    );
  };

  const handleSubmit = () => {
    if (!isChecklistComplete()) {
      Alert.alert('Incomplete Checklist', 'Please complete all required items before submitting');
      return;
    }

    Alert.alert('Success', 'Checklist submitted successfully', [
      {
        text: 'OK',
        onPress: () => {
          // TODO: Send to server
          console.log('Checklist submitted:', checklist);
        },
      },
    ]);
  };

  const renderBooleanItem = (item: ChecklistItem, sectionIndex: number, itemIndex: number) => (
    <TouchableOpacity
      key={item.id}
      style={styles.checklistItem}
      onPress={() => handleBooleanToggle(sectionIndex, itemIndex)}
    >
      <View style={styles.checklistItemContent}>
        <View style={[styles.checkbox, item.value && styles.checkboxChecked]}>
          {item.value && <Ionicons name="checkmark" size={20} color="#ffffff" />}
        </View>
        <View style={styles.checklistItemText}>
          <Text style={styles.checklistLabel}>{item.label}</Text>
          {item.isRequired && <Text style={styles.requiredBadge}>Required</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPhotoItem = (item: ChecklistItem, sectionIndex: number, itemIndex: number) => (
    <View key={item.id} style={styles.checklistItem}>
      <View style={styles.checklistItemContent}>
        <Ionicons name="camera-outline" size={24} color="#6b7280" />
        <View style={styles.checklistItemText}>
          <Text style={styles.checklistLabel}>{item.label}</Text>
          {item.isRequired && <Text style={styles.requiredBadge}>Required</Text>}
        </View>
      </View>
      {item.photoUri ? (
        <View style={styles.photoPreview}>
          <Image source={{ uri: item.photoUri }} style={styles.photoImage} />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => handlePhotoCapture(sectionIndex, itemIndex)}
          >
            <Ionicons name="camera" size={16} color="#3b82f6" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={() => handlePhotoCapture(sectionIndex, itemIndex)}
        >
          <Ionicons name="camera" size={20} color="#3b82f6" />
          <Text style={styles.captureButtonText}>Take Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSignatureItem = (item: ChecklistItem, sectionIndex: number, itemIndex: number) => (
    <View key={item.id} style={styles.checklistItem}>
      <View style={styles.checklistItemContent}>
        <Ionicons name="create-outline" size={24} color="#6b7280" />
        <View style={styles.checklistItemText}>
          <Text style={styles.checklistLabel}>{item.label}</Text>
          {item.isRequired && <Text style={styles.requiredBadge}>Required</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.signatureButton}
        onPress={() => handleSignature(sectionIndex, itemIndex)}
      >
        <Ionicons name="create" size={20} color="#3b82f6" />
        <Text style={styles.signatureButtonText}>
          {item.signatureUri ? 'Update Signature' : 'Add Signature'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vehicle Inspection</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, currentType === 'pre-trip' && styles.typeButtonActive]}
            onPress={() => setCurrentType('pre-trip')}
          >
            <Text
              style={[styles.typeButtonText, currentType === 'pre-trip' && styles.typeButtonTextActive]}
            >
              Pre-Trip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, currentType === 'post-trip' && styles.typeButtonActive]}
            onPress={() => setCurrentType('post-trip')}
          >
            <Text
              style={[styles.typeButtonText, currentType === 'post-trip' && styles.typeButtonTextActive]}
            >
              Post-Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {checklist.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => {
                if (item.type === 'boolean') {
                  return renderBooleanItem(item, sectionIndex, itemIndex);
                } else if (item.type === 'photo') {
                  return renderPhotoItem(item, sectionIndex, itemIndex);
                } else if (item.type === 'signature') {
                  return renderSignatureItem(item, sectionIndex, itemIndex);
                }
                return null;
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !isChecklistComplete() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isChecklistComplete()}
        >
          <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
          <Text style={styles.submitButtonText}>Submit Checklist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  checklistItem: {
    gap: 12,
  },
  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checklistItemText: {
    flex: 1,
  },
  checklistLabel: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  requiredBadge: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  captureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  photoPreview: {
    gap: 8,
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  signatureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
