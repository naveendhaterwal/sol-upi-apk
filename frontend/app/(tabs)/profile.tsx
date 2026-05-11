import React from 'react';
import { Alert, Clipboard, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useAirdrop, usePrice } from '../../services/queries';
import { api } from '../../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { userId, publicKey, balance, isLoading, refreshBalance, logout } = useWalletStore();
  const { mutate: requestAirdrop, isPending: airdropping } = useAirdrop();
  const { data: priceData } = usePrice();
  
  const inrRate = priceData?.sol_inr || 14000;
  const portfolioBalance = `₹${((balance || 0) * inrRate).toFixed(2)}`;

  const handleCopy = () => {
    if (!publicKey) return;
    Clipboard.setString(publicKey);
    Alert.alert('Copied', 'Address copied to clipboard.');
  };

  const handleExportKey = async () => {
    if (!userId) return;
    try {
      const data = await api.getBackup(userId);
      Alert.alert(
        'Private Key (Base58)', 
        `${data.private_key_b58}\n\n${data.message}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Copy Key', onPress: () => {
            Clipboard.setString(data.private_key_b58);
            Alert.alert('Copied', 'Private key copied to clipboard. Do not share this with anyone!');
          }}
        ]
      );
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to get backup from backend.');
    }
  };

  const handleViewPhrase = async () => {
    if (!userId) return;
    try {
      const data = await api.getBackup(userId);
      Alert.alert('Recovery Phrase', data.message);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to get backup from backend.');
    }
  };

  const handleAirdrop = () => {
    if (!userId) return;
    requestAirdrop({ userId, amount_sol: 1 }, {
      onSuccess: () => {
        Alert.alert('Success', '1 SOL requested. Updating balance...');
        // Auto refresh after short delays to allow devnet to process the transaction
        setTimeout(() => refreshBalance(), 2000);
        setTimeout(() => refreshBalance(), 5000);
      },
      onError: () => {
        Alert.alert('Error', 'Airdrop failed. Devnet faucet might be rate-limited.');
      }
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'This will remove your session from this device. (Devnet Demo)',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/wallet-setup');
          },
        },
      ]
    );
  };

  const ActionRow = ({ icon, label, value, onPress, danger }: any) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: Colors.borderSoft,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Ionicons name={icon} size={20} color={danger ? Colors.danger : Colors.textMuted} />
        <Text style={{ color: danger ? Colors.danger : Colors.text, fontSize: 15, fontWeight: '500' }}>
          {label}
        </Text>
      </View>
      {value ? (
        <Text style={{ color: Colors.textMuted, fontSize: 14 }}>{value}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={Colors.border} />
      )}
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 60, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshBalance} tintColor={Colors.primary} />}
    >
      <View style={{ gap: 40 }}>
        
        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.textFaint, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
            Account Profile
          </Text>
          <Text style={{ color: Colors.text, fontSize: 32, fontWeight: '300', letterSpacing: -1 }}>
            Settings
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            Wallet Address
          </Text>
          <Pressable onPress={handleCopy} style={{ backgroundColor: Colors.surfaceSoft, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radii.md }}>
            <Text 
              style={{ color: Colors.text, fontSize: 13, fontFamily: 'monospace', flex: 1, marginRight: 8 }}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {publicKey || 'Not connected'}
            </Text>
            <Ionicons name="copy-outline" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            Wallet Balance
          </Text>
          <View style={{ backgroundColor: Colors.surfaceSoft, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: Radii.md }}>
            <Text style={{ color: Colors.text, fontSize: 18, fontWeight: '600' }}>
              {(balance || 0).toFixed(4)} SOL
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 14 }}>
              ≈ {portfolioBalance}
            </Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            Security & Backup
          </Text>
          <View style={{ backgroundColor: Colors.surface, borderRadius: Radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border }}>
            <ActionRow 
              icon="key-outline" 
              label="View Recovery Phrase" 
              onPress={handleViewPhrase} 
            />
            <ActionRow 
              icon="lock-closed-outline" 
              label="Export Private Key" 
              onPress={handleExportKey} 
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: Colors.primary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            General
          </Text>
          <View style={{ backgroundColor: Colors.surface, borderRadius: Radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border }}>
            <ActionRow icon="water-outline" label="Request Devnet Airdrop" onPress={handleAirdrop} />
            <ActionRow icon="receipt-outline" label="Transaction History" onPress={() => router.push('/(tabs)/activity' as any)} />
            <ActionRow icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
          </View>
        </View>

        <Text style={{ color: Colors.border, fontSize: 10, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2 }}>
          Custodial Wallet Demo
        </Text>

      </View>
    </ScrollView>
  );
}
