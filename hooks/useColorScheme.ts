import { Colors, ColorScheme } from '@/constants/Colors';

export function useColorScheme() {
  // Always return 'light' to force light theme
  return {
    colorScheme: 'light' as ColorScheme,
    colors: Colors['light']
  };
}