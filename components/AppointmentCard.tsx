import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Appointment } from '@/types';
import { Fonts } from '@/constants/Fonts';
import { CustomButton } from './CustomButton';

interface AppointmentCardProps {
  appointment: Appointment;
  providerName: string;
  providerAvatar?: string;
  onPress: () => void;
  onMessage?: () => void;
}

export function AppointmentCard({ 
  appointment, 
  providerName, 
  providerAvatar,
  onPress,
  onMessage 
}: AppointmentCardProps) {
  const { colors } = useColorScheme();

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return colors.success500;
      case 'pending': return colors.warning500;
      case 'completed': return colors.primary600;
      case 'cancelled': return colors.error500;
      default: return colors.gray500;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'in-progress': return 'In Progress';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { date, time } = formatDate(appointment.datetime);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    headerInfo: {
      flex: 1,
    },
    providerName: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 4,
    },
    statusContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: Fonts.sizes.xs,
      fontWeight: Fonts.weights.medium,
      color: '#FFFFFF',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    price: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.bold,
      color: colors.text,
      textAlign: 'right',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    messageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.backgroundSecondary,
    },
    messageText: {
      fontSize: Fonts.sizes.sm,
      color: colors.primary600,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image source={{ uri: providerAvatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.providerName}>{providerName}</Text>
          <View style={[styles.statusContainer, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>
        <Text style={styles.price}>${appointment.price}</Text>
      </View>

      <View style={styles.infoRow}>
        <Calendar size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{date}</Text>
      </View>

      <View style={styles.infoRow}>
        <Clock size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{time}</Text>
      </View>

      {appointment.notes && (
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { marginLeft: 0, fontStyle: 'italic' }]}>
            "{appointment.notes}"
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        {onMessage && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <TouchableOpacity style={styles.messageButton} onPress={onMessage}>
            <MessageCircle size={16} color={colors.primary600} />
            <Text style={styles.messageText}>Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}