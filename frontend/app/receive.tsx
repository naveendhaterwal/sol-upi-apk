import React from 'react';
import { Clipboard, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useWalletStore } from '../store/useWalletStore';

export default function ReceiveScreen() {
  const router = useRouter();
  const { publicKey } = useWalletStore();

  const handleCopy = () => {
    if (publicKey) Clipboard.setString(publicKey);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg, padding: 32 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Ionicons name="close" size={28} color={Colors.text} />
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 40 }}>
        <Text style={{ color: Colors.textFaint, fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>
          Your Solana Address
        </Text>

        {/* Dummy QR Code Square for aesthetics */}
        <View style={{ width: 240, height: 240, backgroundColor: Colors.surfaceSoft, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="qr-code-outline" size={80} color={Colors.textMuted} />
          <Text style={{ color: Colors.textFaint, fontSize: 10, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1 }}>QR Code Placeholder</Text>
        </View>

        <Pressable onPress={handleCopy} style={{ alignItems: 'center', gap: 12 }}>
          <Text style={{ color: Colors.text, fontSize: 13, fontFamily: 'monospace', textAlign: 'center', paddingHorizontal: 20 }}>
            {publicKey || 'Loading...'}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="copy-outline" size={14} color={Colors.primary} />
            <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>Copy Address</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
