import React, { useState, useRef, useEffect } from 'react';
import { Image, View, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

interface LazyImageProps {
  source: { uri: string };
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  placeholder?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  resizeMode = 'cover',
  placeholder
}) => {
  const { colors } = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const viewRef = useRef<View>(null);

  useEffect(() => {
    // Simulate intersection observer for lazy loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundTertiary,
    },
    errorText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

  if (!isVisible) {
    return (
      <View ref={viewRef} style={[styles.container, style]}>
        {placeholder || (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary600} />
          </View>
        )}
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <View style={styles.errorText}>⚠️</View>
      </View>
    );
  }

  return (
    <View ref={viewRef} style={[styles.container, style]}>
      <Animated.Image
        source={source}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary600} />
        </View>
      )}
    </View>
  );
};