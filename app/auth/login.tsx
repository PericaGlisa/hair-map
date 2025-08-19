import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { CustomButton } from '@/components/CustomButton';

export default function LoginScreen() {
  const { colors } = useColorScheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'salon' | 'hairdresser'>('customer');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 20,
      marginBottom: 16,
      backgroundColor: colors.primary600,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: Fonts.sizes['2xl'],
      fontWeight: Fonts.weights.bold,
      color: '#FFFFFF',
    },
    title: {
      fontSize: Fonts.sizes['3xl'],
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
    form: {
      marginBottom: 24,
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
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.medium,
    },
    userTypeTextActive: {
      color: colors.text,
    },
    userTypeTextInactive: {
      color: colors.textSecondary,
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
    inputWrapperFocused: {
      borderColor: colors.primary600,
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
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: Fonts.sizes.sm,
      color: colors.primary600,
      fontWeight: Fonts.weights.medium,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    signupText: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
    },
    signupLink: {
      fontSize: Fonts.sizes.sm,
      color: colors.primary600,
      fontWeight: Fonts.weights.medium,
      marginLeft: 4,
    },
  });

  const handleLogin = () => {
    // Simulate login process
    router.replace('/(tabs)');
  };

  const handleSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
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
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            size="lg"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}