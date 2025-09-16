import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: keyof typeof Fonts.sizes;
  weight?: keyof typeof Fonts.weights;
  lineHeight?: keyof typeof Fonts.lineHeights;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean; // Enable/disable responsive scaling
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  weight = 'regular',
  lineHeight = 'normal',
  color,
  style,
  numberOfLines,
  adjustsFontSizeToFit = false,
  minimumFontScale = 0.8,
  textAlign = 'left',
  responsive = true,
}) => {
  const { screenSize, deviceType, isSmallDevice } = useDeviceDimensions();
  const { colors } = useColorScheme();

  const getFontSize = () => {
    if (!responsive) {
      return Fonts.sizes[size];
    }
    
    const responsiveSize = Fonts.getResponsiveSize(size, screenSize);
    const scaledSize = Fonts.scaleFont(responsiveSize, deviceType, isSmallDevice);
    
    return scaledSize;
  };

  const getLineHeight = () => {
    const fontSize = getFontSize();
    return fontSize * Fonts.lineHeights[lineHeight];
  };

  const textStyle: TextStyle = {
    fontSize: getFontSize(),
    fontWeight: Fonts.weights[weight],
    lineHeight: getLineHeight(),
    color: color || colors.text,
    textAlign,
    ...style,
  };

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
    >
      {children}
    </Text>
  );
};

export default ResponsiveText;