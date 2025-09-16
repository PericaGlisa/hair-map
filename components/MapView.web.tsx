import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
      <View style={styles.mapView}>
        {/* Fake map background with grid */}
        <View style={styles.mapBackground}>
          {/* Grid lines */}
          {[...Array(8)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLine, styles.horizontalLine, { top: `${i * 12.5}%` }]} />
          ))}
          {[...Array(6)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLine, styles.verticalLine, { left: `${i * 16.67}%` }]} />
          ))}
          
          {/* Streets */}
          <View style={[styles.street, styles.mainStreet, { top: '30%', left: 0, right: 0 }]} />
          <View style={[styles.street, styles.mainStreet, { top: '70%', left: 0, right: 0 }]} />
          <View style={[styles.street, styles.sideStreet, { left: '25%', top: 0, bottom: 0 }]} />
          <View style={[styles.street, styles.sideStreet, { left: '60%', top: 0, bottom: 0 }]} />
          
          {/* Salon markers */}
          {showSalons && salons.map((salon, index) => (
            <TouchableOpacity
              key={salon.id}
              style={[
                styles.salonMarker,
                {
                  left: `${15 + (index % 4) * 20}%`,
                  top: `${20 + Math.floor(index / 4) * 25}%`,
                }
              ]}
              onPress={() => onProviderSelect(salon)}
            >
              <View style={styles.markerPin}>
                <Text style={styles.markerIcon}>💇</Text>
              </View>
              <View style={styles.markerInfo}>
                <Text style={styles.markerName}>{salon.businessName}</Text>
                <Text style={styles.markerRating}>⭐ {salon.rating}</Text>
                <Text style={styles.markerSlots}>{salon.availableSlots?.length || 0} slots</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Hairdresser markers */}
          {showHairdressers && hairdressers.map((hairdresser, index) => (
            <TouchableOpacity
              key={hairdresser.id}
              style={[
                styles.hairdresserMarker,
                {
                  left: `${20 + (index % 3) * 25}%`,
                  top: `${25 + Math.floor(index / 3) * 30}%`,
                }
              ]}
              onPress={() => onProviderSelect(hairdresser)}
            >
              <View style={styles.markerPin}>
                <Text style={styles.markerIcon}>✂️</Text>
              </View>
              <View style={styles.markerInfo}>
                <Text style={styles.markerName}>{hairdresser.name}</Text>
                <Text style={styles.markerRating}>⭐ {hairdresser.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Map legend */}
        <View style={styles.mapLegend}>
          <Text style={styles.legendTitle}>Hair Map</Text>
          <View style={styles.legendItems}>
            {showSalons && (
              <View style={styles.legendItem}>
                <Text style={styles.legendIcon}>💇</Text>
                <Text style={styles.legendText}>{salons.length} Salons</Text>
              </View>
            )}
            {showHairdressers && (
              <View style={styles.legendItem}>
                <Text style={styles.legendIcon}>✂️</Text>
                <Text style={styles.legendText}>{hairdressers.length} Hairdressers</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  mapView: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f0f8f0',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e0e8e0',
  },
  horizontalLine: {
    height: 1,
    left: 0,
    right: 0,
  },
  verticalLine: {
    width: 1,
    top: 0,
    bottom: 0,
  },
  street: {
    position: 'absolute',
    backgroundColor: '#d0d8d0',
  },
  mainStreet: {
    height: 8,
  },
  sideStreet: {
    width: 6,
  },
  salonMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  hairdresserMarker: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  markerPin: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 20,
  },
  markerInfo: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  markerRating: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  markerSlots: {
    fontSize: 10,
    color: Colors.light.primary,
    marginTop: 1,
  },
  mapLegend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'column',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});

export default MapViewComponent;