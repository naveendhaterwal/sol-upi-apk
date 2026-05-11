import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Clipboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Radii } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrice } from '../../services/queries';
import { MotiView } from 'moti';
import {
  FadeSlideIn,
  ScalePressable,
  StaggerChildren,
  PulsingDot,
} from '../../components/Animated';
import { AnimatedNumber } from '../../components/AnimatedNumber';

export default function WalletTab() {
  const { publicKey, balance } = useWalletStore();
  const { data: priceData } = usePrice();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const inrRate = priceData?.sol_inr || 14000.0;
  const solBalance = balance || 0;
  const inrBalance = solBalance * inrRate;
  const displayAddress = publicKey ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}` : 'No wallet';

  const handleCopy = () => {
    if (publicKey) {
      Clipboard.setString(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const QUICK_ACTIONS = [
    { icon: 'qr-code' as const, label: 'Receive', route: '/receive' },
    { icon: 'arrow-up' as const, label: 'Send', route: '/send' },
    { icon: 'receipt' as const, label: 'History', route: '/activity' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <FadeSlideIn fromY={-10}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
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

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <FadeSlideIn delay={60}>
          <View style={styles.sectionHeader}>
            <Text style={styles.pageTitle}>Wallet</Text>
            <Text style={styles.pageSubtitle}>Manage your digital assets.</Text>
          </View>
        </FadeSlideIn>

        {/* Hero Wallet Card */}
        <FadeSlideIn delay={120} fromY={28}>
          <View style={styles.walletCard}>
            <View style={styles.walletCardHeader}>
              <View>
                <Text style={styles.walletName}>My Wallet</Text>
                <View style={styles.networkBadge}>
                  <PulsingDot color={Colors.secondary} size={8} />
                  <Text style={styles.networkText}>Devnet</Text>
                </View>
              </View>
              <MotiView
                from={{ rotate: '-20deg', opacity: 0 }}
                animate={{ rotate: '0deg', opacity: 1 }}
                transition={{ type: 'spring', damping: 12, delay: 300 }}
                style={styles.solIconContainer}
              >
                <Ionicons name="flash" size={24} color={Colors.bg} />
              </MotiView>
            </View>

            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>TOTAL PORTFOLIO VALUE</Text>
              <View style={styles.balanceRow}>
                {/* Animated SOL balance counter */}
                <AnimatedNumber
                  value={solBalance}
                  decimals={4}
                  duration={900}
                  style={styles.balanceAmount}
                />
                <Text style={styles.balanceCurrency}>SOL</Text>
              </View>
              {/* Animated INR balance */}
              <AnimatedNumber
                value={inrBalance}
                prefix="≈ ₹"
                suffix=" INR"
                decimals={2}
                duration={900}
                style={styles.fiatBalance}
              />
            </View>

            {/* Address row with copy feedback */}
            <ScalePressable
              style={[
                styles.addressContainer,
                copied && { borderColor: Colors.secondary },
              ]}
              onPress={handleCopy}
              scaleTo={0.97}
            >
              <Text style={styles.addressText}>{displayAddress}</Text>
              <MotiView
                animate={{ scale: copied ? 1.2 : 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={copied ? Colors.secondary : 'rgba(255,255,255,0.7)'}
                />
              </MotiView>
            </ScalePressable>
          </View>
        </FadeSlideIn>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <StaggerChildren
            staggerMs={80}
            baseDelay={200}
            fromY={12}
            wrapperStyle={styles.actionWrapper}
          >
            {QUICK_ACTIONS.map((a) => (
              <ScalePressable
                key={a.label}
                style={styles.actionButton}
                onPress={() => router.push(a.route as any)}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name={a.icon} size={24} color={Colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </ScalePressable>
            ))}
          </StaggerChildren>
        </View>

        {/* Assets List */}
        <FadeSlideIn delay={380}>
          <View style={styles.assetsSection}>
            <View style={styles.assetsHeader}>
              <Text style={styles.assetsTitle}>Assets</Text>
              <Text style={styles.viewAllText}>View All</Text>
            </View>

            <View style={styles.assetList}>
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'spring', damping: 16, delay: 450 }}
                style={styles.assetItem}
              >
                <View style={styles.assetLeft}>
                  <View style={styles.assetIconWrapper}>
                    <Ionicons name="flash" size={20} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.assetSymbol}>SOL</Text>
                    <Text style={styles.assetName}>Solana</Text>
                  </View>
                </View>
                <View style={styles.assetRight}>
                  <Text style={styles.assetSymbol}>{solBalance.toFixed(4)}</Text>
                  <Text style={styles.assetName}>₹{inrBalance.toFixed(2)}</Text>
                </View>
              </MotiView>
            </View>
          </View>
        </FadeSlideIn>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: Spacing.stackSm,
    backgroundColor: 'rgba(248,249,250,0.92)',
  },
  profileContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.stackSm },
  avatarPlaceholder: {
    width: 40, height: 40, borderRadius: Radii.full,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { ...Typography.headlineLgMobile, color: Colors.primary, fontSize: 24 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  contentContainer: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.stackLg,
    paddingBottom: 120,
    gap: Spacing.sectionGap,
  },
  sectionHeader: { gap: Spacing.stackSm },
  pageTitle: { ...Typography.headlineLgMobile, color: Colors.text },
  pageSubtitle: { ...Typography.bodyMd, color: Colors.textMuted },
  walletCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xxl,
    padding: Spacing.stackLg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  walletCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.stackLg,
  },
  walletName: { ...Typography.titleMd, color: Colors.surface, letterSpacing: -0.5 },
  networkBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  networkText: { ...Typography.labelSm, color: 'rgba(255,255,255,0.7)' },
  solIconContainer: {
    width: 48, height: 48, borderRadius: Radii.lg,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  balanceContainer: { marginBottom: Spacing.stackLg },
  balanceLabel: { ...Typography.labelSm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing.stackSm },
  balanceRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.stackSm },
  balanceAmount: { ...Typography.headlineXl, color: Colors.surface },
  balanceCurrency: { ...Typography.titleMd, color: 'rgba(255,255,255,0.7)' },
  fiatBalance: { ...Typography.bodyMd, color: Colors.secondary, marginTop: 4 },
  addressContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addressText: { ...Typography.bodyMd, color: 'rgba(255,255,255,0.8)', fontVariant: ['tabular-nums'] },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.gutter },
  actionWrapper: {
    flex: 1,
  },
  actionButton: {
    alignItems: 'center',
    gap: Spacing.stackSm,
    width: '100%',
  },
  actionIconContainer: {
    width: 56, height: 56, borderRadius: Radii.xl,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { ...Typography.labelSm, color: Colors.text },
  assetsSection: { gap: Spacing.stackMd },
  assetsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assetsTitle: { ...Typography.titleMd, color: Colors.text },
  viewAllText: { ...Typography.labelSm, color: Colors.primary },
  assetList: { gap: Spacing.stackSm },
  assetItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, padding: Spacing.stackMd,
    borderRadius: Radii.lg, borderWidth: 1, borderColor: Colors.border,
  },
  assetLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.stackMd },
  assetIconWrapper: {
    width: 40, height: 40, borderRadius: Radii.full,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  assetSymbol: { ...Typography.titleMd, color: Colors.text, fontSize: 16 },
  assetName: { ...Typography.labelSm, color: Colors.textMuted },
  assetRight: { alignItems: 'flex-end' },
});
