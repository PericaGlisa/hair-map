import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { Search, Filter, MapPin, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { mockSalons, mockHairdressers } from '@/data/mockData';
import { ProviderCard } from '@/components/ProviderCard';
import { CustomButton } from '@/components/CustomButton';
import { Salon, Hairdresser } from '@/types';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { getResponsiveSpacing, getResponsiveBorderRadius } from '@/constants/Breakpoints';
import { ResponsiveText } from '@/components/ResponsiveText';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';

import MapViewComponent from '@/components/MapView';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const { colors } = useColorScheme();
  const { screenSize, isTablet, isSmallDevice } = useDeviceDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'salons' | 'hairdressers'>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');

  const allProviders = [...mockSalons, ...mockHairdressers];
  
  const filteredProviders = allProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider.type === 'salon' && (provider as any).businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'salons' && provider.type === 'salon') ||
      (selectedFilter === 'hairdressers' && provider.type === 'hairdresser');
    
    return matchesSearch && matchesFilter;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: isSmallDevice ? 50 : 60,
      paddingHorizontal: getResponsiveSpacing('lg', screenSize),
      paddingBottom: getResponsiveSpacing('lg', screenSize),
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: getResponsiveBorderRadius('md', screenSize),
      paddingHorizontal: getResponsiveSpacing('md', screenSize),
      paddingVertical: getResponsiveSpacing('sm', screenSize),
      marginBottom: getResponsiveSpacing('md', screenSize),
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      marginLeft: getResponsiveSpacing('sm', screenSize),
    },
    filtersContainer: {
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: isTablet ? 'center' : 'stretch',
      gap: isTablet ? 0 : getResponsiveSpacing('sm', screenSize),
    },
    filterButtons: {
      flexDirection: 'row',
      flex: isTablet ? 1 : 0,
      flexWrap: 'wrap',
    },
    filterButton: {
      paddingHorizontal: getResponsiveSpacing('md', screenSize),
      paddingVertical: getResponsiveSpacing('sm', screenSize),
      borderRadius: 12,
      marginRight: getResponsiveSpacing('xs', screenSize),
      marginBottom: isTablet ? 0 : getResponsiveSpacing('xs', screenSize),
      borderWidth: 1,
    },
    filterButtonActive: {
      backgroundColor: colors.primary600,
      borderColor: colors.primary600,
    },
    filterButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: colors.primary600,
    },
    viewModeContainer: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: getResponsiveBorderRadius('sm', screenSize),
      padding: isSmallDevice ? 3 : getResponsiveSpacing('xs', screenSize),
      alignSelf: 'flex-start',
    },
    viewModeButton: {
      paddingHorizontal: getResponsiveSpacing('sm', screenSize),
      paddingVertical: getResponsiveSpacing('xs', screenSize) / 2,
      borderRadius: getResponsiveBorderRadius('xs', screenSize),
    },
    viewModeButtonActive: {
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundTertiary,
      margin: getResponsiveSpacing('lg', screenSize),
      borderRadius: getResponsiveBorderRadius('lg', screenSize),
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: getResponsiveSpacing('md', screenSize),
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveSpacing('sm', screenSize),
      paddingVertical: getResponsiveSpacing('xs', screenSize),
      borderRadius: getResponsiveBorderRadius('sm', screenSize),
      backgroundColor: colors.backgroundSecondary,
    },

  });

  const router = useRouter();

  const handleProviderPress = (provider: Salon | Hairdresser) => {
    router.push(`/provider/${provider.id}`);
  };

  const filteredSalons = mockSalons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salon.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || selectedFilter === 'salons';
    return matchesSearch && matchesFilter;
  });

  const filteredHairdressers = mockHairdressers.filter(hairdresser => {
    const matchesSearch = hairdresser.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || selectedFilter === 'hairdressers';
    return matchesSearch && matchesFilter;
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <ResponsiveText size="3xl" weight="bold" style={{ marginBottom: getResponsiveSpacing('md', screenSize) }}>
        Find Your Stylist
      </ResponsiveText>
      
      <View style={styles.searchContainer}>
        <Search size={isSmallDevice ? 18 : 20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons or hairdressers..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filterButtons}>
          {(['all', 'salons', 'hairdressers'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter ? styles.filterButtonActive : styles.filterButtonInactive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <ResponsiveText 
                size="sm" 
                weight="semibold"
                color={selectedFilter === filter ? '#FFFFFF' : colors.primary600}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </ResponsiveText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.viewModeContainer}>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <ResponsiveText 
              size="sm" 
              weight="medium"
              color={viewMode === 'list' ? colors.text : colors.textSecondary}
            >
              List
            </ResponsiveText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'map' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <ResponsiveText 
              size="sm" 
              weight="medium"
              color={viewMode === 'map' ? colors.text : colors.textSecondary}
            >
              Map
            </ResponsiveText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <ResponsiveText size="base" weight="medium">
          {filteredProviders.length} {filteredProviders.length === 1 ? 'result' : 'results'}
        </ResponsiveText>
        <TouchableOpacity style={styles.sortButton}>
          <Filter size={isSmallDevice ? 14 : 16} color={colors.textSecondary} />
          <ResponsiveText 
            size="sm" 
            color={colors.textSecondary} 
            style={{ marginLeft: getResponsiveSpacing('xs', screenSize) }}
          >
            Sort by distance
          </ResponsiveText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 'map' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderHeader()}
          <MapViewComponent
            salons={filteredSalons}
            hairdressers={filteredHairdressers}
            onProviderSelect={handleProviderPress}
            showSalons={selectedFilter === 'all' || selectedFilter === 'salons'}
            showHairdressers={selectedFilter === 'all' || selectedFilter === 'hairdressers'}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredProviders}
          renderItem={({ item: provider }) => (
            <ProviderCard
              provider={provider}
              onPress={() => handleProviderPress(provider)}
            />
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          windowSize={10}
          initialNumToRender={6}
          getItemLayout={(data, index) => ({
            length: 180, // Approximate height of ProviderCard
            offset: 180 * index,
            index,
          })}
          contentContainerStyle={{ paddingBottom: getResponsiveSpacing('lg', screenSize) }}
          style={styles.content}
        />
      )}
    </SafeAreaView>
  );
}