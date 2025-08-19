import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Salon, Hairdresser } from '../types';
import { Colors } from '../constants/Colors';

interface MapViewComponentProps {
  salons: Salon[];
  hairdressers: Hairdresser[];
  onProviderSelect: (provider: Salon | Hairdresser) => void;
  showSalons: boolean;
  showHairdressers: boolean;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  salons,
  hairdressers,
  onProviderSelect,
  showSalons,
  showHairdressers,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.webMapPlaceholder}>
        <Text style={styles.webMapText}>Map View</Text>
        <Text style={styles.webMapSubtext}>Interactive map is available on mobile devices</Text>
        <Text style={styles.webMapInfo}>
          {showSalons && `${salons.length} salons`}
          {showSalons && showHairdressers && ' • '}
          {showHairdressers && `${hairdressers.length} hairdressers`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.neutral100,
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  webMapText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  webMapInfo: {
    fontSize: 14,
    color: Colors.light.primary600,
    fontWeight: '500',
  },
});

export default MapViewComponent;