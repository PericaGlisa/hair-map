import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Calendar, Clock } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockAppointments, mockHairdressers, mockSalons } from '@/data/mockData';
import { AppointmentCard } from '@/components/AppointmentCard';
import { CustomButton } from '@/components/CustomButton';

export default function AppointmentsScreen() {
  const { colors } = useColorScheme();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  const getProviderInfo = (providerId: string, providerType: 'salon' | 'hairdresser') => {
    if (providerType === 'salon') {
      const salon = mockSalons.find(s => s.id === providerId);
      return { name: salon?.businessName || 'Unknown Salon', avatar: salon?.avatar };
    } else {
      const hairdresser = mockHairdressers.find(h => h.id === providerId);
      return { name: hairdresser?.name || 'Unknown Hairdresser', avatar: hairdresser?.avatar };
    }
  };

  const upcomingAppointments = mockAppointments.filter(
    apt => apt.status === 'confirmed' || apt.status === 'pending'
  );

  const pastAppointments = mockAppointments.filter(
    apt => apt.status === 'completed' || apt.status === 'cancelled'
  );

  const currentAppointments = selectedTab === 'upcoming' ? upcomingAppointments : pastAppointments;

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
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: Fonts.sizes['3xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary600,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.background,
    },
    tabText: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.medium,
    },
    tabTextActive: {
      color: colors.text,
    },
    tabTextInactive: {
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: Fonts.sizes.xl,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.base,
      marginBottom: 24,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.background,
      marginHorizontal: -20,
      marginTop: -20,
      marginBottom: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: Fonts.sizes.xl,
      fontWeight: Fonts.weights.bold,
      color: colors.primary600,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
    },
  });

  const handleAppointmentPress = (appointmentId: string) => {
    console.log('Appointment selected:', appointmentId);
  };

  const handleMessagePress = (appointmentId: string) => {
    console.log('Message appointment:', appointmentId);
  };

  const handleBookAppointment = () => {
    console.log('Book new appointment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Appointments</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'upcoming' && styles.tabActive]}
            onPress={() => setSelectedTab('upcoming')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'upcoming' ? styles.tabTextActive : styles.tabTextInactive
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'past' && styles.tabActive]}
            onPress={() => setSelectedTab('past')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'past' ? styles.tabTextActive : styles.tabTextInactive
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === 'upcoming' && upcomingAppointments.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{upcomingAppointments.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Loyalty Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avg Rating Given</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={64} color={colors.textLight} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>
              {selectedTab === 'upcoming' ? 'No upcoming appointments' : 'No appointment history'}
            </Text>
            <Text style={styles.emptyDescription}>
              {selectedTab === 'upcoming' 
                ? 'Book your first appointment with one of our amazing stylists!' 
                : 'Your completed appointments will appear here.'
              }
            </Text>
            {selectedTab === 'upcoming' && (
              <CustomButton
                title="Book Appointment"
                onPress={handleBookAppointment}
                variant="primary"
                size="lg"
              />
            )}
          </View>
        ) : (
          currentAppointments.map((appointment) => {
            const providerInfo = getProviderInfo(appointment.providerId, appointment.providerType);
            return (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                providerName={providerInfo.name}
                providerAvatar={providerInfo.avatar}
                onPress={() => handleAppointmentPress(appointment.id)}
                onMessage={() => handleMessagePress(appointment.id)}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}