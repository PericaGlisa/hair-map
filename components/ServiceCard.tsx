import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, DollarSign } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Service } from '@/types';
import { Fonts } from '@/constants/Fonts';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const { colors } = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
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
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    name: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      flex: 1,
    },
    price: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.bold,
      color: colors.primary600,
    },
    description: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.sm,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    duration: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    durationText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>${service.price}</Text>
      </View>
      
      {service.description && (
        <Text style={styles.description}>{service.description}</Text>
      )}
      
      <View style={styles.footer}>
        <View style={styles.duration}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={styles.durationText}>{service.duration} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}