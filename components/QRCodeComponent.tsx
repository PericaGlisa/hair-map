import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import { X, QrCode, Scan } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface QRCodeComponentProps {
  mode: 'generate' | 'scan';
  data?: string;
  onScan?: (data: string) => void;
  onClose?: () => void;
  visible: boolean;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  mode,
  data,
  onScan,
  onClose,
  visible,
}) => {
  const { colors } = useColorScheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (mode === 'scan' && visible) {
      getCameraPermissions();
    }
  }, [mode, visible]);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ type, data: scannedData }: { type: string; data: string }) => {
    setScanned(true);
    if (onScan) {
      onScan(scannedData);
    }
    Alert.alert('QR Code Scanned', `Data: ${scannedData}`, [
      { text: 'OK', onPress: () => setScanned(false) },
    ]);
  };

  const renderQRGenerator = () => {
    if (!data) return null;

    return (
      <View style={styles.generatorContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Your QR Code</Text>
        <View style={styles.qrContainer}>
          <QRCode
            value={data}
            size={200}
            color={colors.text}
            backgroundColor={colors.background}
          />
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Share this QR code with customers to quickly access your services
        </Text>
      </View>
    );
  };

  const renderQRScanner = () => {
    if (hasPermission === null) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Requesting camera permission...
          </Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: colors.text }]}>
            No access to camera
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colors.primary }]}
            onPress={getCameraPermissions}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.scannerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Scan QR Code</Text>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>
          </CameraView>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>>
          Position the QR code within the frame to scan
        </Text>
        {scanned && (
          <TouchableOpacity
            style={[styles.rescanButton, { backgroundColor: colors.primary }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {mode === 'generate' ? renderQRGenerator() : renderQRScanner()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  generatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: Fonts.weights.bold,
    marginBottom: 30,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  description: {
    fontSize: Fonts.sizes.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: Fonts.sizes.lg,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
  },
  rescanButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  rescanButtonText: {
    color: '#FFFFFF',
    fontSize: Fonts.sizes.base,
    fontWeight: Fonts.weights.medium,
  },
});

export default QRCodeComponent;