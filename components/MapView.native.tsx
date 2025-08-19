import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Platform, Text } from 'react-native';
import * as Location from 'expo-location';
import { Salon, Hairdresser } from '../types';
import { Colors } from '../constants/Colors';

// Import react-native-maps for native platforms
import MapView, { Marker, Region } from 'react-native-maps';

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
  const [region, setRegion] = useState<Region>({
    latitude: 44.7866, // Belgrade coordinates as default
    longitude: 20.4489,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show nearby providers');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
    } finally {
      setLoading(false);
    }
  };

  const renderProviderMarkers = () => {
    const markers = [];

    if (showSalons) {
      salons.forEach((salon) => {
        markers.push(
          <Marker
            key={`salon-${salon.id}`}
            coordinate={{
              latitude: salon.latitude,
              longitude: salon.longitude,
            }}
            title={salon.name}
            description={`${salon.rating} ⭐ • ${salon.distance}`}
            pinColor={Colors.light.primary600}
            onPress={() => onProviderSelect(salon)}
          />
        );
      });
    }

    if (showHairdressers) {
      hairdressers.forEach((hairdresser) => {
        markers.push(
          <Marker
            key={`hairdresser-${hairdresser.id}`}
            coordinate={{
              latitude: hairdresser.latitude,
              longitude: hairdresser.longitude,
            }}
            title={hairdresser.name}
            description={`${hairdresser.rating} ⭐ • ${hairdresser.distance}`}
            pinColor={Colors.light.accent600}
            onPress={() => onProviderSelect(hairdresser)}
          />
        );
      });
    }

    return markers;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
        )}
        {renderProviderMarkers()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});

export default MapViewComponent;