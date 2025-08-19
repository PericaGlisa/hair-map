import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Calendar, Clock, CreditCard } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Fonts } from '@/constants/Fonts';
import { Service } from '@/types';
import { ServiceCard } from '@/components/ServiceCard';
import { CustomButton } from '@/components/CustomButton';

interface BookingStep {
  step: number;
  title: string;
  completed: boolean;
}

export default function BookScreen() {
  const { colors } = useColorScheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const mockServices: Service[] = [
    { id: 'service-1', name: 'Cut & Style', duration: 60, price: 85, description: 'Professional cut and styling' },
    { id: 'service-2', name: 'Color Treatment', duration: 120, price: 150, description: 'Full color treatment' },
    { id: 'service-3', name: 'Highlights', duration: 180, price: 200, description: 'Premium highlighting service' },
  ];

  const mockTimeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const mockDates = [
    { date: '2025-01-15', displayDate: 'Wed, Jan 15', available: true },
    { date: '2025-01-16', displayDate: 'Thu, Jan 16', available: true },
    { date: '2025-01-17', displayDate: 'Fri, Jan 17', available: false },
    { date: '2025-01-18', displayDate: 'Sat, Jan 18', available: true },
  ];

  const bookingSteps: BookingStep[] = [
    { step: 1, title: 'Select Service', completed: !!selectedService },
    { step: 2, title: 'Choose Date', completed: !!selectedDate },
    { step: 3, title: 'Pick Time', completed: !!selectedTime },
    { step: 4, title: 'Confirm & Pay', completed: false },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSecondary,
    },
    header: {
      backgroundColor: colors.background,
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: Fonts.sizes['2xl'],
      fontWeight: Fonts.weights.bold,
      color: colors.text,
    },
    providerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    providerAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    providerName: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
    },
    stepsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stepItem: {
      flex: 1,
      alignItems: 'center',
    },
    stepCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    stepCircleActive: {
      backgroundColor: colors.primary600,
    },
    stepCircleCompleted: {
      backgroundColor: colors.success500,
    },
    stepCircleInactive: {
      backgroundColor: colors.gray300,
    },
    stepNumber: {
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.bold,
      color: '#FFFFFF',
    },
    stepTitle: {
      fontSize: Fonts.sizes.xs,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    stepLine: {
      position: 'absolute',
      top: 16,
      left: '50%',
      right: '50%',
      height: 2,
      backgroundColor: colors.gray300,
      zIndex: -1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    stepContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    stepHeader: {
      fontSize: Fonts.sizes.xl,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 16,
    },
    dateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    dateItem: {
      width: '48%',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      marginBottom: 12,
    },
    dateItemSelected: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary600,
    },
    dateItemDisabled: {
      backgroundColor: colors.gray100,
      borderColor: colors.gray200,
    },
    dateText: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.medium,
      color: colors.text,
    },
    dateTextSelected: {
      color: colors.primary700,
    },
    dateTextDisabled: {
      color: colors.gray400,
    },
    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    timeItem: {
      width: '30%',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      marginBottom: 12,
    },
    timeItemSelected: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary600,
    },
    timeText: {
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.medium,
      color: colors.text,
    },
    timeTextSelected: {
      color: colors.primary700,
    },
    summaryContainer: {
      backgroundColor: colors.backgroundSecondary,
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: Fonts.sizes.sm,
      color: colors.textSecondary,
    },
    summaryValue: {
      fontSize: Fonts.sizes.sm,
      fontWeight: Fonts.weights.medium,
      color: colors.text,
    },
    summaryTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    summaryTotalLabel: {
      fontSize: Fonts.sizes.base,
      fontWeight: Fonts.weights.semibold,
      color: colors.text,
    },
    summaryTotalValue: {
      fontSize: Fonts.sizes.lg,
      fontWeight: Fonts.weights.bold,
      color: colors.primary600,
    },
    footer: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    backButtonFooter: {
      flex: 1,
      marginRight: 12,
    },
    continueButton: {
      flex: 2,
    },
  });

  const canContinue = () => {
    switch (currentStep) {
      case 1: return !!selectedService;
      case 2: return !!selectedDate;
      case 3: return !!selectedTime;
      case 4: return true;
      default: return false;
    }
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete booking
      console.log('Booking completed');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeader}>Select a Service</Text>
            {mockServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => setSelectedService(service)}
              />
            ))}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeader}>Choose Your Date</Text>
            <View style={styles.dateGrid}>
              {mockDates.map((dateItem) => (
                <TouchableOpacity
                  key={dateItem.date}
                  style={[
                    styles.dateItem,
                    selectedDate === dateItem.date && styles.dateItemSelected,
                    !dateItem.available && styles.dateItemDisabled,
                  ]}
                  onPress={() => dateItem.available && setSelectedDate(dateItem.date)}
                  disabled={!dateItem.available}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === dateItem.date && styles.dateTextSelected,
                      !dateItem.available && styles.dateTextDisabled,
                    ]}
                  >
                    {dateItem.displayDate}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeader}>Pick Your Time</Text>
            <View style={styles.timeGrid}>
              {mockTimeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeItem,
                    selectedTime === time && styles.timeItemSelected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.timeTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepHeader}>Confirm Your Booking</Text>
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>{selectedService?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>
                  {mockDates.find(d => d.date === selectedDate)?.displayDate}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{selectedService?.duration} min</Text>
              </View>
              <View style={styles.summaryTotal}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>${selectedService?.price}</Text>
              </View>
            </View>

            <Text style={[styles.summaryLabel, { textAlign: 'center', marginBottom: 16 }]}>
              A €1 pre-authorization will be placed on your card and released after service completion.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Appointment</Text>
        </View>

        <View style={styles.providerInfo}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
            style={styles.providerAvatar} 
          />
          <Text style={styles.providerName}>Sarah Johnson</Text>
        </View>

        <View style={styles.stepsContainer}>
          {bookingSteps.map((step, index) => (
            <View key={step.step} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  step.step === currentStep
                    ? styles.stepCircleActive
                    : step.completed
                    ? styles.stepCircleCompleted
                    : styles.stepCircleInactive,
                ]}
              >
                <Text style={styles.stepNumber}>{step.step}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              {index < bookingSteps.length - 1 && <View style={styles.stepLine} />}
            </View>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <CustomButton
            title="Back"
            onPress={handleBack}
            variant="outline"
            style={styles.backButtonFooter}
          />
        )}
        <CustomButton
          title={currentStep === 4 ? 'Confirm Booking' : 'Continue'}
          onPress={handleContinue}
          disabled={!canContinue()}
          style={currentStep === 1 ? { flex: 1 } : styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}