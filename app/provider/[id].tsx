import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Award,
  Calendar,
  MessageCircle,
  Heart,
  Share
} from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockSalons, mockHairdressers, mockReviews } from '@/data/mockData';
import { ServiceCard } from '@/components/ServiceCard';
import { RatingStars } from '@/components/RatingStars';
import { CustomButton } from '@/components/CustomButton';

const { width } = Dimensions.get('window');

export default function ProviderDetailsScreen() {
  const { colors } = useColorScheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedTab, setSelectedTab] = useState<'services' | 'reviews' | 'portfolio'>('services');
  const [isFavorited, setIsFavorited] = useState(false);

  // Find provider (could be salon or hairdresser)
  const provider = [...mockSalons, ...mockHairdressers].find(p => p.id === id);

  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Provider not found</Text>
      </SafeAreaView>
    );
  }

  const isHairdresser = provider.type === 'hairdresser';
  const displayName = isHairdresser ? provider.name : (provider as any).businessName;

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
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
    },
    headerActions: {
      flexDirection: 'row',
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    providerHeader: {
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 16,
    },
    providerName: {
      fontSize: Fonts.sizes['2xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    providerSubtitle: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    ratingText: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      marginLeft: 8,
    },
    infoContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
      marginLeft: 12,
      flex: 1,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary600,
    },
    tabText: {
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.medium,
    },
    tabTextActive: {
      color: '#FFFFFF',
    },
    tabTextInactive: {
      color: colors.textSecondary,
    },
    content: {
      padding: 20,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    messageButton: {
      flex: 1,
      marginRight: 12,
    },
    bookButton: {
      flex: 2,
    },
    portfolioGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    portfolioItem: {
      width: (width - 60) / 2,
      height: (width - 60) / 2,
      borderRadius: 12,
      marginBottom: 16,
    },
    specializationsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
    },
    specializationTag: {
      backgroundColor: colors.primary50,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    specializationText: {
      fontSize: Fonts.sizes.sm,
      color: colors.primary700,
      fontWeight: Fonts.weights.medium,
    },
  });

  const handleBookAppointment = () => {
    router.push('/(tabs)/book');
  };

  const handleMessage = () => {
    console.log('Start conversation with', provider.id);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'services':
        return (
          <View>
            {provider.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => console.log('Service selected:', service.id)}
              />
            ))}
          </View>
        );

      case 'portfolio':
        if (isHairdresser && provider.portfolio && provider.portfolio.length > 0) {
          return (
            <View style={styles.portfolioGrid}>
              {provider.portfolio.map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.portfolioItem}
                />
              ))}
            </View>
          );
        }
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No portfolio images available</Text>
          </View>
        );

      case 'reviews':
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Reviews coming soon</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Provider Details</Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsFavorited(!isFavorited)}
            >
              <Heart 
                size={20} 
                color={isFavorited ? colors.error500 : colors.textSecondary}
                fill={isFavorited ? colors.error500 : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.providerHeader}>
          <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          <Text style={styles.providerName}>{displayName}</Text>
          
          {isHairdresser && (
            <Text style={styles.providerSubtitle}>
              {provider.experienceYears} years experience
            </Text>
          )}

          <View style={styles.ratingContainer}>
            <RatingStars rating={provider.rating} size={18} />
            <Text style={styles.ratingText}>
              {provider.rating} ({provider.reviewCount} reviews)
            </Text>
          </View>

          {isHairdresser && provider.specializations && (
            <View style={styles.specializationsContainer}>
              {provider.specializations.map((spec, index) => (
                <View key={index} style={styles.specializationTag}>
                  <Text style={styles.specializationText}>{spec}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{provider.location?.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{provider.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>Open today 9:00 AM - 7:00 PM</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(['services', 'portfolio', 'reviews'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab ? styles.tabTextActive : styles.tabTextInactive
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton
          title="Message"
          onPress={handleMessage}
          variant="outline"
          style={styles.messageButton}
        />
        <CustomButton
          title="Book Appointment"
          onPress={handleBookAppointment}
          variant="primary"
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}