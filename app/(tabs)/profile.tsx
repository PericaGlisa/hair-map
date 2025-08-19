import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Award, 
  Settings, 
  QrCode, 
  CreditCard,
  Bell,
  Globe,
  ChevronRight,
  LogOut
} from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockCustomer } from '@/data/mockData';
import { CustomButton } from '@/components/CustomButton';

export default function ProfileScreen() {
  const { colors } = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: Fonts.sizes['2xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
      marginBottom: 8,
    },
    email: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    loyaltyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary50,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 16,
    },
    loyaltyText: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.medium,
      color: colors.primary700,
      marginLeft: 8,
    },
    section: {
      backgroundColor: colors.background,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      padding: 20,
      paddingBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    menuItemFirst: {
      borderTopWidth: 0,
    },
    menuItemContent: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: Fonts.sizes.base,
      color: colors.text,
      marginLeft: 12,
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemValue: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginRight: 8,
    },
    content: {
      padding: 20,
    },
    qrSection: {
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    qrTitle: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 8,
    },
    qrDescription: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
    },
    qrPlaceholder: {
      width: 150,
      height: 150,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
  });

  const handleMenuItemPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: mockCustomer.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{mockCustomer.name}</Text>
        <Text style={styles.email}>{mockCustomer.email}</Text>
        
        <View style={styles.loyaltyContainer}>
          <Award size={20} color={colors.primary600} />
          <Text style={styles.loyaltyText}>
            {mockCustomer.loyaltyPoints} Loyalty Points
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Your QR Code</Text>
          <Text style={styles.qrDescription}>
            Show this QR code at any salon to quickly connect and earn loyalty points
          </Text>
          <View style={styles.qrPlaceholder}>
            <QrCode size={48} color={colors.textSecondary} />
          </View>
          <CustomButton
            title="Generate QR Code"
            onPress={() => handleMenuItemPress('generate-qr')}
            variant="outline"
            size="sm"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemFirst]} 
            onPress={() => handleMenuItemPress('edit-profile')}
          >
            <View style={styles.menuItemContent}>
              <User size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItemPress('payment-methods')}
          >
            <View style={styles.menuItemContent}>
              <CreditCard size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.gray300, true: colors.primary200 }}
              thumbColor={notificationsEnabled ? colors.primary600 : colors.gray400}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemFirst]} 
            onPress={() => handleMenuItemPress('language')}
          >
            <View style={styles.menuItemContent}>
              <Globe size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>English</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItemPress('location')}
          >
            <View style={styles.menuItemContent}>
              <MapPin size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Location Services</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>Enabled</Text>
              <ChevronRight size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemFirst]} 
            onPress={() => handleMenuItemPress('help')}
          >
            <View style={styles.menuItemContent}>
              <Settings size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItemPress('logout')}
          >
            <View style={styles.menuItemContent}>
              <LogOut size={20} color={colors.error500} />
              <Text style={[styles.menuItemText, { color: colors.error500 }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}