import React, { useMemo } from 'react';
import {
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useTransactions, useChainHistory, usePrice } from '../../services/queries';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import {
  FadeSlideIn,
  ScalePressable,
  StaggerChildren,
  SpringEntrance,
} from '../../components/Animated';

type UnifiedTx = {
  id: string;
  direction: 'sent' | 'received';
  amount_sol: number;
  amount_inr?: number;
  label: string;
  sublabel: string;
  timestamp: number; // unix ms
  status: string;
  txn_hash?: string;
  source: 'db' | 'chain';
};

export default function ActivityScreen() {
  const { userId } = useWalletStore();
  const queryClient = useQueryClient();
  const { data: dbTxs, isLoading: dbLoading } = useTransactions(userId);
  const { data: chainTxs, isLoading: chainLoading } = useChainHistory(userId);
  const { data: priceData } = usePrice();
  const insets = useSafeAreaInsets();

  const rate = priceData?.sol_inr || 14000;
  const isLoading = dbLoading || chainLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['chain-history'] });
  };

  const unified: UnifiedTx[] = useMemo(() => {
    const seen = new Set<string>();
    const result: UnifiedTx[] = [];

    for (const tx of dbTxs || []) {
      const key = tx.txn_hash || tx.id;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          id: tx.id,
          direction: 'sent',
          amount_sol: tx.amount_crypto ?? 0,
          amount_inr: tx.amount_inr,
          label: tx.merchant_name || 'Transfer',
          sublabel: tx.upi_id || '',
          timestamp: new Date(tx.created_at).getTime(),
          status: tx.status,
          txn_hash: tx.txn_hash,
          source: 'db',
        });
      }
    }

    for (const tx of chainTxs || []) {
      const key = tx.signature;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          id: tx.signature,
          direction: tx.direction === 'received' ? 'received' : 'sent',
          amount_sol: tx.amount_sol,
          label: tx.direction === 'received' ? 'Received SOL' : 'Sent SOL',
          sublabel: tx.counterparty || '',
          timestamp: tx.timestamp ? tx.timestamp * 1000 : Date.now(),
          status: tx.status,
          txn_hash: tx.signature,
          source: 'chain',
        });
      }
    }

    return result.sort((a, b) => b.timestamp - a.timestamp);
  }, [dbTxs, chainTxs]);

  const openExplorer = (sig: string) => {
    Linking.openURL(`https://explorer.solana.com/tx/${sig}?cluster=devnet`);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' · ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TxCard = ({ tx }: { tx: UnifiedTx }) => {
    const isReceived = tx.direction === 'received';
    const inrValue = tx.amount_inr ?? (tx.amount_sol * rate);

    return (
      <ScalePressable
        style={styles.txCard}
        onPress={() => tx.txn_hash && openExplorer(tx.txn_hash)}
        scaleTo={0.97}
      >
        <View style={[
          styles.txIcon,
          { backgroundColor: isReceived ? '#E6F7EC' : Colors.primary + '15' }
        ]}>
          <Ionicons
            name={isReceived ? 'arrow-down-outline' : 'arrow-up-outline'}
            size={22}
            color={isReceived ? '#1A7A40' : Colors.primary}
          />
        </View>

        <View style={styles.txMeta}>
          <Text style={styles.txLabel} numberOfLines={1}>{tx.label}</Text>
          <Text style={styles.txSublabel} numberOfLines={1}>
            {tx.sublabel || 'via Solana'} · {formatTime(tx.timestamp)}
          </Text>
        </View>

        <View style={styles.txAmounts}>
          <Text style={[styles.txAmountSol, { color: isReceived ? '#1A7A40' : Colors.text }]}>
            {isReceived ? '+' : '−'}{tx.amount_sol.toFixed(4)} SOL
          </Text>
          <Text style={styles.txAmountInr}>
            ≈ ₹{inrValue.toFixed(2)}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: tx.status === 'success' ? '#E6F7EC' : Colors.errorContainer }
          ]}>
            <Text style={[styles.statusText, {
              color: tx.status === 'success' ? '#1A7A40' : Colors.error
            }]}>
              {tx.status === 'success' ? 'Success' : 'Failed'}
            </Text>
          </View>
        </View>
      </ScalePressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <FadeSlideIn fromY={-12}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={18} color={Colors.textMuted} />
            </View>
            <Text style={styles.headerTitle}>SolUPI</Text>
          </View>
          <ScalePressable style={styles.iconButton} onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={22} color={Colors.primary} />
          </ScalePressable>
        </View>
      </FadeSlideIn>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Title Row */}
        <FadeSlideIn delay={100}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Activity</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{unified.length} txns</Text>
            </View>
          </View>
        </FadeSlideIn>

        {/* Legend */}
        <FadeSlideIn delay={180}>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1A7A40' }]} />
              <Text style={styles.legendText}>Received</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Sent</Text>
            </View>
            <Text style={styles.legendNote}>Tap any row to view on Explorer</Text>
          </View>
        </FadeSlideIn>

        {/* Transaction List */}
        {unified.length > 0 ? (
          <View style={styles.txList}>
            <StaggerChildren staggerMs={50} baseDelay={250} fromX={20} fromY={0}>
              {unified.map(tx => <TxCard key={tx.id} tx={tx} />)}
            </StaggerChildren>
          </View>
        ) : !isLoading ? (
          <View style={styles.emptyState}>
            <SpringEntrance delay={300}>
              <View style={styles.emptyIcon}>
                <Ionicons name="receipt-outline" size={40} color={Colors.textMuted} />
              </View>
            </SpringEntrance>
            <FadeSlideIn delay={500}>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptyDesc}>
                Scan a UPI QR code or receive SOL to see your full history here.
              </Text>
            </FadeSlideIn>
          </View>
        ) : null}
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.stackSm,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.primary,
    fontSize: 22,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryContainer + '15',
    borderRadius: Radii.full,
  },
  content: {
    paddingHorizontal: Spacing.containerMargin,
    paddingTop: Spacing.stackLg,
    paddingBottom: 120,
    gap: Spacing.stackMd,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.stackSm,
    marginBottom: 4,
  },
  pageTitle: {
    ...Typography.headlineLg,
    color: Colors.text,
    fontSize: 28,
  },
  countBadge: {
    backgroundColor: Colors.primary + '15',
    borderRadius: Radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    ...Typography.labelSm,
    color: Colors.primary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutter,
    paddingBottom: Spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },
  legendNote: {
    ...Typography.labelSm,
    color: Colors.textFaint,
    marginLeft: 'auto',
  },
  txList: {
    gap: Spacing.stackSm,
  },
  txCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.stackMd,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txMeta: {
    flex: 1,
    gap: 3,
  },
  txLabel: {
    ...Typography.titleMd,
    fontSize: 15,
    color: Colors.text,
  },
  txSublabel: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.textMuted,
  },
  txAmounts: {
    alignItems: 'flex-end',
    gap: 2,
  },
  txAmountSol: {
    ...Typography.titleMd,
    fontSize: 14,
  },
  txAmountInr: {
    ...Typography.bodyMd,
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    borderRadius: Radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  statusText: {
    ...Typography.labelSm,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.sectionGap * 1.5,
    gap: Spacing.stackMd,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radii.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...Typography.titleMd,
    color: Colors.text,
  },
  emptyDesc: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
});
