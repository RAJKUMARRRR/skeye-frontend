import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SignatureScreen from 'react-native-signature-canvas';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type SignaturePadScreenParams = {
  SignaturePad: {
    onSignatureCapture: (signature: string) => void;
  };
};

type SignaturePadRouteProp = RouteProp<SignaturePadScreenParams, 'SignaturePad'>;

export default function SignaturePadScreen() {
  const navigation = useNavigation();
  const route = useRoute<SignaturePadRouteProp>();
  const signatureRef = useRef<any>(null);

  const handleSignature = (signature: string) => {
    if (route.params?.onSignatureCapture) {
      route.params.onSignatureCapture(signature);
    }
    navigation.goBack();
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleSave = () => {
    signatureRef.current?.readSignature();
  };

  const handleCancel = () => {
    Alert.alert('Cancel Signature', 'Are you sure you want to cancel without saving?', [
      { text: 'Continue Signing', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Ionicons name="close" size={28} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Signature</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructions}>
          <Ionicons name="create-outline" size={32} color="#6b7280" />
          <Text style={styles.instructionsText}>
            Please sign in the box below using your finger
          </Text>
        </View>

        <View style={styles.signatureContainer}>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => Alert.alert('Empty', 'Please provide a signature')}
            onBegin={() => console.log('Signature started')}
            descriptionText=""
            clearText="Clear"
            confirmText="Save"
            imageType="image/png"
            penColor="#000000"
            backgroundColor="#ffffff"
            webStyle={`
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body, html {
                height: 100%;
                width: 100%;
                overflow: hidden;
                background-color: #ffffff;
              }
              .m-signature-pad {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                box-shadow: none;
                border: none;
              }
              .m-signature-pad--body {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: none;
                background-color: #ffffff;
              }
              .m-signature-pad--body canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100% !important;
                height: 100% !important;
                touch-action: none;
              }
              .m-signature-pad--footer {
                display: none;
              }
            `}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="trash-outline" size={20} color="#6b7280" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
            <Text style={styles.saveButtonText}>Save Signature</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  instructions: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  instructionsText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  signatureContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#14b8a6',
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  clearButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#14b8a6',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
