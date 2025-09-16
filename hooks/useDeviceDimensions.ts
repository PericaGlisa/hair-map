import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export interface DeviceDimensions {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  isSmallDevice: boolean;
  deviceType: 'phone' | 'tablet';
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface Breakpoints {
  xs: number; // Extra small devices (phones in portrait)
  sm: number; // Small devices (phones in landscape)
  md: number; // Medium devices (small tablets)
  lg: number; // Large devices (tablets)
  xl: number; // Extra large devices (large tablets)
}

const BREAKPOINTS: Breakpoints = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const getScreenSize = (width: number): DeviceDimensions['screenSize'] => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

const isTabletDevice = (width: number, height: number): boolean => {
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  
  // Consider it a tablet if:
  // 1. Minimum dimension is >= 600px (common tablet threshold)
  // 2. Or if it's explicitly marked as tablet in platform
  if (Platform.OS === 'ios') {
    // iOS specific tablet detection
    return minDimension >= 600 || maxDimension >= 1024;
  }
  
  // Android tablet detection
  return minDimension >= 600;
};

const isSmallDevice = (width: number, height: number): boolean => {
  const minDimension = Math.min(width, height);
  // Consider small if width is less than 375px (iPhone SE size)
  return minDimension < 375;
};

export const useDeviceDimensions = (): DeviceDimensions => {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const isTablet = isTabletDevice(width, height);
    const isSmallDeviceCheck = isSmallDevice(width, height);
    const deviceType = isTablet ? 'tablet' : 'phone';
    const screenSize = getScreenSize(width);

    return {
      width,
      height,
      isLandscape,
      isTablet,
      isSmallDevice: isSmallDeviceCheck,
      deviceType,
      screenSize,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      const isLandscape = width > height;
      const isTablet = isTabletDevice(width, height);
      const isSmallDeviceCheck = isSmallDevice(width, height);
      const deviceType = isTablet ? 'tablet' : 'phone';
      const screenSize = getScreenSize(width);

      setDimensions({
        width,
        height,
        isLandscape,
        isTablet,
        isSmallDevice: isSmallDeviceCheck,
        deviceType,
        screenSize,
      });
    });

    return () => subscription?.remove();
  }, []);

  return dimensions;
};

// Utility functions for responsive design
export const getResponsiveValue = <T>(
  values: Partial<Record<DeviceDimensions['screenSize'], T>>,
  currentSize: DeviceDimensions['screenSize'],
  fallback: T
): T => {
  // Try to get value for current size, then fallback to smaller sizes
  const sizeOrder: DeviceDimensions['screenSize'][] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = sizeOrder.indexOf(currentSize);
  
  for (let i = currentIndex; i < sizeOrder.length; i++) {
    const size = sizeOrder[i];
    if (values[size] !== undefined) {
      return values[size] as T;
    }
  }
  
  return fallback;
};

export const getResponsiveSpacing = (
  screenSize: DeviceDimensions['screenSize'],
  baseSpacing: number = 16
): number => {
  const multipliers = {
    xs: 0.75,
    sm: 0.875,
    md: 1,
    lg: 1.125,
    xl: 1.25,
  };
  
  return Math.round(baseSpacing * multipliers[screenSize]);
};

export { BREAKPOINTS };