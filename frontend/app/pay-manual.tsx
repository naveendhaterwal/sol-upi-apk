import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radii } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PayManualScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');

  const handleContinue = () => {
    if (!upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@bank)');
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    router.push({
      pathname: '/pay-entry',
      params: {
        pa: upiId,
        pn: 'Manual Entry',
        am: amount,
      },
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Pay via UPI ID</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Receiver UPI ID</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="at" size={20} color={Colors.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="e.g. name@bank"
              placeholderTextColor={Colors.textFaint}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Amount (INR)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.textFaint}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.button,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
            (!upiId || !amount) && styles.buttonDisabled
          ]}
          disabled={!upiId || !amount}
        >
          <Text style={styles.buttonText}>Continue to Pay</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    padding: Spacing.containerMargin,
    gap: Spacing.stackLg,
  },
  inputSection: {
    gap: Spacing.stackSm,
  },
  label: {
    ...Typography.labelSm,
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.stackMd,
    height: 60,
    gap: Spacing.stackSm,
  },
  input: {
    flex: 1,
    ...Typography.bodyLg,
    color: Colors.text,
    height: '100%',
  },
  currencySymbol: {
    ...Typography.bodyLg,
    color: Colors.textMuted,
  },
  button: {
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.stackLg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...Typography.titleMd,
    color: Colors.surface,
  },
});
