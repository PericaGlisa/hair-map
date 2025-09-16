import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  qrCodeLimit?: number;
  analyticsAccess: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod?: string;
}

export interface AnalyticsData {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  topServices: { name: string; count: number; revenue: number }[];
  customerRetention: number;
  peakHours: { hour: number; appointments: number }[];
  reviewStats: {
    total: number;
    average: number;
    distribution: { [key: number]: number };
  };
}

export interface BusinessInsights {
  recommendations: string[];
  trends: {
    bookingTrend: 'increasing' | 'decreasing' | 'stable';
    revenueTrend: 'increasing' | 'decreasing' | 'stable';
    customerSatisfaction: 'improving' | 'declining' | 'stable';
  };
  alerts: {
    type: 'warning' | 'info' | 'success';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

class PremiumService {
  private static instance: PremiumService;
  private currentSubscription: UserSubscription | null = null;

  private constructor() {
    this.loadSubscription();
  }

  static getInstance(): PremiumService {
    if (!PremiumService.instance) {
      PremiumService.instance = new PremiumService();
    }
    return PremiumService.instance;
  }

  // Subscription tiers
  getAvailableTiers(): SubscriptionTier[] {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        duration: 'monthly',
        features: [
          'Basic appointment booking',
          'Provider search',
          'Basic reviews',
          'Standard support'
        ],
        qrCodeLimit: 1,
        analyticsAccess: false,
        prioritySupport: false,
        customBranding: false,
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 9.99,
        duration: 'monthly',
        features: [
          'All Free features',
          'Priority booking',
          'Advanced search filters',
          'Photo reviews',
          'Email support'
        ],
        qrCodeLimit: 5,
        analyticsAccess: false,
        prioritySupport: false,
        customBranding: false,
      },
      {
        id: 'pro',
        name: 'Professional',
        price: 29.99,
        duration: 'monthly',
        features: [
          'All Basic features',
          'Business analytics',
          'Custom QR codes',
          'Priority support',
          'Advanced notifications',
          'Customer insights'
        ],
        qrCodeLimit: 25,
        analyticsAccess: true,
        prioritySupport: true,
        customBranding: false,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99.99,
        duration: 'monthly',
        features: [
          'All Pro features',
          'Custom branding',
          'API access',
          'Dedicated support',
          'Advanced analytics',
          'Multi-location management',
          'White-label solution'
        ],
        qrCodeLimit: -1, // Unlimited
        analyticsAccess: true,
        prioritySupport: true,
        customBranding: true,
      },
    ];
  }

  async getCurrentSubscription(): Promise<UserSubscription | null> {
    if (!this.currentSubscription) {
      await this.loadSubscription();
    }
    return this.currentSubscription;
  }

  async isFeatureAvailable(feature: string): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    if (!subscription || !subscription.isActive) {
      const freeTier = this.getAvailableTiers().find(t => t.id === 'free');
      return freeTier?.features.includes(feature) || false;
    }
    return subscription.tier.features.includes(feature);
  }

  async canCreateQRCode(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    if (!subscription || !subscription.isActive) {
      // Check free tier limit
      const qrCount = await this.getQRCodeCount();
      return qrCount < 1;
    }
    
    if (subscription.tier.qrCodeLimit === -1) {
      return true; // Unlimited
    }
    
    const qrCount = await this.getQRCodeCount();
    return qrCount < (subscription.tier.qrCodeLimit || 0);
  }

  async hasAnalyticsAccess(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    return subscription?.isActive && subscription.tier.analyticsAccess || false;
  }

  async hasPrioritySupport(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    return subscription?.isActive && subscription.tier.prioritySupport || false;
  }

  async hasCustomBranding(): Promise<boolean> {
    const subscription = await this.getCurrentSubscription();
    return subscription?.isActive && subscription.tier.customBranding || false;
  }

  // Subscription management
  async subscribeTo(tierId: string, paymentMethod: string): Promise<boolean> {
    try {
      const tier = this.getAvailableTiers().find(t => t.id === tierId);
      if (!tier) {
        throw new Error('Invalid subscription tier');
      }

      // In a real app, this would integrate with payment processors like Stripe
      const success = await this.processPayment(tier, paymentMethod);
      
      if (success) {
        const startDate = new Date();
        const endDate = new Date();
        if (tier.duration === 'monthly') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        this.currentSubscription = {
          tier,
          startDate,
          endDate,
          isActive: true,
          autoRenew: true,
          paymentMethod,
        };

        await this.saveSubscription();
        
        Alert.alert(
          'Subscription Activated',
          `Welcome to ${tier.name}! Your subscription is now active.`,
          [{ text: 'OK' }]
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error subscribing:', error);
      Alert.alert('Subscription Error', 'Failed to activate subscription. Please try again.');
      return false;
    }
  }

  async cancelSubscription(): Promise<boolean> {
    try {
      if (this.currentSubscription) {
        this.currentSubscription.autoRenew = false;
        await this.saveSubscription();
        
        Alert.alert(
          'Subscription Cancelled',
          'Your subscription will remain active until the end of the current billing period.',
          [{ text: 'OK' }]
        );
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  async renewSubscription(): Promise<boolean> {
    try {
      if (!this.currentSubscription) {
        return false;
      }

      const success = await this.processPayment(
        this.currentSubscription.tier,
        this.currentSubscription.paymentMethod || 'default'
      );

      if (success) {
        const newEndDate = new Date(this.currentSubscription.endDate);
        if (this.currentSubscription.tier.duration === 'monthly') {
          newEndDate.setMonth(newEndDate.getMonth() + 1);
        } else {
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        }

        this.currentSubscription.endDate = newEndDate;
        this.currentSubscription.isActive = true;
        await this.saveSubscription();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error renewing subscription:', error);
      return false;
    }
  }

  // Analytics and insights
  async getAnalyticsData(): Promise<AnalyticsData | null> {
    const hasAccess = await this.hasAnalyticsAccess();
    if (!hasAccess) {
      return null;
    }

    // In a real app, this would fetch from your analytics service
    return {
      totalAppointments: 156,
      completedAppointments: 142,
      cancelledAppointments: 14,
      averageRating: 4.6,
      totalRevenue: 12450,
      monthlyRevenue: [2100, 2300, 2800, 3200, 2950, 3100],
      topServices: [
        { name: 'Haircut & Style', count: 45, revenue: 2250 },
        { name: 'Hair Coloring', count: 32, revenue: 3200 },
        { name: 'Beard Trim', count: 28, revenue: 840 },
      ],
      customerRetention: 78,
      peakHours: [
        { hour: 10, appointments: 12 },
        { hour: 14, appointments: 15 },
        { hour: 16, appointments: 18 },
      ],
      reviewStats: {
        total: 89,
        average: 4.6,
        distribution: { 5: 52, 4: 28, 3: 7, 2: 2, 1: 0 },
      },
    };
  }

  async getBusinessInsights(): Promise<BusinessInsights | null> {
    const hasAccess = await this.hasAnalyticsAccess();
    if (!hasAccess) {
      return null;
    }

    return {
      recommendations: [
        'Consider offering promotions during low-traffic hours (12-2 PM)',
        'Your hair coloring service has high revenue potential - promote it more',
        'Customer retention is good but could be improved with loyalty programs',
      ],
      trends: {
        bookingTrend: 'increasing',
        revenueTrend: 'increasing',
        customerSatisfaction: 'stable',
      },
      alerts: [
        {
          type: 'info',
          message: 'Peak booking hours are 4-6 PM. Consider adjusting staff schedule.',
          priority: 'medium',
        },
        {
          type: 'success',
          message: 'Customer satisfaction has remained consistently high this month.',
          priority: 'low',
        },
      ],
    };
  }

  // Helper methods
  private async processPayment(tier: SubscriptionTier, paymentMethod: string): Promise<boolean> {
    // Simulate payment processing
    console.log(`Processing payment for ${tier.name}: $${tier.price}`);
    
    // In a real app, integrate with Stripe, PayPal, or other payment processors
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate
    return Math.random() > 0.05;
  }

  private async getQRCodeCount(): Promise<number> {
    try {
      const stored = await AsyncStorage.getItem('qr_code_count');
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      console.error('Error getting QR code count:', error);
      return 0;
    }
  }

  async incrementQRCodeCount(): Promise<void> {
    try {
      const current = await this.getQRCodeCount();
      await AsyncStorage.setItem('qr_code_count', (current + 1).toString());
    } catch (error) {
      console.error('Error incrementing QR code count:', error);
    }
  }

  private async loadSubscription(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('user_subscription');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.startDate = new Date(parsed.startDate);
        parsed.endDate = new Date(parsed.endDate);
        
        // Check if subscription is still active
        parsed.isActive = parsed.isActive && new Date() < parsed.endDate;
        
        this.currentSubscription = parsed;
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  }

  private async saveSubscription(): Promise<void> {
    try {
      if (this.currentSubscription) {
        await AsyncStorage.setItem('user_subscription', JSON.stringify(this.currentSubscription));
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    }
  }

  async checkSubscriptionStatus(): Promise<void> {
    if (this.currentSubscription) {
      const now = new Date();
      
      // Check if subscription expired
      if (this.currentSubscription.isActive && now > this.currentSubscription.endDate) {
        this.currentSubscription.isActive = false;
        await this.saveSubscription();
        
        Alert.alert(
          'Subscription Expired',
          'Your subscription has expired. Please renew to continue enjoying premium features.',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Renew', onPress: () => this.renewSubscription() },
          ]
        );
      }
      
      // Check if renewal is due soon (7 days before expiry)
      const daysUntilExpiry = Math.ceil((this.currentSubscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (this.currentSubscription.isActive && this.currentSubscription.autoRenew && daysUntilExpiry <= 7) {
        Alert.alert(
          'Subscription Renewal',
          `Your subscription will renew in ${daysUntilExpiry} days.`,
          [{ text: 'OK' }]
        );
      }
    }
  }

  // Utility methods
  async getSubscriptionStatus(): Promise<{
    isActive: boolean;
    tierName: string;
    daysRemaining: number;
    autoRenew: boolean;
  }> {
    const subscription = await this.getCurrentSubscription();
    
    if (!subscription) {
      return {
        isActive: false,
        tierName: 'Free',
        daysRemaining: 0,
        autoRenew: false,
      };
    }
    
    const daysRemaining = Math.max(0, Math.ceil((subscription.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      isActive: subscription.isActive,
      tierName: subscription.tier.name,
      daysRemaining,
      autoRenew: subscription.autoRenew,
    };
  }
}

export default PremiumService.getInstance();