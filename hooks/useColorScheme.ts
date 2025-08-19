import { Colors, ColorScheme } from '@/constants/Colors';

export function useColorScheme() {
  // Always return 'dark' to force dark theme
  return {
    colorScheme: 'dark' as ColorScheme,
    colors: Colors['dark']
  };
}