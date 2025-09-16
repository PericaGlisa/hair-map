import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput, Dimensions, Platform, Modal, Image } from 'react-native';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockSalons, mockHairdressers, mockReviews } from '@/data/mockData';
import { ProviderCard } from '@/components/ProviderCard';
import { CustomButton } from '@/components/CustomButton';
import { Salon, Hairdresser } from '@/types';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { getResponsiveSpacing, getResponsiveBorderRadius } from '@/constants/Breakpoints';
import { ResponsiveText } from '@/components/ResponsiveText';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

import MapViewComponent from '@/components/MapView';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const { colors } = useColorScheme();
  const { screenSize, isTablet, isSmallDevice } = useDeviceDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleSalonPress = (salon: Salon) => {
    setSelectedSalon(salon);
    setModalVisible(true);
  };

  const getSalonHairdressers = (salonId: string) => {
    return mockHairdressers.filter(hairdresser => hairdresser.salonId === salonId);
  };

  const getHairdresserReviews = (hairdresserId: string) => {
    return mockReviews.filter(review => review.providerId === hairdresserId);
  };

  const handleProviderPress = (provider: Salon | Hairdresser) => {
    router.push(`/provider/${provider.id}`);
  };

  const handleSalonSelect = (salon: Salon) => {
    setSelectedSalon(salon);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.background,
      paddingHorizontal: getResponsiveSpacing('lg', screenSize),
      paddingTop: getResponsiveSpacing('md', screenSize),
      paddingBottom: getResponsiveSpacing('md', screenSize),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    searchSection: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: getResponsiveBorderRadius('md', screenSize),
      paddingHorizontal: getResponsiveSpacing('md', screenSize),
      paddingVertical: getResponsiveSpacing('sm', screenSize),
      marginTop: getResponsiveSpacing('md', screenSize),
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      marginLeft: getResponsiveSpacing('sm', screenSize),
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    salonDetailsCard: {
      position: 'absolute',
      bottom: getResponsiveSpacing('lg', screenSize),
      left: getResponsiveSpacing('lg', screenSize),
      right: getResponsiveSpacing('lg', screenSize),
      backgroundColor: colors.background,
      borderRadius: getResponsiveBorderRadius('lg', screenSize),
      padding: getResponsiveSpacing('lg', screenSize),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    salonHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: getResponsiveSpacing('md', screenSize),
    },
    salonInfo: {
      flex: 1,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: getResponsiveSpacing('xs', screenSize),
    },
    availableSlots: {
      marginTop: getResponsiveSpacing('md', screenSize),
    },
    slotsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: getResponsiveSpacing('sm', screenSize),
    },
    slotChip: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary600,
      borderWidth: 1,
      borderRadius: getResponsiveBorderRadius('sm', screenSize),
      paddingHorizontal: getResponsiveSpacing('sm', screenSize),
      paddingVertical: getResponsiveSpacing('xs', screenSize),
      marginRight: getResponsiveSpacing('xs', screenSize),
      marginBottom: getResponsiveSpacing('xs', screenSize),
      flexDirection: 'row',
      alignItems: 'center',
    },
    hairdressersList: {
      marginTop: getResponsiveSpacing('md', screenSize),
    },
    hairdresserItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: getResponsiveSpacing('sm', screenSize),
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    hairdresserAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary100,
      marginRight: getResponsiveSpacing('md', screenSize),
      justifyContent: 'center',
      alignItems: 'center',
    },
    hairdresserInfo: {
      flex: 1,
    },
    closeButton: {
      padding: getResponsiveSpacing('xs', screenSize),
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 15,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    closeModalButton: {
      padding: 5,
    },
    modalScrollView: {
      flex: 1,
    },
    hairdresserCard: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: colors.border,
    },
    hairdresserHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    hairdresserDetails: {
      flex: 1,
      marginLeft: 15,
    },
    hairdresserName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 5,
    },
    hairdresserSpecialty: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 5,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reviewCount: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 5,
    },
    portfolioSection: {
      marginBottom: 15,
    },
    portfolioItem: {
      marginRight: 15,
      alignItems: 'center',
      width: 80,
    },
    portfolioImage: {
      width: 70,
      height: 70,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    portfolioDescription: {
      fontSize: 10,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    reviewsSection: {
      marginBottom: 15,
    },
    reviewItem: {
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    reviewRating: {
      flexDirection: 'row',
    },
    reviewComment: {
      fontSize: 12,
      color: colors.text,
      lineHeight: 16,
    },
    bookButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    bookButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    avatarText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary,
    },
  });

  const renderSalonDetails = () => {
    if (!selectedSalon) return null;

    // Mock available time slots
    const availableSlots = ['09:00', '10:30', '14:00', '15:30', '17:00'];
    
    // Mock hairdressers for this salon
    const salonHairdressers = mockHairdressers.slice(0, 3);

    return (
      <View style={styles.salonDetailsCard}>
        <View style={styles.salonHeader}>
          <View style={styles.salonInfo}>
            <ResponsiveText size="xl" weight="bold" color={colors.text}>
              {selectedSalon.businessName}
            </ResponsiveText>
            <ResponsiveText size="sm" color={colors.textSecondary}>
              {selectedSalon.address}
            </ResponsiveText>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.accent500} fill={colors.accent500} />
              <ResponsiveText size="sm" weight="medium" style={{ marginLeft: 4 }}>
                {selectedSalon.rating}
              </ResponsiveText>
              <ResponsiveText size="sm" color={colors.textSecondary} style={{ marginLeft: 4 }}>
                ({selectedSalon.reviewCount} reviews)
              </ResponsiveText>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setSelectedSalon(null)}
          >
            <ResponsiveText size="lg" color={colors.textSecondary}>×</ResponsiveText>
          </TouchableOpacity>
        </View>

        <View style={styles.availableSlots}>
          <ResponsiveText size="base" weight="semibold" color={colors.text}>
            Available slots today
          </ResponsiveText>
          <View style={styles.slotsContainer}>
            {availableSlots.map((slot, index) => (
              <TouchableOpacity key={index} style={styles.slotChip}>
                <Clock size={14} color={colors.primary600} />
                <ResponsiveText 
                  size="sm" 
                  weight="medium" 
                  color={colors.primary600}
                  style={{ marginLeft: 4 }}
                >
                  {slot}
                </ResponsiveText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.hairdressersList}>
          <ResponsiveText size="base" weight="semibold" color={colors.text}>
            Hairdressers in salon
          </ResponsiveText>
          {salonHairdressers.map((hairdresser, index) => (
            <TouchableOpacity 
              key={hairdresser.id} 
              style={styles.hairdresserItem}
              onPress={() => handleProviderPress(hairdresser)}
            >
              <View style={styles.hairdresserAvatar}>
                <ResponsiveText size="base" weight="bold" color={colors.primary600}>
                  {hairdresser.name.charAt(0)}
                </ResponsiveText>
              </View>
              <View style={styles.hairdresserInfo}>
                <ResponsiveText size="base" weight="medium" color={colors.text}>
                  {hairdresser.name}
                </ResponsiveText>
                <View style={styles.ratingContainer}>
                  <Star size={14} color={colors.accent500} fill={colors.accent500} />
                  <ResponsiveText size="sm" weight="medium" style={{ marginLeft: 4 }}>
                    {hairdresser.rating}
                  </ResponsiveText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton
          title="Show all hairdressers"
          onPress={() => setModalVisible(true)}
          style={{ marginTop: getResponsiveSpacing('lg', screenSize) }}
        />
      </View>
    );
  };

  const renderHairdresserModal = () => {
    if (!selectedSalon) return null;
    
    const salonHairdressers = getSalonHairdressers(selectedSalon.id);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>
                 Hairdressers at {selectedSalon.businessName}
               </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {salonHairdressers.map((hairdresser) => {
                const reviews = getHairdresserReviews(hairdresser.id);
                return (
                  <View key={hairdresser.id} style={styles.hairdresserCard}>
                    <View style={styles.hairdresserHeader}>
                      <View style={styles.hairdresserAvatar}>
                        <Text style={styles.avatarText}>
                          {hairdresser.name.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.hairdresserDetails}>
                        <Text style={styles.hairdresserName}>{hairdresser.name}</Text>
                        <Text style={styles.hairdresserSpecialty}>
                          {hairdresser.specializations?.join(', ')}
                        </Text>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text style={styles.ratingText}>{hairdresser.rating}</Text>
                           <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
                        </View>
                      </View>
                    </View>

                    {/* Portfolio */}
                     {hairdresser.portfolio && hairdresser.portfolio.length > 0 && (
                       <View style={styles.portfolioSection}>
                         <Text style={styles.sectionTitle}>Portfolio</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {hairdresser.portfolio.map((work, index) => (
                            <View key={index} style={styles.portfolioItem}>
                              <View style={styles.portfolioImage}>
                                <Ionicons name="image" size={40} color={colors.textSecondary} />
                              </View>
                              <Text style={styles.portfolioDescription}>{work.description}</Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    {/* Reviews */}
                     <View style={styles.reviewsSection}>
                       <Text style={styles.sectionTitle}>Reviews</Text>
                      {reviews.slice(0, 3).map((review) => (
                        <View key={review.id} style={styles.reviewItem}>
                          <View style={styles.reviewHeader}>
                            <View style={styles.reviewRating}>
                              {[...Array(5)].map((_, i) => (
                                <Ionicons
                                  key={i}
                                  name="star"
                                  size={12}
                                  color={i < review.rating ? "#FFD700" : "#E0E0E0"}
                                />
                              ))}
                            </View>
                          </View>
                          <Text style={styles.reviewComment}>{review.comment}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity style={styles.bookButton}>
                      <Text style={styles.bookButtonText}>Book Appointment</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hair Map</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons and hairdressers..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent
          salons={mockSalons}
          hairdressers={[]}
          onProviderSelect={handleSalonSelect}
          showSalons={true}
          showHairdressers={false}
        />
        {renderSalonDetails()}
      </View>

      {renderHairdresserModal()}
    </SafeAreaView>
  );
}