import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { FigmaAssets } from '../constants/figma-assets';

type TransactionPreviewItem = {
  id: string;
  merchant_name: string;
  upi_id: string;
  amount_inr: number;
  status?: string;
  created_at: string;
};

function FigmaLineChart({ color, mirror = false }: { color: string; mirror?: boolean }) {
  return (
    <View
      style={{
        height: 40,
        justifyContent: 'space-between',
        marginTop: 10,
        transform: [{ scaleY: mirror ? -1 : 1 }],
      }}
    >
      <View
        style={{
          height: 2,
          borderRadius: 999,
          backgroundColor: color,
          width: '78%',
          marginLeft: 2,
          transform: [{ rotate: '-10deg' }],
          opacity: 0.9,
        }}
      />
      <View
        style={{
          height: 2,
          borderRadius: 999,
          backgroundColor: color,
          width: '46%',
          alignSelf: 'center',
          transform: [{ rotate: '22deg' }],
        }}
      />
      <View
        style={{
          height: 2,
          borderRadius: 999,
          backgroundColor: color,
          width: '66%',
          alignSelf: 'flex-end',
          transform: [{ rotate: '-8deg' }],
        }}
      />
    </View>
  );
}

export function HomeHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Image
        source={FigmaAssets.profileAvatar}
        style={{ width: 40, height: 40, borderRadius: 6, borderWidth: 1, borderColor: Colors.border }}
      />
      <View
        style={{
          backgroundColor: Colors.primaryMuted,
          borderRadius: 99,
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Ionicons color={Colors.primary} name="flash-outline" size={12} />
        <Text style={{ color: Colors.primary, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }}>
          DEVNET
        </Text>
      </View>
    </View>
  );
}

export function BalanceStrip({
  balanceValue,
  walletValue,
}: {
  balanceValue: string;
  walletValue: string;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: Colors.textMuted, fontSize: 14, letterSpacing: 0.5 }}>
        Wallet Balance
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text selectable style={{ color: Colors.text, fontSize: 34, fontWeight: '500', letterSpacing: 0.5 }}>
            {balanceValue}
          </Text>
          <Text selectable style={{ color: Colors.textFaint, fontSize: 13, marginTop: 4, letterSpacing: 0.4 }}>
            {walletValue}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Colors.successBg,
            borderRadius: 51,
            paddingLeft: 6,
            paddingRight: 12,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Ionicons color={Colors.success} name="shield-checkmark-outline" size={12} />
          <Text style={{ color: Colors.success, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 }}>
            Devnet Ready
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ScanPayHero({
  onScanPress,
  onManualPress,
}: {
  onScanPress: () => void;
  onManualPress: () => void;
}) {
  return (
    <View
      style={{
        minHeight: 214,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 18,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(0,0,0,0.12)',
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <Text style={{ color: Colors.bg, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
          Scan & Pay
        </Text>
      </View>

      <Text
        style={{
          color: Colors.bg,
          fontSize: 29,
          lineHeight: 31,
          fontWeight: '600',
          marginTop: 16,
          letterSpacing: 0.4,
        }}
      >
        Pay any UPI QR{'\n'}using Solana
      </Text>

      <Text
        style={{
          color: 'rgba(0,0,0,0.7)',
          fontSize: 15,
          lineHeight: 21,
          marginTop: 10,
          maxWidth: 230,
        }}
      >
        Real devnet transfer, instant receipt, and a clean merchant payment flow.
      </Text>

      <View style={{ marginTop: 'auto', flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={onScanPress}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 14,
            backgroundColor: Colors.bg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Ionicons color={Colors.primary} name="scan" size={18} />
          <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '700', letterSpacing: 0.4 }}>
            Scan QR
          </Text>
        </Pressable>

        <Pressable
          onPress={onManualPress}
          style={{
            width: 112,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.16)',
            backgroundColor: 'rgba(255,255,255,0.28)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: Colors.bg, fontSize: 14, fontWeight: '700', letterSpacing: 0.4 }}>
            Pay ID
          </Text>
        </Pressable>
      </View>

      <View style={{ position: 'absolute', right: 16, top: 20 }}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons color={Colors.bg} name="qr-code-outline" size={34} />
        </View>
      </View>
    </View>
  );
}

export function QuickWalletCards({
  inrAmount,
  solAmount,
}: {
  inrAmount: string;
  solAmount: string;
}) {
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '500', letterSpacing: 0.5 }}>
          Wallet Overview
        </Text>
        <Text style={{ color: Colors.textFaint, fontSize: 12, letterSpacing: 0.4 }}>
          Live balance
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
        <CompactWalletCard
          title="Available"
          symbol="INR Value"
          amount={inrAmount}
          changeLabel="Ready to spend"
          accentColor="#CB4DFF"
          backgroundColor="#26172F"
          logo={FigmaAssets.bitcoinLogo}
        />
        <CompactWalletCard
          title="Solana"
          symbol="SOL"
          amount={solAmount}
          changeLabel="On-chain funds"
          accentColor="#4A73FF"
          backgroundColor="#202B51"
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#2081F6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: Colors.text, fontSize: 20, fontWeight: '700' }}>◇</Text>
          </View>
        </CompactWalletCard>
      </ScrollView>
    </View>
  );
}

type CompactWalletCardProps = {
  title: string;
  symbol: string;
  amount: string;
  changeLabel: string;
  accentColor: string;
  backgroundColor: string;
  logo?: any;
  children?: React.ReactNode;
};

function CompactWalletCard({
  title,
  symbol,
  amount,
  changeLabel,
  accentColor,
  backgroundColor,
  logo,
  children,
}: CompactWalletCardProps) {
  return (
    <View
      style={{
        width: 176,
        height: 136,
        borderRadius: 18,
        padding: 16,
        backgroundColor,
        overflow: 'hidden',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {children || <Image source={logo} style={{ width: 36, height: 36 }} />}
        <View>
          <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '500', letterSpacing: 0.5 }}>
            {title}
          </Text>
          <Text style={{ color: Colors.textFaint, fontSize: 12, marginTop: 3, letterSpacing: 0.5 }}>
            {symbol}
          </Text>
        </View>
      </View>

      <FigmaLineChart color={accentColor} mirror={backgroundColor === '#202B51'} />

      <View style={{ marginTop: 'auto', gap: 2 }}>
        <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '600', letterSpacing: 0.5 }}>
          {amount}
        </Text>
        <Text style={{ color: Colors.textFaint, fontSize: 11, letterSpacing: 0.4 }}>
          {changeLabel}
        </Text>
      </View>
    </View>
  );
}

export function RecentTransactionsPreview({
  transactions,
  onViewAll,
}: {
  transactions: TransactionPreviewItem[];
  onViewAll: () => void;
}) {
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: Colors.text, fontSize: 20, fontWeight: '500', letterSpacing: 0.5 }}>
          Recent Transactions
        </Text>
        <Pressable onPress={onViewAll}>
          <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600', letterSpacing: 0.4 }}>
            View All
          </Text>
        </Pressable>
      </View>

      {transactions.length > 0 ? (
        <View style={{ gap: 12 }}>
          {transactions.map((transaction) => {
            const success = (transaction.status || '').toLowerCase() !== 'failed';

            return (
              <View
                key={transaction.id}
                style={{
                  borderRadius: 18,
                  backgroundColor: Colors.surfaceSoft,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  borderWidth: 1,
                  borderColor: Colors.borderSoft,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: success ? Colors.primaryMuted : Colors.dangerBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    color={success ? Colors.primary : Colors.danger}
                    name={success ? 'arrow-up' : 'close'}
                    size={18}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '600', letterSpacing: 0.3 }}>
                    {transaction.merchant_name}
                  </Text>
                  <Text style={{ color: Colors.textFaint, fontSize: 12, marginTop: 3 }}>
                    {transaction.upi_id}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '600' }}>
                    ₹{transaction.amount_inr}
                  </Text>
                  <Text
                    style={{
                      color: success ? Colors.success : Colors.danger,
                      fontSize: 11,
                      marginTop: 3,
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}
                  >
                    {transaction.status || 'success'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            borderRadius: 18,
            backgroundColor: Colors.surfaceSoft,
            padding: 18,
            borderWidth: 1,
            borderColor: Colors.borderSoft,
          }}
        >
          <Text style={{ color: Colors.text, fontSize: 15, fontWeight: '600' }}>
            No payments yet
          </Text>
          <Text style={{ color: Colors.textFaint, fontSize: 13, lineHeight: 20, marginTop: 6 }}>
            Scan your first UPI QR to create a SolUPI transaction receipt.
          </Text>
        </View>
      )}
    </View>
  );
}
