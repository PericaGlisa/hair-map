import { DeviceDimensions } from '../hooks/useDeviceDimensions';

// Base font sizes for different screen sizes
const baseFontSizes = {
  xs: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
  },
  sm: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 19,
    '2xl': 22,
    '3xl': 26,
    '4xl': 30,
  },
  md: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  lg: {
    xs: 13,
    sm: 15,
    base: 17,
    lg: 19,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 38,
  },
  xl: {
    xs: 14,
    sm: 16,
    base: 18,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },
};

export const Fonts = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Responsive font size function
  getResponsiveSize: (
    size: keyof typeof baseFontSizes.md,
    screenSize: DeviceDimensions['screenSize']
  ): number => {
    return baseFontSizes[screenSize][size];
  },
  // Get responsive font sizes for current screen
  getResponsiveSizes: (screenSize: DeviceDimensions['screenSize']) => {
    return baseFontSizes[screenSize];
  },
  // Scale font size based on device type
  scaleFont: (
    baseSize: number,
    deviceType: DeviceDimensions['deviceType'],
    isSmallDevice: boolean
  ): number => {
    let scaleFactor = 1;
    
    if (isSmallDevice) {
      scaleFactor = 0.9; // Reduce font size for very small devices
    } else if (deviceType === 'tablet') {
      scaleFactor = 1.1; // Increase font size for tablets
    }
    
    return Math.round(baseSize * scaleFactor);
  },
};