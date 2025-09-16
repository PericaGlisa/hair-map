import AsyncStorage from '@react-native-async-storage/async-storage';
import { Salon, Hairdresser, Appointment, User } from '@/types';
import PremiumService, { SubscriptionTier } from './PremiumService';
import NotificationService from './NotificationService';

export interface QRCodeData {
  id: string;
  type: 'provider' | 'appointment' | 'promotion' | 'loyalty' | 'menu';
  providerId?: string;
  appointmentId?: string;
  promotionId?: string;
  data: any;
  createdAt: Date;
  expiresAt?: Date;
  scanCount: number;
  maxScans?: number;
  isActive: boolean;
  customBranding?: QRBranding;
}

export interface QRBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cornerRadius: number;
  style: 'square' | 'rounded' | 'circle';
  pattern: 'standard' | 'dots' | 'rounded';
}

export interface QRScanResult {
  success: boolean;
  data?: QRCodeData;
  error?: string;
  action?: {
    type: 'navigate' | 'book' | 'redeem' | 'contact' | 'menu';
    payload: any;
  };
}

export interface QRAnalytics {
  qrId: string;
  totalScans: number;
  uniqueScans: number;
  scansByDate: { date: string; count: number }[];
  scansByLocation: { location: string; count: number }[];
  scansByDevice: { device: string; count: number }[];
  conversionRate: number;
  lastScanned?: Date;
}

export interface PromotionQR {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free_service';
  discountValue: number;
  validFrom: Date;
  validUntil: Date;
  maxRedemptions: number;
  currentRedemptions: number;
  applicableServices: string[];
  termsAndConditions: string;
  qrCodeId: string;
}

export interface LoyaltyQR {
  id: string;
  customerId: string;
  pointsBalance: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints: number;
  rewardsAvailable: {
    id: string;
    name: string;
    pointsCost: number;
    description: string;
  }[];
  qrCodeId: string;
}

class QRService {
  private static instance: QRService;
  private qrCodes: Map<string, QRCodeData> = new Map();
  private analytics: Map<string, QRAnalytics> = new Map();
  private promotions: Map<string, PromotionQR> = new Map();
  private loyaltyCards: Map<string, LoyaltyQR> = new Map();

  private constructor() {
    this.loadStoredData();
  }

  static getInstance(): QRService {
    if (!QRService.instance) {
      QRService.instance = new QRService();
    }
    return QRService.instance;
  }

  // QR Code Generation
  async generateProviderQR(
    provider: Salon | Hairdresser,
    customBranding?: QRBranding
  ): Promise<QRCodeData> {
    try {
      const qrId = `provider_${provider.id}_${Date.now()}`;
      
      const qrData: QRCodeData = {
        id: qrId,
        type: 'provider',
        providerId: provider.id,
        data: {
          name: provider.name,
          type: 'type' in provider ? 'salon' : 'hairdresser',
          services: provider.services,
          rating: provider.rating,
          location: {
            latitude: provider.latitude,
            longitude: provider.longitude,
          },
          contact: {
            phone: provider.phone,
            email: provider.email,
          },
        },
        createdAt: new Date(),
        scanCount: 0,
        isActive: true,
        customBranding,
      };

      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
      
      // Initialize analytics
      this.analytics.set(qrId, {
        qrId,
        totalScans: 0,
        uniqueScans: 0,
        scansByDate: [],
        scansByLocation: [],
        scansByDevice: [],
        conversionRate: 0,
      });
      
      return qrData;
    } catch (error) {
      console.error('Error generating provider QR:', error);
      throw error;
    }
  }

  async generateAppointmentQR(
    appointment: Appointment,
    customBranding?: QRBranding
  ): Promise<QRCodeData> {
    try {
      const qrId = `appointment_${appointment.id}_${Date.now()}`;
      
      const qrData: QRCodeData = {
        id: qrId,
        type: 'appointment',
        appointmentId: appointment.id,
        data: {
          appointmentDetails: {
            id: appointment.id,
            service: appointment.service,
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            price: appointment.price,
          },
          provider: {
            id: appointment.providerId,
            name: appointment.providerName,
          },
          customer: {
            id: appointment.customerId,
            name: appointment.customerName,
          },
          checkInCode: this.generateCheckInCode(),
        },
        createdAt: new Date(),
        expiresAt: new Date(appointment.date),
        scanCount: 0,
        maxScans: 10, // Limit scans for security
        isActive: true,
        customBranding,
      };

      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
      
      return qrData;
    } catch (error) {
      console.error('Error generating appointment QR:', error);
      throw error;
    }
  }

  async generatePromotionQR(
    promotion: PromotionQR,
    customBranding?: QRBranding
  ): Promise<QRCodeData> {
    try {
      // Check if user has premium access for custom promotions
      const hasAccess = await PremiumService.hasFeatureAccess('custom_promotions');
      if (!hasAccess) {
        throw new Error('Premium subscription required for custom promotion QR codes');
      }

      const qrId = `promotion_${promotion.id}_${Date.now()}`;
      
      const qrData: QRCodeData = {
        id: qrId,
        type: 'promotion',
        promotionId: promotion.id,
        data: {
          promotion: {
            title: promotion.title,
            description: promotion.description,
            discountType: promotion.discountType,
            discountValue: promotion.discountValue,
            validUntil: promotion.validUntil,
            termsAndConditions: promotion.termsAndConditions,
          },
          redemptionCode: this.generateRedemptionCode(),
        },
        createdAt: new Date(),
        expiresAt: promotion.validUntil,
        scanCount: 0,
        maxScans: promotion.maxRedemptions,
        isActive: true,
        customBranding,
      };

      this.qrCodes.set(qrId, qrData);
      this.promotions.set(promotion.id, promotion);
      await Promise.all([this.saveQRCodes(), this.savePromotions()]);
      
      return qrData;
    } catch (error) {
      console.error('Error generating promotion QR:', error);
      throw error;
    }
  }

  async generateLoyaltyQR(
    customerId: string,
    loyaltyData: Omit<LoyaltyQR, 'id' | 'qrCodeId'>,
    customBranding?: QRBranding
  ): Promise<QRCodeData> {
    try {
      const loyaltyId = `loyalty_${customerId}_${Date.now()}`;
      const qrId = `loyalty_qr_${loyaltyId}`;
      
      const loyalty: LoyaltyQR = {
        id: loyaltyId,
        qrCodeId: qrId,
        ...loyaltyData,
      };
      
      const qrData: QRCodeData = {
        id: qrId,
        type: 'loyalty',
        data: {
          loyalty,
          securityCode: this.generateSecurityCode(),
        },
        createdAt: new Date(),
        scanCount: 0,
        isActive: true,
        customBranding,
      };

      this.qrCodes.set(qrId, qrData);
      this.loyaltyCards.set(customerId, loyalty);
      await Promise.all([this.saveQRCodes(), this.saveLoyaltyCards()]);
      
      return qrData;
    } catch (error) {
      console.error('Error generating loyalty QR:', error);
      throw error;
    }
  }

  async generateMenuQR(
    providerId: string,
    menuData: {
      services: { name: string; price: number; duration: string; description: string }[];
      specialOffers?: { title: string; description: string; validUntil: Date }[];
      contact: { phone: string; email: string; website?: string };
      hours: { [day: string]: string };
    },
    customBranding?: QRBranding
  ): Promise<QRCodeData> {
    try {
      const qrId = `menu_${providerId}_${Date.now()}`;
      
      const qrData: QRCodeData = {
        id: qrId,
        type: 'menu',
        providerId,
        data: {
          menu: menuData,
          lastUpdated: new Date(),
        },
        createdAt: new Date(),
        scanCount: 0,
        isActive: true,
        customBranding,
      };

      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
      
      return qrData;
    } catch (error) {
      console.error('Error generating menu QR:', error);
      throw error;
    }
  }

  // QR Code Scanning
  async processQRScan(
    qrCodeValue: string,
    scannerInfo: {
      userId?: string;
      location?: { latitude: number; longitude: number };
      device: string;
    }
  ): Promise<QRScanResult> {
    try {
      // Parse QR code value to extract QR ID
      const qrId = this.extractQRId(qrCodeValue);
      const qrData = this.qrCodes.get(qrId);
      
      if (!qrData) {
        return {
          success: false,
          error: 'Invalid or expired QR code',
        };
      }
      
      // Check if QR code is active and not expired
      if (!qrData.isActive) {
        return {
          success: false,
          error: 'QR code has been deactivated',
        };
      }
      
      if (qrData.expiresAt && qrData.expiresAt < new Date()) {
        return {
          success: false,
          error: 'QR code has expired',
        };
      }
      
      if (qrData.maxScans && qrData.scanCount >= qrData.maxScans) {
        return {
          success: false,
          error: 'QR code has reached maximum scan limit',
        };
      }
      
      // Update scan count and analytics
      await this.updateScanAnalytics(qrId, scannerInfo);
      
      // Process based on QR type
      const action = await this.generateScanAction(qrData, scannerInfo);
      
      return {
        success: true,
        data: qrData,
        action,
      };
    } catch (error) {
      console.error('Error processing QR scan:', error);
      return {
        success: false,
        error: 'Failed to process QR code',
      };
    }
  }

  private extractQRId(qrCodeValue: string): string {
    // In a real implementation, this would parse the QR code format
    // For now, assume the QR code value contains the ID
    try {
      const parsed = JSON.parse(qrCodeValue);
      return parsed.id || qrCodeValue;
    } catch {
      return qrCodeValue;
    }
  }

  private async generateScanAction(
    qrData: QRCodeData,
    scannerInfo: { userId?: string; location?: { latitude: number; longitude: number }; device: string }
  ): Promise<{ type: string; payload: any }> {
    switch (qrData.type) {
      case 'provider':
        return {
          type: 'navigate',
          payload: {
            screen: 'ProviderDetails',
            params: { providerId: qrData.providerId },
          },
        };
        
      case 'appointment':
        return {
          type: 'navigate',
          payload: {
            screen: 'AppointmentDetails',
            params: { appointmentId: qrData.appointmentId },
          },
        };
        
      case 'promotion':
        const promotion = this.promotions.get(qrData.promotionId!);
        if (promotion && promotion.currentRedemptions < promotion.maxRedemptions) {
          return {
            type: 'redeem',
            payload: {
              promotion,
              redemptionCode: qrData.data.redemptionCode,
            },
          };
        }
        return {
          type: 'navigate',
          payload: {
            screen: 'PromotionExpired',
          },
        };
        
      case 'loyalty':
        return {
          type: 'navigate',
          payload: {
            screen: 'LoyaltyCard',
            params: { loyaltyData: qrData.data.loyalty },
          },
        };
        
      case 'menu':
        return {
          type: 'menu',
          payload: {
            menuData: qrData.data.menu,
            providerId: qrData.providerId,
          },
        };
        
      default:
        return {
          type: 'navigate',
          payload: {
            screen: 'Home',
          },
        };
    }
  }

  private async updateScanAnalytics(
    qrId: string,
    scannerInfo: { userId?: string; location?: { latitude: number; longitude: number }; device: string }
  ): Promise<void> {
    try {
      // Update QR code scan count
      const qrData = this.qrCodes.get(qrId);
      if (qrData) {
        qrData.scanCount++;
        this.qrCodes.set(qrId, qrData);
      }
      
      // Update analytics
      let analytics = this.analytics.get(qrId);
      if (!analytics) {
        analytics = {
          qrId,
          totalScans: 0,
          uniqueScans: 0,
          scansByDate: [],
          scansByLocation: [],
          scansByDevice: [],
          conversionRate: 0,
        };
      }
      
      analytics.totalScans++;
      analytics.lastScanned = new Date();
      
      // Update scans by date
      const today = new Date().toISOString().split('T')[0];
      const dateEntry = analytics.scansByDate.find(entry => entry.date === today);
      if (dateEntry) {
        dateEntry.count++;
      } else {
        analytics.scansByDate.push({ date: today, count: 1 });
      }
      
      // Update scans by device
      const deviceEntry = analytics.scansByDevice.find(entry => entry.device === scannerInfo.device);
      if (deviceEntry) {
        deviceEntry.count++;
      } else {
        analytics.scansByDevice.push({ device: scannerInfo.device, count: 1 });
      }
      
      // Update scans by location (if available)
      if (scannerInfo.location) {
        const locationKey = `${scannerInfo.location.latitude.toFixed(2)},${scannerInfo.location.longitude.toFixed(2)}`;
        const locationEntry = analytics.scansByLocation.find(entry => entry.location === locationKey);
        if (locationEntry) {
          locationEntry.count++;
        } else {
          analytics.scansByLocation.push({ location: locationKey, count: 1 });
        }
      }
      
      this.analytics.set(qrId, analytics);
      
      await Promise.all([
        this.saveQRCodes(),
        this.saveAnalytics(),
      ]);
    } catch (error) {
      console.error('Error updating scan analytics:', error);
    }
  }

  // Premium QR Features
  async createCustomBrandedQR(
    baseQRData: Omit<QRCodeData, 'id' | 'createdAt' | 'scanCount' | 'isActive'>,
    branding: QRBranding
  ): Promise<QRCodeData> {
    try {
      const hasAccess = await PremiumService.hasFeatureAccess('custom_branding');
      if (!hasAccess) {
        throw new Error('Premium subscription required for custom branded QR codes');
      }
      
      const qrId = `custom_${baseQRData.type}_${Date.now()}`;
      
      const qrData: QRCodeData = {
        ...baseQRData,
        id: qrId,
        createdAt: new Date(),
        scanCount: 0,
        isActive: true,
        customBranding: branding,
      };
      
      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
      
      return qrData;
    } catch (error) {
      console.error('Error creating custom branded QR:', error);
      throw error;
    }
  }

  async getBatchQRAnalytics(qrIds: string[]): Promise<QRAnalytics[]> {
    try {
      const hasAccess = await PremiumService.hasFeatureAccess('analytics_access');
      if (!hasAccess) {
        throw new Error('Premium subscription required for detailed analytics');
      }
      
      return qrIds
        .map(id => this.analytics.get(id))
        .filter((analytics): analytics is QRAnalytics => analytics !== undefined);
    } catch (error) {
      console.error('Error getting batch QR analytics:', error);
      throw error;
    }
  }

  // Utility methods
  private generateCheckInCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateRedemptionCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private generateSecurityCode(): string {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  // Data persistence
  private async loadStoredData(): Promise<void> {
    try {
      await Promise.all([
        this.loadQRCodes(),
        this.loadAnalytics(),
        this.loadPromotions(),
        this.loadLoyaltyCards(),
      ]);
    } catch (error) {
      console.error('Error loading stored QR data:', error);
    }
  }

  private async saveQRCodes(): Promise<void> {
    try {
      const qrCodesArray = Array.from(this.qrCodes.entries()).map(([id, data]) => ([
        id,
        {
          ...data,
          createdAt: data.createdAt.toISOString(),
          expiresAt: data.expiresAt?.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('qr_codes', JSON.stringify(qrCodesArray));
    } catch (error) {
      console.error('Error saving QR codes:', error);
    }
  }

  private async loadQRCodes(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('qr_codes');
      if (stored) {
        const qrCodesArray = JSON.parse(stored);
        this.qrCodes = new Map(
          qrCodesArray.map(([id, data]: [string, any]) => [
            id,
            {
              ...data,
              createdAt: new Date(data.createdAt),
              expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
    }
  }

  private async saveAnalytics(): Promise<void> {
    try {
      const analyticsArray = Array.from(this.analytics.entries()).map(([id, data]) => ([
        id,
        {
          ...data,
          lastScanned: data.lastScanned?.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('qr_analytics', JSON.stringify(analyticsArray));
    } catch (error) {
      console.error('Error saving QR analytics:', error);
    }
  }

  private async loadAnalytics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('qr_analytics');
      if (stored) {
        const analyticsArray = JSON.parse(stored);
        this.analytics = new Map(
          analyticsArray.map(([id, data]: [string, any]) => [
            id,
            {
              ...data,
              lastScanned: data.lastScanned ? new Date(data.lastScanned) : undefined,
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading QR analytics:', error);
    }
  }

  private async savePromotions(): Promise<void> {
    try {
      const promotionsArray = Array.from(this.promotions.entries()).map(([id, data]) => ([
        id,
        {
          ...data,
          validFrom: data.validFrom.toISOString(),
          validUntil: data.validUntil.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('qr_promotions', JSON.stringify(promotionsArray));
    } catch (error) {
      console.error('Error saving QR promotions:', error);
    }
  }

  private async loadPromotions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('qr_promotions');
      if (stored) {
        const promotionsArray = JSON.parse(stored);
        this.promotions = new Map(
          promotionsArray.map(([id, data]: [string, any]) => [
            id,
            {
              ...data,
              validFrom: new Date(data.validFrom),
              validUntil: new Date(data.validUntil),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading QR promotions:', error);
    }
  }

  private async saveLoyaltyCards(): Promise<void> {
    try {
      const loyaltyArray = Array.from(this.loyaltyCards.entries());
      await AsyncStorage.setItem('qr_loyalty_cards', JSON.stringify(loyaltyArray));
    } catch (error) {
      console.error('Error saving loyalty cards:', error);
    }
  }

  private async loadLoyaltyCards(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('qr_loyalty_cards');
      if (stored) {
        const loyaltyArray = JSON.parse(stored);
        this.loyaltyCards = new Map(loyaltyArray);
      }
    } catch (error) {
      console.error('Error loading loyalty cards:', error);
    }
  }

  // Public API methods
  async getQRCode(qrId: string): Promise<QRCodeData | null> {
    return this.qrCodes.get(qrId) || null;
  }

  async getQRAnalytics(qrId: string): Promise<QRAnalytics | null> {
    return this.analytics.get(qrId) || null;
  }

  async getProviderQRCodes(providerId: string): Promise<QRCodeData[]> {
    return Array.from(this.qrCodes.values()).filter(
      qr => qr.providerId === providerId
    );
  }

  async deactivateQRCode(qrId: string): Promise<void> {
    const qrData = this.qrCodes.get(qrId);
    if (qrData) {
      qrData.isActive = false;
      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
    }
  }

  async reactivateQRCode(qrId: string): Promise<void> {
    const qrData = this.qrCodes.get(qrId);
    if (qrData) {
      qrData.isActive = true;
      this.qrCodes.set(qrId, qrData);
      await this.saveQRCodes();
    }
  }

  async deleteQRCode(qrId: string): Promise<void> {
    this.qrCodes.delete(qrId);
    this.analytics.delete(qrId);
    await Promise.all([
      this.saveQRCodes(),
      this.saveAnalytics(),
    ]);
  }

  async redeemPromotion(promotionId: string, customerId: string): Promise<boolean> {
    try {
      const promotion = this.promotions.get(promotionId);
      if (!promotion) {
        return false;
      }
      
      if (promotion.currentRedemptions >= promotion.maxRedemptions) {
        return false;
      }
      
      if (new Date() > promotion.validUntil) {
        return false;
      }
      
      promotion.currentRedemptions++;
      this.promotions.set(promotionId, promotion);
      await this.savePromotions();
      
      // Send notification about successful redemption
      await NotificationService.schedulePromotionalNotification(
        customerId,
        'Promotion Redeemed!',
        `You've successfully redeemed: ${promotion.title}`,
        new Date(Date.now() + 1000) // Immediate notification
      );
      
      return true;
    } catch (error) {
      console.error('Error redeeming promotion:', error);
      return false;
    }
  }
}

export default QRService.getInstance();}}}