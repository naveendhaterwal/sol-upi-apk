import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useWalletStore } from '../store/useWalletStore';
import { usePrice, useRecordPayment } from '../services/queries';
import { parseUpiPayload } from '../utils/upi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Fixed merchant receiver — all UPI payments route here
const DEMO_RECEIVER_ADDRESS =
  process.env.EXPO_PUBLIC_RECEIVER_SOL_ADDRESS ??
  'FBw48qHoKKdNDk8d1YZo2DizFvvXr44F1wLQ9uPmnQ7f';

export default function PayScreen() {
  const router = useRouter();
  const { qrData, pa, pn, am } = useLocalSearchParams<{ qrData?: string; pa?: string; pn?: string; am?: string; }>();
  const { userId, balance } = useWalletStore();
  const { data: priceData } = usePrice();
  const { mutate: sendSol, isPending } = useRecordPayment();
  const insets = useSafeAreaInsets();

  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [merchant, setMerchant] = useState({ pa: '', pn: '', am: 0, tr: '' });

  useEffect(() => {
    if (qrData) {
      const parsed = parseUpiPayload(qrData);
      if (!parsed.valid) setPayloadError(parsed.errors[0] || 'Invalid UPI payload.');
      setMerchant({ pa: parsed.pa, pn: parsed.pn, am: parsed.am, tr: parsed.tr || '' });
      return;
    }
    const manualAmount = Number.parseFloat(am || '0') || 0;
    setMerchant({ pa: pa || '', pn: pn || 'UPI Merchant', am: manualAmount, tr: '' });
  }, [am, pa, pn, qrData]);

  const rate = priceData?.sol_inr || 14000.0;
  const amountInr = merchant.am;
  const amountSol = useMemo(() => amountInr / rate, [amountInr, rate]);
  
  // Real transfer is 1% of the total to save devnet funds
  // Minimum 0.001 SOL to ensure rent-exemption for new accounts
  const transferSol = useMemo(() => Math.max(amountSol * 0.01, 0.001), [amountSol]);
  const insufficientFunds = transferSol > balance;

  const handlePay = () => {
    if (!userId) return;
    if (payloadError) return Alert.alert('Error', payloadError);
    if (amountInr <= 0) return Alert.alert('Error', 'Invalid amount.');
    if (insufficientFunds) return Alert.alert('Insufficient Funds', 'Request an airdrop in settings.');

    sendSol(
      {
        userId,
        to_address: DEMO_RECEIVER_ADDRESS,
        upi_id: merchant.pa,
        merchant_name: merchant.pn,
        amount_inr: amountInr,
        amount_crypto: transferSol,
      },
      {
        onSuccess: (data) => {
          router.replace({
            pathname: '/success',
            params: {
              hash: data.transaction.txn_hash,
              amount: amountInr.toFixed(2),
              merchant: merchant.pn,
              sol: transferSol.toFixed(6),
            },
          });
        },
        onError: (e: any) => {
          Alert.alert('Payment Failed', e.message || 'The transaction failed on the backend.');
        }
      }
    );
  };

  const InfoRow = ({ label, value, highlight }: any) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && { color: Colors.primary, fontWeight: '700' }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.merchantSection}>
          <View style={styles.merchantAvatar}>
            <Ionicons name="storefront" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.merchantName}>{merchant.pn || 'Unknown Merchant'}</Text>
          <Text style={styles.amountText}>₹{amountInr.toFixed(2)}</Text>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="UPI ID" value={merchant.pa || 'N/A'} />
          <InfoRow label="Available Balance" value={`${balance.toFixed(4)} SOL`} />
          <InfoRow label="Amount (SOL)" value={`${amountSol.toFixed(6)} SOL`} />
          <InfoRow label="Actual Deduction (Demo)" value={`${transferSol.toFixed(6)} SOL`} highlight />
        </View>

        <Pressable
          onPress={handlePay}
          disabled={isPending || !!payloadError || insufficientFunds || amountInr <= 0}
          style={({ pressed }) => [
            styles.payButton,
            (isPending || !!payloadError || insufficientFunds || amountInr <= 0) && styles.payButtonDisabled,
            { transform: [{ scale: pressed ? 0.98 : 1 }] }
          ]}
        >
          {isPending ? (
            <ActivityIndicator color={Colors.surface} />
          ) : (
            <Text style={styles.payButtonText}>
              Confirm Payment
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.containerMargin,
    paddingBottom: Spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.titleMd,
    color: Colors.text,
  },
  contentContainer: {
    padding: Spacing.containerMargin,
    paddingBottom: 120,
    gap: Spacing.sectionGap,
  },
  merchantSection: {
    alignItems: 'center',
    gap: Spacing.stackMd,
    marginTop: Spacing.stackLg,
  },
  merchantAvatar: {
    width: 80,
    height: 80,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + '1A', // Light primary
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantName: {
    ...Typography.titleMd,
    color: Colors.textMuted,
  },
  amountText: {
    ...Typography.headlineXl,
    color: Colors.text,
    fontSize: 56,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSoft,
  },
  infoLabel: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },
  infoValue: {
    ...Typography.titleMd,
    color: Colors.text,
    fontSize: 14,
  },
  payButton: {
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    ...Typography.titleMd,
    color: Colors.surface,
  },
});
