import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

export function PaymentScreenHeader({
  title,
  onBack,
  rightIcon = 'heart-outline',
}: {
  title?: string;
  onBack: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onBack} style={{ width: 28, alignItems: 'flex-start' }}>
        <Ionicons color={Colors.primary} name="arrow-back" size={24} />
      </Pressable>
      {title ? (
        <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '600', letterSpacing: 0.4 }}>
          {title}
        </Text>
      ) : (
        <View />
      )}
      <View style={{ width: 28, alignItems: 'flex-end' }}>
        <Ionicons color="rgba(255,255,255,0.7)" name={rightIcon} size={22} />
      </View>
    </View>
  );
}

export function PaymentInfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16 }}>
      <Text style={{ color: Colors.textFaint, fontSize: 14 }}>{label}</Text>
      <Text
        selectable
        style={{ color: valueColor || Colors.text, fontSize: 15, fontWeight: '600', textAlign: 'right', flexShrink: 1 }}
      >
        {value}
      </Text>
    </View>
  );
}

export function PaymentPrimaryButton({
  label,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        height: 54,
        borderRadius: 14,
        backgroundColor: disabled ? 'rgba(0, 244, 200, 0.4)' : Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: Colors.bg, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }}>
        {loading ? 'Processing...' : label}
      </Text>
    </Pressable>
  );
}

export function ReceiptDetailCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        width: '100%',
        borderRadius: 24,
        backgroundColor: Colors.surfaceSoft,
        padding: 22,
        gap: 14,
        borderWidth: 1,
        borderColor: Colors.borderSoft,
      }}
    >
      {children}
    </View>
  );
}
