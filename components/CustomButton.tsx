import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle
}: CustomButtonProps) {
  const { colors } = useColorScheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    };

    const sizeStyles = {
      sm: { paddingHorizontal: 16, paddingVertical: 8 },
      md: { paddingHorizontal: 20, paddingVertical: 12 },
      lg: { paddingHorizontal: 24, paddingVertical: 16 }
    };

    const variantStyles = {
      primary: {
        backgroundColor: colors.primary600,
        borderColor: colors.primary600,
      },
      secondary: {
        backgroundColor: colors.accent500,
        borderColor: colors.accent500,
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: colors.primary600,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      }
    };

    const disabledStyle = disabled ? {
      backgroundColor: colors.gray300,
      borderColor: colors.gray300,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: Fonts.sizes.sm },
      md: { fontSize: Fonts.sizes.base },
      lg: { fontSize: Fonts.sizes.lg }
    };

    const variantStyles = {
      primary: { color: '#FFFFFF' },
      secondary: { color: '#FFFFFF' },
      outline: { color: colors.primary600 },
      ghost: { color: colors.primary600 }
    };

    const disabledStyle = disabled ? {
      color: colors.gray500
    } : {};

    return {
      fontWeight: Fonts.weights.semibold,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary600 : '#FFFFFF'}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}