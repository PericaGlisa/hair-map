import { DeviceDimensions } from '../hooks/useDeviceDimensions';

// Breakpoint definitions
export const BREAKPOINTS = {
  xs: 0,     // Extra small devices (phones in portrait)
  sm: 480,   // Small devices (phones in landscape)
  md: 768,   // Medium devices (small tablets)
  lg: 1024,  // Large devices (tablets)
  xl: 1280,  // Extra large devices (large tablets)
} as const;

// Device size categories
export const DEVICE_SIZES = {
  PHONE_SMALL: { width: 320, height: 568 },  // iPhone SE
  PHONE_MEDIUM: { width: 375, height: 667 }, // iPhone 8
  PHONE_LARGE: { width: 414, height: 896 },  // iPhone 11
  TABLET_SMALL: { width: 768, height: 1024 }, // iPad Mini
  TABLET_LARGE: { width: 1024, height: 1366 }, // iPad Pro
} as const;

// Responsive spacing system
export const SPACING = {
  xs: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
  },
  sm: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  md: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 32,
  },
  lg: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
  },
  xl: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
  },
} as const;

// Responsive border radius
export const BORDER_RADIUS = {
  xs: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
  },
  sm: {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
  },
  md: {
    sm: 8,
    md: 10,
    lg: 12,
    xl: 16,
  },
  lg: {
    sm: 10,
    md: 12,
    lg: 14,
    xl: 18,
  },
  xl: {
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  },
} as const;

// Utility functions
export const getResponsiveSpacing = (
  size: keyof typeof SPACING.md,
  screenSize: DeviceDimensions['screenSize']
): number => {
  return SPACING[screenSize][size];
};

export const getResponsiveBorderRadius = (
  size: keyof typeof BORDER_RADIUS.md,
  screenSize: DeviceDimensions['screenSize']
): number => {
  return BORDER_RADIUS[screenSize][size];
};

// Get responsive value based on screen size
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

// Check if screen size matches breakpoint
export const matchesBreakpoint = (
  width: number,
  breakpoint: keyof typeof BREAKPOINTS
): boolean => {
  return width >= BREAKPOINTS[breakpoint];
};

// Get current breakpoint based on width
export const getCurrentBreakpoint = (
  width: number
): DeviceDimensions['screenSize'] => {
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

// Responsive dimensions for common UI elements
export const getResponsiveDimensions = (
  screenSize: DeviceDimensions['screenSize'],
  isTablet: boolean
) => {
  const base = {
    tabBarHeight: isTablet ? 70 : 60,
    headerHeight: isTablet ? 60 : 50,
    buttonHeight: isTablet ? 50 : 44,
    inputHeight: isTablet ? 48 : 40,
    cardPadding: getResponsiveSpacing('md', screenSize),
    screenPadding: getResponsiveSpacing('lg', screenSize),
  };

  // Adjust for very small devices
  if (screenSize === 'xs') {
    return {
      ...base,
      tabBarHeight: 55,
      headerHeight: 45,
      buttonHeight: 40,
      inputHeight: 36,
    };
  }

  return base;
};

// Grid system for responsive layouts
export const getGridColumns = (
  screenSize: DeviceDimensions['screenSize'],
  isTablet: boolean
): number => {
  if (isTablet) {
    return screenSize === 'xl' ? 4 : 3;
  }
  
  switch (screenSize) {
    case 'xs':
      return 1;
    case 'sm':
      return 2;
    default:
      return 2;
  }
};

// Calculate item width for grid layouts
export const getGridItemWidth = (
  containerWidth: number,
  columns: number,
  spacing: number
): number => {
  const totalSpacing = spacing * (columns - 1);
  return (containerWidth - totalSpacing) / columns;
};