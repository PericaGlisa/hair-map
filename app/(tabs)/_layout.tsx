import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useDeviceDimensions } from '@/hooks/useDeviceDimensions';
import { Map, Calendar, MessageCircle, User, Building2 } from 'lucide-react-native';
import { Fonts } from '@/constants/Fonts';
import { getResponsiveDimensions, getResponsiveSpacing } from '@/constants/Breakpoints';

export default function TabLayout() {
  const { colors } = useColorScheme();
  const { screenSize, isTablet, isSmallDevice, deviceType } = useDeviceDimensions();
  
  // Get responsive dimensions
  const dimensions = getResponsiveDimensions(screenSize, isTablet);
  const padding = getResponsiveSpacing('sm', screenSize);
  
  // Get responsive font size for tab labels
  const labelFontSize = Fonts.scaleFont(
    Fonts.getResponsiveSize('sm', screenSize),
    deviceType,
    isSmallDevice
  );
  
  // Get responsive icon size
  const getIconSize = () => {
    if (isSmallDevice) return 20;
    if (isTablet) return 26;
    return screenSize === 'xs' ? 22 : 24;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary600,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingTop: padding,
          paddingBottom: padding,
          height: dimensions.tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          fontWeight: '500',
          marginTop: isSmallDevice ? 2 : 4,
        },
        tabBarIconStyle: {
          marginBottom: isSmallDevice ? 2 : 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Map size={getIconSize()} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Appointments',
          tabBarIcon: ({ color }) => (
            <Calendar size={getIconSize()} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="business"
        options={{
          title: 'Business',
          tabBarIcon: ({ color }) => (
            <Building2 size={getIconSize()} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <MessageCircle size={getIconSize()} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={getIconSize()} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}