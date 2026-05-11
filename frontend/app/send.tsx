import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useWalletStore } from '../store/useWalletStore';
import { useRecordPayment } from '../services/queries';

export default function SendScreen() {
  const router = useRouter();
  const { userId, balance } = useWalletStore();
  const { mutate: sendSol, isPending } = useRecordPayment();

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    if (!userId) return;
    const numAmount = parseFloat(amount);
    if (!address || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid', 'Please enter a valid address and amount.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Insufficient Funds', 'You do not have enough SOL.');
      return;
    }

    sendSol(
      {
        userId,
        to_address: address,
        amount_inr: numAmount * 84.5, // Dummy conversion for history
        amount_crypto: numAmount,
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Transaction sent!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        },
        onError: (e: any) => {
          Alert.alert('Error', e.message || 'Failed to send transaction.');
        }
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, padding: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 40 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="arrow-back" size={28} color={Colors.text} />
        </Pressable>
        <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '700', letterSpacing: 2 }}>SEND SOL</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ gap: 32 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.textFaint, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Recipient Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Solana Address"
            placeholderTextColor={Colors.border}
            style={{
              color: Colors.text,
              fontSize: 16,
              borderBottomWidth: 1,
              borderColor: Colors.border,
              paddingVertical: 12,
              fontFamily: 'monospace',
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.textFaint, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Amount (SOL)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={Colors.border}
            keyboardType="decimal-pad"
            style={{
              color: Colors.text,
              fontSize: 48,
              fontWeight: '300',
              borderBottomWidth: 1,
              borderColor: Colors.border,
              paddingVertical: 12,
            }}
          />
          <Text style={{ color: Colors.textMuted, fontSize: 12, textAlign: 'right' }}>
            Available: {balance.toFixed(4)} SOL
          </Text>
        </View>

        <Pressable
          onPress={handleSend}
          disabled={isPending}
          style={{
            height: 64,
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
          }}
        >
          {isPending ? (
            <ActivityIndicator color={Colors.bg} />
          ) : (
            <Text style={{ color: Colors.bg, fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 }}>
              Swipe to Send
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
