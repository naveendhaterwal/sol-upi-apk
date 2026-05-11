import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useWalletStore } from '../store/useWalletStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WalletSetupScreen() {
  const router = useRouter();
  const { createWallet } = useWalletStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      await createWallet();
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message || 'Failed to create wallet on server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.iconWrapper}>
            <Ionicons name="flash" size={48} color={Colors.surface} />
          </View>
          <Text style={styles.title}>SolUPI</Text>
          <Text style={styles.subtitle}>
            Next-generation payment infrastructure. Lightning fast. Zero friction.
          </Text>
        </View>

        <View style={styles.bottomSection}>
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            onPress={handleCreate}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              { transform: [{ scale: pressed ? 0.98 : 1 }] }
            ]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.surface} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Initialize Account</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.surface} />
              </View>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            Custodial Devnet Demo
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.containerMargin,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  heroSection: {
    gap: Spacing.stackLg,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: Radii.xxl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    ...Typography.headlineXl,
    color: Colors.text,
    fontSize: 56,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.textMuted,
    maxWidth: '80%',
  },
  bottomSection: {
    gap: Spacing.stackLg,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.stackSm,
    backgroundColor: Colors.errorContainer,
    padding: Spacing.stackMd,
    borderRadius: Radii.md,
  },
  errorText: {
    ...Typography.bodyMd,
    color: Colors.error,
    flex: 1,
  },
  button: {
    backgroundColor: Colors.text,
    height: 64,
    borderRadius: Radii.full,
    justifyContent: 'center',
    paddingHorizontal: Spacing.stackLg,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    ...Typography.titleMd,
    color: Colors.surface,
  },
  footerText: {
    ...Typography.labelSm,
    color: Colors.textFaint,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
