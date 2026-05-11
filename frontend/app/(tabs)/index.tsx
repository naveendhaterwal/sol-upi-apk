import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { FadeSlideIn, ScalePressable, StaggerChildren } from '../../components/Animated';

const ACTIONS = [
  { icon: 'storefront' as const, label: 'Pay Merchant', color: Colors.primary, bg: 'rgba(77,67,254,0.1)', route: '/pay-manual' },
  { icon: 'wallet' as const, label: 'View Wallet', color: Colors.secondaryDark, bg: 'rgba(181,239,133,0.2)', route: '/wallet' },
  { icon: 'time' as const, label: 'History', color: Colors.tertiary, bg: 'rgba(231,43,231,0.1)', route: '/activity' },
  { icon: 'phone-portrait' as const, label: 'Pay via UPI ID', color: Colors.primary, bg: 'rgba(77,67,254,0.1)', route: '/pay-manual' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading, refreshBalance, initializeWallet } = useWalletStore();

  useEffect(() => {
    const init = async () => {
      const exists = await useWalletStore.getState().checkWallet();
      if (!exists) {
        router.replace('/wallet-setup');
      } else {
        initializeWallet();
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refreshBalance} tintColor={Colors.primary} />
      }
    >
      {/* Header */}
      <FadeSlideIn delay={0} fromY={-12}>
        <View style={styles.header}>
          <ScalePressable 
            style={styles.iconButton}
            onPress={() => Alert.alert('Theme', 'Dark Mode coming soon!')}
          >
            <Ionicons name="moon-outline" size={22} color={Colors.textMuted} />
          </ScalePressable>
          <Text style={styles.headerTitle}>SolUPI</Text>
          <View style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
          </View>
        </View>
      </FadeSlideIn>

      <View style={styles.main}>
        {/* Welcome */}
        <FadeSlideIn delay={80}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Hello, User</Text>
            <Text style={styles.welcomeSubtitle}>Ready to make a payment?</Text>
          </View>
        </FadeSlideIn>

        {/* Hero Card */}
        <FadeSlideIn delay={160} fromY={24}>
          <ScalePressable
            style={styles.heroCard}
            scaleTo={0.97}
            onPress={() => router.push('/scan' as any)}
          >
            {/* Animated inner glow ring */}
            <MotiView
              from={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 320 }}
              style={styles.heroIconContainer}
            >
              <Ionicons name="scan" size={48} color={Colors.surface} />
            </MotiView>
            <Text style={styles.heroTitle}>Tap to Scan & Pay</Text>
            <Text style={styles.heroSubtitle}>Any UPI QR Code instantly</Text>
          </ScalePressable>
        </FadeSlideIn>

        {/* Action Grid — staggered */}
        <View style={styles.grid}>
          <StaggerChildren
            staggerMs={70}
            baseDelay={280}
            fromY={16}
            wrapperStyle={styles.actionWrapper}
          >
            {ACTIONS.map((action) => (
              <ScalePressable
                key={action.label}
                style={styles.actionButton}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </ScalePressable>
            ))}
          </StaggerChildren>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingVertical: Spacing.stackMd,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headlineLg,
    color: Colors.primary,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.stackMd,
    gap: Spacing.stackLg,
  },
  welcomeSection: { gap: Spacing.baseline },
  welcomeTitle: { ...Typography.headlineLgMobile, color: Colors.text },
  welcomeSubtitle: { ...Typography.bodyMd, color: Colors.textMuted },
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xxl,
    padding: Spacing.stackLg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
    minHeight: 200,
  },
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.stackMd,
  },
  heroTitle: { ...Typography.headlineLgMobile, color: Colors.surface, marginBottom: Spacing.baseline },
  heroSubtitle: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.8)' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.gutter,
    justifyContent: 'space-between',
  },
  actionWrapper: {
    width: '47%',
    marginBottom: Spacing.gutter,
  },
  actionButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.stackMd,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.stackSm,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { ...Typography.titleMd, color: Colors.text, textAlign: 'center', fontSize: 14 },
});
