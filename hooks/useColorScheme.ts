import { useColorScheme as useRNColorScheme, Appearance } from 'react-native';
import { Colors, ColorScheme } from '@/constants/Colors';
import { useEffect, useState } from 'react';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    // Try to get the initial color scheme more reliably
    const initial = systemColorScheme || Appearance.getColorScheme() || 'light';
    return initial as ColorScheme;
  });

  useEffect(() => {
    // Listen for color scheme changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme((newColorScheme || 'light') as ColorScheme);
    });

    // Update if systemColorScheme changes
    if (systemColorScheme) {
      setColorScheme(systemColorScheme as ColorScheme);
    }

    return () => subscription?.remove();
  }, [systemColorScheme]);

  return {
    colorScheme,
    colors: Colors[colorScheme]
  };
}