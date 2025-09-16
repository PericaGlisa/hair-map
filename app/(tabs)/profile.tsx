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
  ScanLine, 
  CreditCard,
  Bell,
  Globe,
  ChevronRight,
  LogOut,
  Calendar,
  Clock,
  Percent
} from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockCustomer } from '@/data/mockData';
import { CustomButton } from '@/components/CustomButton';

export default function ProfileScreen() {
  const { colors } = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Mock appointment history data
  const appointmentHistory = [
    { id: 1, salon: 'Salon Elegance', service: 'Cut and Blow-dry', date: '15.01.2025', time: '14:00', price: '$35' },
    { id: 2, salon: 'Beauty Studio', service: 'Hair Coloring', date: '08.01.2025', time: '10:30', price: '$80' },
    { id: 3, salon: 'Hair & Style', service: 'Highlights', date: '22.12.2024', time: '16:00', price: '$120' },
  ];

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
    discountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.success50,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 16,
    },
    discountText: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.medium,
      color: colors.success700,
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
    scanSection: {
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    scanTitle: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 8,
    },
    scanDescription: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
    },
    scanButton: {
      width: 120,
      height: 120,
      backgroundColor: colors.primary,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    historyItem: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    historySalon: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
    },
    historyPrice: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.primary,
    },
    historyService: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    historyDateTime: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    historyDateTimeText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginLeft: 4,
      marginRight: 12,
    },
  });

  const handleMenuItemPress = (item: string) => {
    console.log('Menu item pressed:', item);
  };

  const handleScanPress = () => {
    console.log('Scan QR code pressed');
    // Here the camera would open for QR code scanning
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: mockCustomer.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{mockCustomer.name}</Text>
        <Text style={styles.email}>{mockCustomer.email}</Text>
        
        <View style={styles.discountContainer}>
          <Percent size={20} color={colors.success600} />
          <Text style={styles.discountText}>
            50% discount - 10 points
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scan Section */}
        <View style={styles.scanSection}>
          <Text style={styles.scanTitle}>Scan QR Code</Text>
          <Text style={styles.scanDescription}>
            Scan salon QR code for faster appointment booking and discounts
          </Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
            <ScanLine size={48} color={colors.background} />
          </TouchableOpacity>
          <CustomButton
            title="Open Scanner"
            onPress={handleScanPress}
            variant="outline"
            size="sm"
          />
        </View>

        {/* Appointment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment History</Text>
          
          {appointmentHistory.map((appointment) => (
            <View key={appointment.id} style={[styles.menuItem, appointment.id === 1 && styles.menuItemFirst]}>
              <View style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historySalon}>{appointment.salon}</Text>
                  <Text style={styles.historyPrice}>{appointment.price}</Text>
                </View>
                <Text style={styles.historyService}>{appointment.service}</Text>
                <View style={styles.historyDateTime}>
                  <Calendar size={14} color={colors.textSecondary} />
                  <Text style={styles.historyDateTimeText}>{appointment.date}</Text>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={styles.historyDateTimeText}>{appointment.time}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handleMenuItemPress('view-all-history')}
          >
            <View style={styles.menuItemContent}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>View all appointments</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Settings</Text>
          
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
              <Text style={[styles.menuItemText, { color: colors.error500 }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}