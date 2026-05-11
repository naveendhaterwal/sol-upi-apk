import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radii, Spacing } from '../constants/theme';
import { MotiView } from 'moti';
import {
  FadeSlideIn,
  ScalePressable,
  SpringEntrance,
} from '../components/Animated';
import { AnimatedNumber } from '../components/AnimatedNumber';

/**
 * Confetti — Small colored dots that explode from the center.
 */
function Confetti() {
  const dots = Array.from({ length: 12 });
  const colors = [Colors.primary, Colors.secondary, Colors.tertiary, '#FB923C', '#38BDF8'];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {dots.map((_, i) => {
        const angle = (i * 360) / dots.length;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        const color = colors[i % colors.length];

        return (
          <MotiView
            key={i}
            from={{ opacity: 1, scale: 0, translateX: 0, translateY: 0 }}
            animate={{ opacity: 0, scale: 1, translateX: x, translateY: y }}
            transition={{
              type: 'timing',
              duration: 1000,
              delay: 300,
              easing: (t) => t * (2 - t), // easeOut
            }}
            style={[
              styles.confettiDot,
              { backgroundColor: color, left: '50%', top: '50%' }
            ]}
          />
        );
      })}
    </View>
  );
}

export default function SuccessScreen() {
  const router = useRouter();
  const { hash, amount, merchant, sol } = useLocalSearchParams<{
    hash: string;
    amount: string;
    merchant: string;
    sol: string;
  }>();

  const numAmount = parseFloat(amount || '0');
  const numSol = parseFloat(sol || '0');

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1.5 }}
        transition={{ type: 'timing', duration: 2000 }}
        style={styles.bgGlow}
      />

      <View style={styles.main}>
        {/* Confetti Explosion */}
        <Confetti />

        {/* Checkmark Circle */}
        <SpringEntrance delay={200}>
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark-sharp" size={64} color={Colors.primary} />
          </View>
        </SpringEntrance>

        <View style={styles.textSection}>
          <FadeSlideIn delay={400} fromY={10}>
            <Text style={styles.successLabel}>Payment Successful</Text>
          </FadeSlideIn>

          <View style={styles.amountWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <AnimatedNumber
              value={numAmount}
              decimals={0}
              duration={1200}
              style={styles.amountText}
            />
          </View>

          <FadeSlideIn delay={600} fromY={10}>
            <Text style={styles.merchantLabel}>{merchant}</Text>
          </FadeSlideIn>
        </View>

        {/* Transaction Detail Card */}
        {/* Transaction Detail Card */}
        <FadeSlideIn delay={800} fromY={30} style={{ width: '100%' }}>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Transaction Hash</Text>
              <View style={styles.hashContainer}>
                <Text style={styles.detailHash} numberOfLines={1} ellipsizeMode="middle">
                  {hash || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Crypto Value</Text>
              <View style={styles.solValueRow}>
                <AnimatedNumber
                  value={numSol}
                  decimals={6}
                  duration={1200}
                  suffix=" SOL"
                  style={styles.solValueText}
                />
              </View>
            </View>
          </View>
        </FadeSlideIn>
      </View>

      {/* Footer Button */}
      <FadeSlideIn delay={1100} fromY={20}>
        <ScalePressable
          onPress={() => router.replace('/(tabs)')}
          style={styles.returnBtn}
        >
          <Text style={styles.returnBtnText}>Return to Home</Text>
        </ScalePressable>
      </FadeSlideIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 32,
    justifyContent: 'space-between',
  },
  bgGlow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: Colors.primary + '10',
    left: '-20%',
    top: '10%',
    zIndex: -1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  textSection: {
    alignItems: 'center',
    gap: 8,
  },
  successLabel: {
    ...Typography.labelSm,
    color: Colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontSize: 12,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  currencySymbol: {
    ...Typography.headlineXl,
    fontSize: 32,
    color: Colors.text,
    fontWeight: '300',
  },
  amountText: {
    color: Colors.text,
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: -2,
    lineHeight: 84,
    textAlign: 'center',
  },
  merchantLabel: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  detailCard: {
    marginTop: 16,
    padding: 24,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    width: '100%',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  detailRow: {
    gap: 4,
  },
  detailTitle: {
    ...Typography.labelSm,
    color: Colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 11,
    marginBottom: 4,
  },
  hashContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  detailHash: {
    ...Typography.bodyMd,
    color: Colors.text,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderSoft,
  },
  solValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  solValueText: {
    ...Typography.titleMd,
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  returnBtn: {
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  returnBtnText: {
    ...Typography.titleMd,
    color: Colors.bg,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
