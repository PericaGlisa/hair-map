import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, Building } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { CustomButton } from '@/components/CustomButton';

export default function SignupScreen() {
  const { colors } = useColorScheme();
  const [userType, setUserType] = useState<'customer' | 'salon' | 'hairdresser'>('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    businessName: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: 'center',
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 15,
      backgroundColor: colors.primary600,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    logoText: {
      fontSize: Fonts.sizes.xl,
      fontWeight: Fonts.weights.bold,
      color: '#FFFFFF',
    },
    title: {
      fontSize: Fonts.sizes['2xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: Fonts.sizes.base,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    userTypeContainer: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
    },
    userTypeButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    userTypeButtonActive: {
      backgroundColor: colors.background,
    },
    userTypeText: {
      fontSize: Fonts.sizes.xs,
      fontWeight: Fonts.weights.medium,
    },
    userTypeTextActive: {
      color: colors.text,
    },
    userTypeTextInactive: {
      color: colors.textSecondary,
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.medium,
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      fontSize: Fonts.sizes.base,
      color: colors.text,
      marginLeft: 12,
    },
    passwordToggle: {
      padding: 4,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    loginText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
    },
    loginLink: {
      fontSize: Fonts.sizes.sm,
      color: colors.primary600,
      fontWeight: Fonts.weights.medium,
      marginLeft: 4,
    },
    termsText: {
      fontSize: Fonts.sizes.xs,
      color: colors.textLight,
      textAlign: 'center',
      lineHeight: Fonts.lineHeights.normal * Fonts.sizes.xs,
      marginTop: 16,
    },
  });

  const handleSignup = () => {
    // Simulate signup process
    console.log('Signup data:', formData, 'User type:', userType);
    router.replace('/(tabs)');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our styling community</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userTypeContainer}>
          {(['customer', 'salon', 'hairdresser'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.userTypeButton, userType === type && styles.userTypeButtonActive]}
              onPress={() => setUserType(type)}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === type ? styles.userTypeTextActive : styles.userTypeTextInactive
                ]}
              >
                {type === 'hairdresser' ? 'Stylist' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {userType === 'customer' ? 'Full Name' : userType === 'salon' ? 'Contact Name' : 'Your Name'}
            </Text>
            <View style={styles.inputWrapper}>
              <User size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.textLight}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>
          </View>

          {userType === 'salon' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Business Name</Text>
              <View style={styles.inputWrapper}>
                <Building size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter salon name"
                  placeholderTextColor={colors.textLight}
                  value={formData.businessName}
                  onChangeText={(value) => updateFormData('businessName', value)}
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone"
                placeholderTextColor={colors.textLight}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {userType !== 'customer' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your address"
                  placeholderTextColor={colors.textLight}
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={colors.textLight}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textLight}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            title="Create Account"
            onPress={handleSignup}
            variant="primary"
            size="lg"
          />

          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}