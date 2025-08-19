import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { Salon, Hairdresser } from '@/types';
import { getResponsiveSpacing, getResponsiveBorderRadius } from '@/constants/Breakpoints';
import { RatingStars } from './RatingStars';
import { ResponsiveText } from './ResponsiveText';

interface ProviderCardProps {
  provider: Salon | Hairdresser;
  onPress: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  const { colors } = useColorScheme();
  const { screenSize, isTablet, isSmallDevice } = useDeviceDimensions();
  
  const isHairdresser = provider.type === 'hairdresser';
  const displayName = isHairdresser ? provider.name : (provider as Salon).businessName;
  
  const cardPadding = getResponsiveSpacing('md', screenSize);
  const cardBorderRadius = getResponsiveBorderRadius('lg', screenSize);
  const avatarSize = isTablet ? 70 : isSmallDevice ? 50 : 60;
  const iconSize = isTablet ? 18 : isSmallDevice ? 14 : 16;
  const headerMargin = getResponsiveSpacing('sm', screenSize);
  const infoRowMargin = getResponsiveSpacing('xs', screenSize);
  const infoTextMargin = getResponsiveSpacing('xs', screenSize);
  const specializationMargin = getResponsiveSpacing('xs', screenSize);
  const specializationPadding = getResponsiveSpacing('xs', screenSize);
  const specializationBorderRadius = getResponsiveBorderRadius('sm', screenSize);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: cardBorderRadius,
      padding: cardPadding,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: headerMargin,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
    },
    headerInfo: {
      flex: 1,
      marginLeft: headerMargin,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: infoRowMargin,
    },
    badge: {
      backgroundColor: colors.primary600,
      paddingHorizontal: specializationPadding,
      paddingVertical: specializationPadding / 2,
      borderRadius: specializationBorderRadius,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: infoRowMargin,
    },
    infoText: {
      marginLeft: infoTextMargin,
    },
    specializations: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: specializationMargin,
    },
    specializationTag: {
      backgroundColor: colors.primary50,
      paddingHorizontal: specializationPadding,
      paddingVertical: specializationPadding / 2,
      borderRadius: specializationBorderRadius,
      marginRight: specializationPadding,
      marginBottom: specializationPadding / 2,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <ResponsiveText size="lg" weight="semibold" style={{ marginBottom: 4 }}>
            {displayName}
          </ResponsiveText>
          {isHairdresser && (
            <ResponsiveText size="sm" color={colors.textSecondary} style={{ marginBottom: 4 }}>
              {provider.experienceYears} years experience
            </ResponsiveText>
          )}
          <View style={styles.ratingContainer}>
            <RatingStars rating={provider.rating} size={iconSize} />
            <ResponsiveText 
              size="sm" 
              color={colors.textSecondary} 
              style={{ marginLeft: infoTextMargin }}
            >
              {provider.rating} ({provider.reviewCount})
            </ResponsiveText>
          </View>
        </View>
        {(provider as Salon).isPremium && (
          <View style={styles.badge}>
            <ResponsiveText size="xs" weight="medium" color="#FFFFFF">
              PREMIUM
            </ResponsiveText>
          </View>
        )}
      </View>

      <View style={styles.infoRow}>
        <MapPin size={iconSize} color={colors.textSecondary} />
        <ResponsiveText size="sm" color={colors.textSecondary} style={styles.infoText}>
          {provider.location?.address}
          {provider.distance && ` • ${provider.distance}`}
        </ResponsiveText>
      </View>

      <View style={styles.infoRow}>
        <Clock size={iconSize} color={colors.textSecondary} />
        <ResponsiveText size="sm" color={colors.textSecondary} style={styles.infoText}>
          Open today 9:00 AM - 7:00 PM
        </ResponsiveText>
      </View>

      {isHairdresser && provider.specializations.length > 0 && (
        <View style={styles.specializations}>
          {provider.specializations.slice(0, 3).map((spec, index) => (
            <View key={index} style={styles.specializationTag}>
              <ResponsiveText size="xs" weight="medium" color={colors.primary700}>
                {spec}
              </ResponsiveText>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}