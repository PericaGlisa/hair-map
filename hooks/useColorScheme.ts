import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';

export function useColorScheme() {
  const colorScheme = useRNColorScheme() ?? 'light';
  return {
    colorScheme: colorScheme as ColorScheme,
    colors: Colors[colorScheme as ColorScheme]
  };
}