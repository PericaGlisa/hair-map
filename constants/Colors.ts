export const Colors = {
  light: {
    // Primary Colors
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary500: '#3B82F6',
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    primary800: '#1E40AF',
    primary900: '#1E3A8A',

    // Accent Colors
    accent50: '#FFFBEB',
    accent100: '#FEF3C7',
    accent500: '#F59E0B',
    accent600: '#D97706',
    accent700: '#B45309',

    // Success
    success50: '#ECFDF5',
    success500: '#10B981',
    success600: '#059669',

    // Warning
    warning50: '#FFFBEB',
    warning500: '#F59E0B',
    warning600: '#D97706',

    // Error
    error50: '#FEF2F2',
    error500: '#EF4444',
    error600: '#DC2626',

    // Neutral
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',

    // Text
    text: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',

    // Background
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',

    // Border
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    // Primary Colors (adjusted for dark theme)
    primary50: '#1E3A8A',
    primary100: '#1E40AF',
    primary500: '#3B82F6',
    primary600: '#60A5FA',
    primary700: '#93C5FD',
    primary800: '#BFDBFE',
    primary900: '#DBEAFE',

    // Accent Colors
    accent50: '#B45309',
    accent100: '#D97706',
    accent500: '#F59E0B',
    accent600: '#FBBF24',
    accent700: '#FCD34D',

    // Success
    success50: '#064E3B',
    success500: '#10B981',
    success600: '#34D399',

    // Warning
    warning50: '#92400E',
    warning500: '#F59E0B',
    warning600: '#FBBF24',

    // Error
    error50: '#7F1D1D',
    error500: '#EF4444',
    error600: '#F87171',

    // Neutral
    gray50: '#111827',
    gray100: '#1F2937',
    gray200: '#374151',
    gray300: '#4B5563',
    gray400: '#6B7280',
    gray500: '#9CA3AF',
    gray600: '#D1D5DB',
    gray700: '#E5E7EB',
    gray800: '#F3F4F6',
    gray900: '#F9FAFB',

    // Text
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textLight: '#9CA3AF',

    // Background
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',

    // Border
    border: '#374151',
    borderLight: '#4B5563',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)',
  }
};

export type ColorScheme = keyof typeof Colors;