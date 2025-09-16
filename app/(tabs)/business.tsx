import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Building2, MapPin, Phone, Clock, Star, Edit3, Camera, QrCode } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { CustomButton } from '@/components/CustomButton';

export default function BusinessScreen() {
  const { colors } = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Salon Elegance',
    address: 'Knez Mihailova 15, Belgrade',
    phone: '+381 11 123 4567',
    workingHours: '09:00 - 20:00',
    description: 'Professional hair and beauty salon with over 10 years of experience.',
    rating: 4.8,
    reviewCount: 127
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      color: colors.text,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      position: 'relative',
    },
    logoImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    logoPlaceholder: {
      color: colors.background,
      fontSize: 48,
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.accent,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.background,
    },
    businessName: {
      fontSize: 28,
      fontFamily: Fonts.bold,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    rating: {
      fontSize: 16,
      fontFamily: Fonts.medium,
      color: colors.text,
      marginLeft: 8,
    },
    reviewCount: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    infoSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    infoIcon: {
      marginRight: 12,
      width: 24,
    },
    infoText: {
      flex: 1,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: colors.text,
    },
    infoInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 4,
    },
    description: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: 20,
    },
    descriptionInput: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      minHeight: 80,
      textAlignVertical: 'top',
      marginBottom: 20,
    },
    editButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: colors.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    qrSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    qrPlaceholder: {
      width: 120,
      height: 120,
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    generateButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 12,
    },
    generateButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
    qrTitle: {
      fontSize: 18,
      fontFamily: Fonts.semiBold,
      color: colors.text,
      marginBottom: 12,
    },
    qrDescription: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
    },
    buttonContainer: {
      gap: 12,
    },
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ovde bi se poslali podaci na server
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Salon</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          <Edit3 size={20} color={colors.background} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Building2 size={48} color={colors.background} />
            {isEditing && (
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color={colors.background} />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.businessName, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              value={businessInfo.name}
              onChangeText={(text) => setBusinessInfo({...businessInfo, name: text})}
              placeholder="Salon name"
              placeholderTextColor={colors.textSecondary}
            />
          ) : (
            <Text style={styles.businessName}>{businessInfo.name}</Text>
          )}
          
          <View style={styles.ratingContainer}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{businessInfo.rating}</Text>
            <Text style={styles.reviewCount}>({businessInfo.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Business Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MapPin size={20} color={colors.primary} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={businessInfo.address}
                onChangeText={(text) => setBusinessInfo({...businessInfo, address: text})}
                placeholder="Address"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoText}>{businessInfo.address}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color={colors.primary} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={businessInfo.phone}
                onChangeText={(text) => setBusinessInfo({...businessInfo, phone: text})}
                placeholder="Phone"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoText}>{businessInfo.phone}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Clock size={20} color={colors.primary} style={styles.infoIcon} />
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={businessInfo.workingHours}
                onChangeText={(text) => setBusinessInfo({...businessInfo, workingHours: text})}
                placeholder="Working hours"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoText}>{businessInfo.workingHours}</Text>
            )}
          </View>
        </View>

        {/* Description */}
        {isEditing ? (
          <TextInput
            style={styles.descriptionInput}
            value={businessInfo.description}
            onChangeText={(text) => setBusinessInfo({...businessInfo, description: text})}
            placeholder="Salon description"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        ) : (
          <Text style={styles.description}>{businessInfo.description}</Text>
        )}

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Salon QR Code</Text>
          <Text style={styles.qrDescription}>
            Generate and share QR code with clients for faster booking
          </Text>
          <View style={styles.qrPlaceholder}>
            <QrCode size={80} color={colors.textSecondary} />
          </View>
          <TouchableOpacity style={styles.generateButton}>
            <Text style={styles.generateButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}