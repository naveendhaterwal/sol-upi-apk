import React, { useState } from 'react';
import { Alert, Text, TextInput, View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { parseUpiPayload } from '../utils/upi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  FadeSlideIn,
  ScalePressable,
} from '../components/Animated';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualValue, setManualValue] = useState('');
  const [showFlash, setShowFlash] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const routeToPayment = (payload: string) => {
    const parsed = parseUpiPayload(payload);

    if (!parsed.valid) {
      Alert.alert('Invalid UPI QR', parsed.errors[0] || 'This QR code cannot be paid with SolUPI.');
      setTimeout(() => setScanned(false), 900);
      return;
    }

    setShowFlash(true);
    setTimeout(() => {
      router.replace({
        pathname: '/pay-entry',
        params: { qrData: payload },
      });
    }, 150);
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: Colors.bg }} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.permissionContent}>
          <View style={styles.permissionHeader}>
            <ScalePressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons color={Colors.text} name="arrow-back" size={24} />
            </ScalePressable>
            <FadeSlideIn delay={100}>
              <Text style={styles.permissionTitle}>Camera access needed</Text>
              <Text style={styles.permissionSubtitle}>
                SolUPI needs camera permission to scan any UPI QR and prepare a payment.
              </Text>
            </FadeSlideIn>
          </View>

          <View style={styles.permissionActions}>
            <FadeSlideIn delay={200}>
              <ScalePressable onPress={requestPermission} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Enable Camera</Text>
              </ScalePressable>
            </FadeSlideIn>

            <FadeSlideIn delay={300}>
              <TextInput
                placeholder="Or paste UPI payload"
                placeholderTextColor={Colors.textMuted}
                style={styles.textInput}
                multiline
                value={manualValue}
                onChangeText={setManualValue}
              />
            </FadeSlideIn>
            <FadeSlideIn delay={400}>
              <ScalePressable onPress={() => routeToPayment(manualValue)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Continue with Payload</Text>
              </ScalePressable>
            </FadeSlideIn>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                routeToPayment(data);
              }
        }
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      <View style={[styles.overlay, { paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 20) }]}>
        <FadeSlideIn fromY={-20}>
          <View style={styles.overlayHeader}>
            <ScalePressable onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons color={Colors.text} name="close" size={24} />
            </ScalePressable>

            <View style={styles.overlayTitleContainer}>
              <Text style={styles.overlayTitle}>Scan UPI QR</Text>
              <Text style={styles.overlaySubtitle}>
                Point the camera at a merchant QR to prepare a Solana-powered UPI payment.
              </Text>
            </View>
          </View>
        </FadeSlideIn>

        <View style={styles.scannerFrame}>
          {[
            { left: 0, top: 0, borderRightWidth: 0, borderBottomWidth: 0 },
            { right: 0, top: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
            { left: 0, bottom: 0, borderRightWidth: 0, borderTopWidth: 0 },
            { right: 0, bottom: 0, borderLeftWidth: 0, borderTopWidth: 0 },
          ].map((position, index) => (
            <MotiView
              key={index}
              from={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.1, opacity: 1 }}
              transition={{
                type: 'timing',
                duration: 800,
                loop: true,
                repeatReverse: true,
              }}
              style={[styles.scannerCorner, position]}
            />
          ))}
          {/* Scanning line */}
          <MotiView
            from={{ translateY: 0 }}
            animate={{ translateY: 280 }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
            style={styles.scanningLine}
          />
        </View>

        <View style={styles.overlayFooter}>
          <FadeSlideIn delay={200} fromY={20}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Scan any UPI QR to pay</Text>
              <Text style={styles.infoSubtitle}>
                SolUPI extracts merchant, UPI ID, and payable amount automatically.
              </Text>
            </View>
          </FadeSlideIn>

          <FadeSlideIn delay={400} fromY={20}>
            <ScalePressable onPress={() => router.push('/pay-manual')} style={styles.manualButton}>
              <Text style={styles.manualButtonText}>Enter UPI details manually</Text>
            </ScalePressable>
          </FadeSlideIn>
        </View>
      </View>

      {/* Success Flash */}
      {showFlash && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 100 }}
          style={styles.flashOverlay}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  permissionContent: { flex: 1, paddingHorizontal: Spacing.containerMargin, justifyContent: 'space-between', paddingBottom: Spacing.sectionGap },
  permissionHeader: { gap: Spacing.stackMd },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginBottom: Spacing.stackSm },
  permissionTitle: { ...Typography.headlineLg, color: Colors.text },
  permissionSubtitle: { ...Typography.bodyMd, color: Colors.textMuted },
  permissionActions: { gap: Spacing.stackMd },
  primaryButton: { height: 56, borderRadius: Radii.full, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { ...Typography.titleMd, color: Colors.surface },
  textInput: { minHeight: 120, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, color: Colors.text, padding: Spacing.stackMd, ...Typography.bodyMd, textAlignVertical: 'top' },
  secondaryButton: { height: 56, borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface },
  secondaryButtonText: { ...Typography.titleMd, color: Colors.text },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', paddingHorizontal: Spacing.containerMargin },
  overlayHeader: { gap: Spacing.stackLg },
  closeButton: { width: 48, height: 48, borderRadius: Radii.full, backgroundColor: 'rgba(255, 255, 255, 0.92)', alignItems: 'center', justifyContent: 'center' },
  overlayTitleContainer: { gap: Spacing.stackSm },
  overlayTitle: { ...Typography.headlineLgMobile, color: Colors.surface, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  overlaySubtitle: { ...Typography.bodyMd, color: Colors.surface, maxWidth: '80%', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  scannerFrame: { alignSelf: 'center', width: 280, height: 280, borderRadius: Radii.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' },
  scannerCorner: { position: 'absolute', width: 40, height: 40, borderColor: Colors.primary, borderWidth: 4, borderRadius: Radii.sm },
  scanningLine: { position: 'absolute', width: '100%', height: 2, backgroundColor: Colors.primary, opacity: 0.5, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10 },
  overlayFooter: { gap: Spacing.stackMd },
  infoBox: { borderRadius: Radii.xl, backgroundColor: 'rgba(0,0,0,0.7)', padding: Spacing.stackMd, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  infoTitle: { ...Typography.titleMd, color: Colors.surface, marginBottom: 4 },
  infoSubtitle: { ...Typography.labelSm, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  manualButton: { alignSelf: 'center', borderRadius: Radii.full, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: Spacing.stackLg, paddingVertical: Spacing.stackSm },
  manualButtonText: { ...Typography.titleMd, color: Colors.primary },
  flashOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF', zIndex: 999 },
});
