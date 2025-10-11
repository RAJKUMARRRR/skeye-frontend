import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export function useBiometric() {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      const isAvailable = compatible && enrolled;
      setIsBiometricAvailable(isAvailable);

      if (supportedTypes.length > 0) {
        const types = supportedTypes.map((type) => {
          switch (type) {
            case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
              return 'Face ID';
            case LocalAuthentication.AuthenticationType.FINGERPRINT:
              return 'Touch ID';
            case LocalAuthentication.AuthenticationType.IRIS:
              return 'Iris';
            default:
              return 'Biometric';
          }
        });
        setBiometricType(types[0]);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const authenticateWithBiometric = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  return {
    isBiometricAvailable,
    biometricType,
    authenticateWithBiometric,
    checkBiometricAvailability,
  };
}
