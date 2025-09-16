import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { getResponsiveSpacing, getResponsiveBorderRadius } from '@/constants/Breakpoints';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  padding?: keyof typeof import('@/constants/Breakpoints').SPACING.md;
  margin?: keyof typeof import('@/constants/Breakpoints').SPACING.md;
  borderRadius?: keyof typeof import('@/constants/Breakpoints').BORDER_RADIUS.md;
  style?: ViewStyle;
  maxWidth?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  flex?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  padding,
  margin,
  borderRadius,
  style,
  maxWidth,
  flex,
}) => {
  const { screenSize, width } = useDeviceDimensions();

  const getResponsiveMaxWidth = () => {
    if (!maxWidth) return undefined;
    return maxWidth[screenSize] || maxWidth.md || undefined;
  };

  const getResponsiveFlex = () => {
    if (!flex) return undefined;
    return flex[screenSize] || flex.md || undefined;
  };

  const containerStyle: ViewStyle = {
    ...(padding && { padding: getResponsiveSpacing(padding, screenSize) }),
    ...(margin && { margin: getResponsiveSpacing(margin, screenSize) }),
    ...(borderRadius && { borderRadius: getResponsiveBorderRadius(borderRadius, screenSize) }),
    ...(getResponsiveMaxWidth() && { maxWidth: getResponsiveMaxWidth() }),
    ...(getResponsiveFlex() && { flex: getResponsiveFlex() }),
    ...style,
  };

  return <View style={containerStyle}>{children}</View>;
};

export default ResponsiveContainer;