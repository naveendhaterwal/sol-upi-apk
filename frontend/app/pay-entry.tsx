import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useWalletStore } from '../store/useWalletStore';
import { usePrice } from '../services/queries';
import { parseUpiPayload } from '../utils/upi';
import { MotiView } from 'moti';
import {
  FadeSlideIn,
  ScalePressable,
  ShakeView,
} from '../components/Animated';

export default function PayEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pa, pn, am, qrData } = useLocalSearchParams<{
    pa?: string; pn?: string; am?: string; qrData?: string;
  }>();
  const { publicKey, balance } = useWalletStore();
  const { data: priceData } = usePrice();

  const [amount, setAmount] = useState(am || '');
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [upiId, setUpiId] = useState(pa || '');
  const [merchantName, setMerchantName] = useState(pn || 'UPI Merchant');
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false);

  // Simulated wallets for the selector
  const WALLETS = [
    { id: '1', name: 'Primary Wallet', address: publicKey, balance: balance, active: true },
    { id: '2', name: 'Savings Vault', address: 'Vault...8899', balance: 0.42, active: false },
  ];

  useEffect(() => {
    if (qrData) {
      const parsed = parseUpiPayload(qrData);
      if (parsed.valid || parsed.pa) {
        setUpiId(parsed.pa);
        setMerchantName(parsed.pn || 'UPI Merchant');
        if (parsed.am > 0) setAmount(String(parsed.am));
      }
    } else if (pn === 'Manual Entry' || !pn) {
      // Randomize for manual entry to feel more alive
      const MOCK_MERCHANTS = [
        { name: 'Starbucks Coffee', upi: 'starbucks@axl' },
        { name: 'Zomato Food', upi: 'zomato@paytm' },
        { name: 'Amazon Shopping', upi: 'amazon@apl' },
        { name: 'Local Grocery', upi: 'kirana@upi' },
        { name: 'Shell Petrol', upi: 'shell@ybl' },
        { name: 'Uber Ride', upi: 'uber@icici' },
      ];
      const random = MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)];
      setMerchantName(random.name);
      if (!pa) setUpiId(random.upi);
    }
  }, [qrData, pn, pa]);

  const rate = priceData?.sol_inr || 14000;
  const parsedAmount = parseFloat(amount) || 0;
  const amountSol = useMemo(() => parsedAmount / rate, [parsedAmount, rate]);

  const walletDisplay = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : '—';
  const merchantInitial = merchantName.charAt(0).toUpperCase();

  const handlePay = () => {
    if (parsedAmount <= 0) {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
      return;
    }
    router.push({
      pathname: '/pay',
      params: { pa: upiId, pn: merchantName, am: amount },
    });
  };

  const toggleWalletSheet = () => setIsWalletSheetOpen(!isWalletSheetOpen);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.card, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Minimal Header for Back Navigation */}
        <View style={styles.header}>
          <ScalePressable style={styles.iconBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </ScalePressable>
        </View>

        {/* Merchant Info */}
        <FadeSlideIn delay={100}>
          <View style={styles.merchantSection}>
            <MotiView
              from={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 200 }}
              style={styles.merchantAvatar}
            >
              <Text style={styles.merchantInitial}>{merchantInitial}</Text>
            </MotiView>
            <Text style={styles.merchantName} numberOfLines={2}>{merchantName}</Text>
            {upiId ? (
              <Text style={styles.merchantUpi}>{upiId}</Text>
            ) : null}
          </View>
        </FadeSlideIn>

        {/* Amount Entry */}
        <View style={styles.amountSection}>
          <ShakeView trigger={shakeTrigger}>
            <FadeSlideIn delay={200} fromY={20}>
              <View style={styles.amountRow}>
                <Text style={styles.rupeeSymbol}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0"
                  placeholderTextColor={Colors.border}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  autoFocus={!am}
                  maxLength={10}
                />
              </View>
            </FadeSlideIn>
          </ShakeView>

          {/* SOL equivalent */}
          <MotiView
            animate={{
              opacity: parsedAmount > 0 ? 1 : 0,
              translateY: parsedAmount > 0 ? 0 : 10,
            }}
            transition={{ type: 'timing', duration: 250 }}
          >
            <Text style={styles.solEquivalent}>
              ≈ {amountSol.toFixed(6)} SOL · @ ₹{rate.toFixed(0)}/SOL
            </Text>
          </MotiView>

          {/* Add note */}
          <FadeSlideIn delay={300}>
            {showNoteInput ? (
              <View style={styles.noteInputContainer}>
                <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note (optional)"
                  placeholderTextColor={Colors.textFaint}
                  autoFocus
                  maxLength={80}
                  returnKeyType="done"
                  onSubmitEditing={() => setShowNoteInput(false)}
                />
              </View>
            ) : (
              <ScalePressable
                onPress={() => setShowNoteInput(true)}
                style={styles.addNoteBtn}
              >
                <Ionicons name="add" size={16} color={Colors.primary} />
                <Text style={styles.addNoteText}>Add a note</Text>
              </ScalePressable>
            )}
          </FadeSlideIn>
        </View>

        {/* Bottom Section */}
        <MotiView
          from={{ translateY: 100 }}
          animate={{ translateY: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 400 }}
          style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}
        >
          {/* Wallet selector */}
          <ScalePressable 
            style={styles.walletSelector} 
            scaleTo={0.98}
            onPress={toggleWalletSheet}
          >
            <View style={styles.walletLeft}>
              <View style={styles.walletIconRing}>
                <Ionicons name="wallet-outline" size={22} color={Colors.primary} />
              </View>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.walletName}>My Wallet</Text>
                  <View style={styles.dot} />
                  <Text style={styles.walletBalanceText}>
                    {balance.toFixed(2)} SOL
                  </Text>
                </View>
                <Text style={styles.walletAddress}>{walletDisplay}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
          </ScalePressable>

          {/* Pay Button */}
          <ScalePressable
            onPress={handlePay}
            disabled={parsedAmount <= 0}
            style={[
              styles.payBtn,
              parsedAmount <= 0 && styles.payBtnDisabled,
            ]}
          >
            {/* Pulsing effect on button when ready */}
            {parsedAmount > 0 && (
              <MotiView
                from={{ opacity: 0.4, scale: 0.95 }}
                animate={{ opacity: 0, scale: 1.15 }}
                transition={{ type: 'timing', duration: 1500, loop: true }}
                style={[StyleSheet.absoluteFill, { backgroundColor: Colors.secondary, borderRadius: Radii.xl }]}
              />
            )}
            <Text style={styles.payBtnText}>
              {parsedAmount > 0 ? `Pay ₹${parsedAmount.toFixed(0)}` : 'Enter Amount'}
            </Text>
            {parsedAmount > 0 && (
              <Ionicons name="arrow-forward" size={20} color={Colors.text} />
            )}
          </ScalePressable>

          {/* Security note */}
          <View style={styles.securityRow}>
            <Ionicons name="shield-checkmark" size={13} color={Colors.secondaryDark} />
            <Text style={styles.securityText}>
              Secured by Solana · Devnet
            </Text>
          </View>
        </MotiView>
      </View>

      {/* Wallet Selection Bottom Sheet */}
      {isWalletSheetOpen && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={styles.sheetOverlay}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={toggleWalletSheet} />
          <MotiView
            from={{ translateY: 400 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            style={[styles.sheetContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
          >
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Wallet</Text>
            
            {WALLETS.map((w) => (
              <ScalePressable 
                key={w.id} 
                style={[styles.walletItem, w.active && styles.walletItemActive]}
                onPress={toggleWalletSheet}
              >
                <View style={styles.walletItemLeft}>
                  <View style={[styles.walletItemIcon, w.active && { backgroundColor: Colors.primary }]}>
                    <Ionicons name="wallet" size={20} color={w.active ? Colors.surface : Colors.textMuted} />
                  </View>
                  <View>
                    <Text style={styles.walletItemName}>{w.name}</Text>
                    <Text style={styles.walletItemAddr}>{w.address?.slice(0, 8)}...{w.address?.slice(-8)}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.walletItemBalance}>{w.balance.toFixed(2)} SOL</Text>
                  {w.active && (
                    <Ionicons name="checkmark-circle" size={18} color={Colors.secondary} />
                  )}
                </View>
              </ScalePressable>
            ))}

            <ScalePressable style={styles.addWalletBtn} onPress={toggleWalletSheet}>
              <Ionicons name="add" size={20} color={Colors.primary} />
              <Text style={styles.addWalletText}>Add New Wallet</Text>
            </ScalePressable>
          </MotiView>
        </MotiView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F5', alignItems: 'center', justifyContent: 'center' },
  card: { flex: 1, width: '100%', backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin, paddingVertical: Spacing.stackMd,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: Radii.full,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F1F2',
  },
  merchantSection: {
    alignItems: 'center', paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.stackSm, paddingBottom: Spacing.stackLg, gap: Spacing.stackSm,
  },
  merchantAvatar: {
    width: 64, height: 64, borderRadius: Radii.full,
    backgroundColor: Colors.bg, borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  merchantInitial: { ...Typography.headlineLgMobile, color: Colors.primary, fontSize: 26 },
  merchantName: { ...Typography.titleMd, color: Colors.text, textAlign: 'center', fontSize: 17, maxWidth: 260 },
  merchantUpi: { ...Typography.bodyMd, color: Colors.textMuted, fontSize: 14 },
  amountSection: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Spacing.containerMargin, gap: Spacing.stackMd,
  },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  rupeeSymbol: { ...Typography.headlineXl, color: Colors.text, fontSize: 44, marginTop: 4 },
  amountInput: { ...Typography.headlineXl, color: Colors.text, fontSize: 56, minWidth: 80, textAlign: 'center', padding: 0, margin: 0 },
  solEquivalent: { ...Typography.bodyMd, color: Colors.textMuted, fontSize: 13 },
  addNoteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.primary + '10', borderRadius: Radii.full,
  },
  addNoteText: { ...Typography.labelSm, color: Colors.primary, fontSize: 13 },
  noteInputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.primary,
    borderRadius: Radii.xl, paddingHorizontal: 14, paddingVertical: 10, width: '100%', backgroundColor: Colors.bg,
  },
  noteInput: { ...Typography.bodyMd, flex: 1, color: Colors.text, padding: 0 },
  bottomSheet: {
    paddingHorizontal: Spacing.containerMargin, paddingTop: Spacing.stackLg,
    backgroundColor: Colors.bg, borderTopLeftRadius: Radii.xxl, borderTopRightRadius: Radii.xxl,
    borderTopWidth: 1, borderColor: Colors.border, gap: Spacing.stackMd,
  },
  walletSelector: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1, borderColor: Colors.border, padding: Spacing.stackMd,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.stackMd },
  walletIconRing: {
    width: 44, height: 44, borderRadius: Radii.full, backgroundColor: Colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  walletName: { ...Typography.titleMd, fontSize: 14, color: Colors.text },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.textMuted, opacity: 0.5 },
  walletBalanceText: { ...Typography.labelSm, color: Colors.secondaryDark, fontSize: 12 },
  walletAddress: { ...Typography.bodyMd, fontSize: 12, color: Colors.textMuted, fontVariant: ['tabular-nums'], marginTop: 2 },
  payBtn: {
    height: 58, backgroundColor: Colors.secondary, borderRadius: Radii.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: Colors.secondaryDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4,
    overflow: 'hidden',
  },
  payBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0, elevation: 0 },
  payBtnText: { ...Typography.titleMd, color: Colors.text, fontSize: 17, zIndex: 1 },
  securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingBottom: 4 },
  securityText: { ...Typography.labelSm, color: Colors.textMuted, fontSize: 11 },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  sheetContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xxl,
    borderTopRightRadius: Radii.xxl,
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: 12,
    gap: 16,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    ...Typography.titleMd,
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: Radii.xl,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletItemActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  walletItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletItemIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletItemName: {
    ...Typography.titleMd,
    fontSize: 15,
    color: Colors.text,
  },
  walletItemAddr: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.textMuted,
  },
  walletItemBalance: {
    ...Typography.titleMd,
    fontSize: 14,
    color: Colors.text,
  },
  addWalletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 8,
  },
  addWalletText: {
    ...Typography.titleMd,
    fontSize: 15,
    color: Colors.primary,
  },
});
