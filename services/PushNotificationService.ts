import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Appointment } from '@/types';
import PremiumService from './PremiumService';
import OfflineService from './OfflineService';

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'appointment' | 'promotional' | 'reminder' | 'update' | 'marketing';
  variables: string[]; // e.g., ['customerName', 'appointmentTime', 'serviceName']
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromotionalCampaign {
  id: string;
  name: string;
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  targetAudience: {
    userTypes: ('customer' | 'provider')[];
    locations?: string[];
    ageRange?: { min: number; max: number };
    interests?: string[];
    loyaltyTiers?: string[];
    lastVisitDays?: number; // Target users who visited within X days
  };
  schedule: {
    type: 'immediate' | 'scheduled' | 'recurring';
    sendAt?: Date;
    timezone?: string;
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly';
      daysOfWeek?: number[]; // 0-6, Sunday = 0
      dayOfMonth?: number;
      endDate?: Date;
    };
  };
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    conversions: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPreferences {
  userId: string;
  appointmentReminders: boolean;
  promotionalOffers: boolean;
  newFeatures: boolean;
  providerUpdates: boolean;
  chatMessages: boolean;
  reviewRequests: boolean;
  loyaltyRewards: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:MM format
    endTime: string;
  };
  frequency: {
    promotional: 'none' | 'weekly' | 'daily';
    reminders: 'all' | 'important' | 'none';
  };
  updatedAt: Date;
}

export interface NotificationAnalytics {
  campaignId?: string;
  notificationId: string;
  userId: string;
  type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'dismissed';
  timestamp: Date;
  deviceInfo: {
    platform: string;
    version: string;
    model?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface ScheduledNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: any;
  scheduledFor: Date;
  type: 'appointment' | 'promotional' | 'reminder' | 'system';
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  campaignId?: string;
  createdAt: Date;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private expoPushToken: string | null = null;
  private templates: Map<string, NotificationTemplate> = new Map();
  private campaigns: Map<string, PromotionalCampaign> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private analytics: NotificationAnalytics[] = [];
  private scheduledNotifications: Map<string, ScheduledNotification> = new Map();

  private constructor() {
    this.initializeNotifications();
    this.loadStoredData();
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  // Initialization
  private async initializeNotifications(): Promise<void> {
    try {
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => {
          const { data } = notification.request.content;
          
          // Check user preferences
          const userId = data?.userId;
          if (userId) {
            const prefs = await this.getUserPreferences(userId);
            if (prefs && !this.shouldShowNotification(notification, prefs)) {
              return {
                shouldShowAlert: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
              };
            }
          }
          
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          };
        },
      });

      // Listen for notification interactions
      Notifications.addNotificationReceivedListener(this.handleNotificationReceived.bind(this));
      Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse.bind(this));

      // Register for push notifications
      await this.registerForPushNotifications();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async registerForPushNotifications(): Promise<void> {
    try {
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      
      // Store token for backend use
      await AsyncStorage.setItem('expo_push_token', token);
      
      console.log('Expo push token:', token);
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }

  // Notification Templates
  async createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    try {
      const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTemplate: NotificationTemplate = {
        ...template,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.templates.set(id, newTemplate);
      await this.saveTemplates();
      
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId: string, updates: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const updatedTemplate = {
        ...template,
        ...updates,
        updatedAt: new Date(),
      };

      this.templates.set(templateId, updatedTemplate);
      await this.saveTemplates();
      
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async getTemplates(category?: NotificationTemplate['category']): Promise<NotificationTemplate[]> {
    const templates = Array.from(this.templates.values());
    return category ? templates.filter(t => t.category === category) : templates;
  }

  // Promotional Campaigns
  async createCampaign(campaign: Omit<PromotionalCampaign, 'id' | 'status' | 'analytics' | 'createdAt' | 'updatedAt'>): Promise<PromotionalCampaign> {
    try {
      // Check premium access for advanced campaigns
      const hasAccess = await PremiumService.hasFeatureAccess('advanced_marketing');
      if (!hasAccess && campaign.targetAudience.locations) {
        throw new Error('Premium subscription required for location-based targeting');
      }

      const id = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newCampaign: PromotionalCampaign = {
        ...campaign,
        id,
        status: 'draft',
        analytics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          conversions: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.campaigns.set(id, newCampaign);
      await this.saveCampaigns();
      
      return newCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async scheduleCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = this.campaigns.get(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      if (campaign.status !== 'draft') {
        throw new Error('Only draft campaigns can be scheduled');
      }

      // Get target users
      const targetUsers = await this.getTargetUsers(campaign.targetAudience);
      
      if (targetUsers.length === 0) {
        throw new Error('No users match the target audience criteria');
      }

      // Schedule notifications for target users
      const notifications: ScheduledNotification[] = [];
      
      for (const user of targetUsers) {
        const prefs = await this.getUserPreferences(user.id);
        if (prefs && !prefs.promotionalOffers) {
          continue; // Skip users who opted out of promotional notifications
        }

        const scheduledFor = this.calculateScheduleTime(campaign.schedule, user);
        
        const notification: ScheduledNotification = {
          id: `notif_${campaignId}_${user.id}_${Date.now()}`,
          userId: user.id,
          title: this.personalizeContent(campaign.title, user),
          body: this.personalizeContent(campaign.body, user),
          data: {
            campaignId,
            deepLink: campaign.deepLink,
            imageUrl: campaign.imageUrl,
          },
          scheduledFor,
          type: 'promotional',
          status: 'pending',
          campaignId,
          createdAt: new Date(),
        };

        notifications.push(notification);
        this.scheduledNotifications.set(notification.id, notification);
      }

      // Update campaign status
      campaign.status = 'scheduled';
      campaign.updatedAt = new Date();
      this.campaigns.set(campaignId, campaign);

      await Promise.all([
        this.saveScheduledNotifications(),
        this.saveCampaigns(),
      ]);

      // Schedule actual notifications
      await this.processScheduledNotifications();
      
      console.log(`Campaign ${campaignId} scheduled for ${notifications.length} users`);
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      throw error;
    }
  }

  private async getTargetUsers(targetAudience: PromotionalCampaign['targetAudience']): Promise<User[]> {
    // In a real implementation, this would query the user database
    // For now, return mock users that match criteria
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        avatar: 'https://via.placeholder.com/100',
        location: { latitude: 40.7128, longitude: -74.0060 },
        preferences: { notifications: true, marketing: true },
      },
      {
        id: 'user2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        avatar: 'https://via.placeholder.com/100',
        location: { latitude: 34.0522, longitude: -118.2437 },
        preferences: { notifications: true, marketing: false },
      },
    ];

    return mockUsers.filter(user => {
      // Filter by user type (assuming all mock users are customers)
      if (!targetAudience.userTypes.includes('customer')) {
        return false;
      }

      // Filter by marketing preferences
      if (!user.preferences?.marketing) {
        return false;
      }

      // Add more filtering logic based on targetAudience criteria
      return true;
    });
  }

  private calculateScheduleTime(schedule: PromotionalCampaign['schedule'], user: User): Date {
    const now = new Date();
    
    switch (schedule.type) {
      case 'immediate':
        return new Date(now.getTime() + 60000); // 1 minute from now
      
      case 'scheduled':
        return schedule.sendAt || now;
      
      case 'recurring':
        // Calculate next occurrence based on recurring settings
        if (schedule.recurring?.frequency === 'weekly') {
          const nextWeek = new Date(now);
          nextWeek.setDate(now.getDate() + 7);
          return nextWeek;
        }
        return now;
      
      default:
        return now;
    }
  }

  private personalizeContent(content: string, user: User): string {
    return content
      .replace(/\{\{customerName\}\}/g, user.name)
      .replace(/\{\{firstName\}\}/g, user.name.split(' ')[0]);
  }

  // Notification Sending
  async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: any,
    options?: {
      sound?: boolean;
      badge?: number;
      priority?: 'default' | 'high';
      categoryId?: string;
    }
  ): Promise<string> {
    try {
      // Check user preferences
      const prefs = await this.getUserPreferences(userId);
      if (prefs && !this.shouldSendNotification(data?.type, prefs)) {
        console.log(`Notification blocked by user preferences for user ${userId}`);
        return '';
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { ...data, userId },
          sound: options?.sound !== false,
          badge: options?.badge,
          priority: options?.priority === 'high' ? Notifications.AndroidNotificationPriority.HIGH : Notifications.AndroidNotificationPriority.DEFAULT,
          categoryIdentifier: options?.categoryId,
        },
        trigger: null, // Send immediately
      });

      // Track analytics
      await this.trackNotificationEvent({
        notificationId,
        userId,
        type: 'sent',
        timestamp: new Date(),
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version.toString(),
        },
        campaignId: data?.campaignId,
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendBulkNotifications(
    notifications: {
      userId: string;
      title: string;
      body: string;
      data?: any;
    }[]
  ): Promise<{ success: number; failed: number; results: string[] }> {
    const results: string[] = [];
    let success = 0;
    let failed = 0;

    for (const notification of notifications) {
      try {
        const id = await this.sendNotification(
          notification.userId,
          notification.title,
          notification.body,
          notification.data
        );
        results.push(id);
        success++;
      } catch (error) {
        console.error(`Failed to send notification to ${notification.userId}:`, error);
        results.push('');
        failed++;
      }
    }

    return { success, failed, results };
  }

  // Scheduled Notifications Processing
  private async processScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      const pendingNotifications = Array.from(this.scheduledNotifications.values())
        .filter(notif => notif.status === 'pending' && notif.scheduledFor <= now);

      for (const notification of pendingNotifications) {
        try {
          await this.sendNotification(
            notification.userId,
            notification.title,
            notification.body,
            notification.data
          );

          notification.status = 'sent';
          this.scheduledNotifications.set(notification.id, notification);

          // Update campaign analytics
          if (notification.campaignId) {
            const campaign = this.campaigns.get(notification.campaignId);
            if (campaign) {
              campaign.analytics.sent++;
              this.campaigns.set(notification.campaignId, campaign);
            }
          }
        } catch (error) {
          console.error(`Failed to send scheduled notification ${notification.id}:`, error);
          notification.status = 'failed';
          this.scheduledNotifications.set(notification.id, notification);
        }
      }

      await Promise.all([
        this.saveScheduledNotifications(),
        this.saveCampaigns(),
      ]);
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  }

  // User Preferences
  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const existing = this.preferences.get(userId) || {
        userId,
        appointmentReminders: true,
        promotionalOffers: true,
        newFeatures: true,
        providerUpdates: true,
        chatMessages: true,
        reviewRequests: true,
        loyaltyRewards: true,
        quietHours: {
          enabled: false,
          startTime: '22:00',
          endTime: '08:00',
        },
        frequency: {
          promotional: 'weekly',
          reminders: 'all',
        },
        updatedAt: new Date(),
      };

      const updated = {
        ...existing,
        ...preferences,
        updatedAt: new Date(),
      };

      this.preferences.set(userId, updated);
      await this.savePreferences();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    return this.preferences.get(userId) || null;
  }

  private shouldShowNotification(
    notification: Notifications.Notification,
    preferences: NotificationPreferences
  ): boolean {
    const { data } = notification.request.content;
    const type = data?.type;

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (this.isInQuietHours(currentTime, preferences.quietHours)) {
        return false;
      }
    }

    // Check type-specific preferences
    switch (type) {
      case 'promotional':
        return preferences.promotionalOffers;
      case 'appointment':
        return preferences.appointmentReminders;
      case 'chat':
        return preferences.chatMessages;
      case 'review':
        return preferences.reviewRequests;
      case 'loyalty':
        return preferences.loyaltyRewards;
      default:
        return true;
    }
  }

  private shouldSendNotification(type: string, preferences: NotificationPreferences): boolean {
    switch (type) {
      case 'promotional':
        return preferences.promotionalOffers;
      case 'appointment':
        return preferences.appointmentReminders;
      case 'chat':
        return preferences.chatMessages;
      case 'review':
        return preferences.reviewRequests;
      case 'loyalty':
        return preferences.loyaltyRewards;
      default:
        return true;
    }
  }

  private isInQuietHours(currentTime: string, quietHours: NotificationPreferences['quietHours']): boolean {
    const current = this.timeToMinutes(currentTime);
    const start = this.timeToMinutes(quietHours.startTime);
    const end = this.timeToMinutes(quietHours.endTime);

    if (start <= end) {
      return current >= start && current <= end;
    } else {
      // Quiet hours span midnight
      return current >= start || current <= end;
    }
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Event Handlers
  private async handleNotificationReceived(notification: Notifications.Notification): Promise<void> {
    try {
      const { data } = notification.request.content;
      
      await this.trackNotificationEvent({
        notificationId: notification.request.identifier,
        userId: data?.userId || 'unknown',
        type: 'delivered',
        timestamp: new Date(),
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version.toString(),
        },
        campaignId: data?.campaignId,
      });
    } catch (error) {
      console.error('Error handling notification received:', error);
    }
  }

  private async handleNotificationResponse(response: Notifications.NotificationResponse): Promise<void> {
    try {
      const { notification, actionIdentifier } = response;
      const { data } = notification.request.content;
      
      // Track opened event
      await this.trackNotificationEvent({
        notificationId: notification.request.identifier,
        userId: data?.userId || 'unknown',
        type: 'opened',
        timestamp: new Date(),
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version.toString(),
        },
        campaignId: data?.campaignId,
      });

      // Handle deep linking
      if (data?.deepLink) {
        // In a real app, this would navigate to the specified screen
        console.log('Deep link:', data.deepLink);
      }

      // Handle action-specific responses
      if (actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) {
        console.log('Action taken:', actionIdentifier);
      }
    } catch (error) {
      console.error('Error handling notification response:', error);
    }
  }

  // Analytics
  private async trackNotificationEvent(event: NotificationAnalytics): Promise<void> {
    try {
      this.analytics.push(event);
      
      // Update campaign analytics
      if (event.campaignId) {
        const campaign = this.campaigns.get(event.campaignId);
        if (campaign) {
          switch (event.type) {
            case 'delivered':
              campaign.analytics.delivered++;
              break;
            case 'opened':
              campaign.analytics.opened++;
              break;
            case 'clicked':
              campaign.analytics.clicked++;
              break;
          }
          this.campaigns.set(event.campaignId, campaign);
        }
      }

      await Promise.all([
        this.saveAnalytics(),
        this.saveCampaigns(),
      ]);

      // Sync with offline service
      await OfflineService.queueAction({
        type: 'track_notification',
        data: event,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error tracking notification event:', error);
    }
  }

  async getCampaignAnalytics(campaignId: string): Promise<PromotionalCampaign['analytics'] | null> {
    const campaign = this.campaigns.get(campaignId);
    return campaign?.analytics || null;
  }

  async getNotificationAnalytics(startDate: Date, endDate: Date): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    deliveryRate: number;
    openRate: number;
    byType: { [type: string]: number };
    byDay: { date: string; count: number }[];
  }> {
    const filteredAnalytics = this.analytics.filter(
      event => event.timestamp >= startDate && event.timestamp <= endDate
    );

    const totalSent = filteredAnalytics.filter(e => e.type === 'sent').length;
    const totalDelivered = filteredAnalytics.filter(e => e.type === 'delivered').length;
    const totalOpened = filteredAnalytics.filter(e => e.type === 'opened').length;

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;

    // Group by type
    const byType: { [type: string]: number } = {};
    filteredAnalytics.forEach(event => {
      byType[event.type] = (byType[event.type] || 0) + 1;
    });

    // Group by day
    const byDay: { [date: string]: number } = {};
    filteredAnalytics.forEach(event => {
      const date = event.timestamp.toISOString().split('T')[0];
      byDay[date] = (byDay[date] || 0) + 1;
    });

    return {
      totalSent,
      totalDelivered,
      totalOpened,
      deliveryRate,
      openRate,
      byType,
      byDay: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    };
  }

  // Data Persistence
  private async loadStoredData(): Promise<void> {
    try {
      await Promise.all([
        this.loadTemplates(),
        this.loadCampaigns(),
        this.loadPreferences(),
        this.loadAnalytics(),
        this.loadScheduledNotifications(),
      ]);
    } catch (error) {
      console.error('Error loading stored notification data:', error);
    }
  }

  private async saveTemplates(): Promise<void> {
    try {
      const templatesArray = Array.from(this.templates.entries()).map(([id, template]) => ([
        id,
        {
          ...template,
          createdAt: template.createdAt.toISOString(),
          updatedAt: template.updatedAt.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('notification_templates', JSON.stringify(templatesArray));
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  }

  private async loadTemplates(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_templates');
      if (stored) {
        const templatesArray = JSON.parse(stored);
        this.templates = new Map(
          templatesArray.map(([id, template]: [string, any]) => [
            id,
            {
              ...template,
              createdAt: new Date(template.createdAt),
              updatedAt: new Date(template.updatedAt),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }

  private async saveCampaigns(): Promise<void> {
    try {
      const campaignsArray = Array.from(this.campaigns.entries()).map(([id, campaign]) => ([
        id,
        {
          ...campaign,
          schedule: {
            ...campaign.schedule,
            sendAt: campaign.schedule.sendAt?.toISOString(),
            recurring: campaign.schedule.recurring ? {
              ...campaign.schedule.recurring,
              endDate: campaign.schedule.recurring.endDate?.toISOString(),
            } : undefined,
          },
          createdAt: campaign.createdAt.toISOString(),
          updatedAt: campaign.updatedAt.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('notification_campaigns', JSON.stringify(campaignsArray));
    } catch (error) {
      console.error('Error saving campaigns:', error);
    }
  }

  private async loadCampaigns(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_campaigns');
      if (stored) {
        const campaignsArray = JSON.parse(stored);
        this.campaigns = new Map(
          campaignsArray.map(([id, campaign]: [string, any]) => [
            id,
            {
              ...campaign,
              schedule: {
                ...campaign.schedule,
                sendAt: campaign.schedule.sendAt ? new Date(campaign.schedule.sendAt) : undefined,
                recurring: campaign.schedule.recurring ? {
                  ...campaign.schedule.recurring,
                  endDate: campaign.schedule.recurring.endDate ? new Date(campaign.schedule.recurring.endDate) : undefined,
                } : undefined,
              },
              createdAt: new Date(campaign.createdAt),
              updatedAt: new Date(campaign.updatedAt),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  }

  private async savePreferences(): Promise<void> {
    try {
      const preferencesArray = Array.from(this.preferences.entries()).map(([id, prefs]) => ([
        id,
        {
          ...prefs,
          updatedAt: prefs.updatedAt.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('notification_preferences', JSON.stringify(preferencesArray));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_preferences');
      if (stored) {
        const preferencesArray = JSON.parse(stored);
        this.preferences = new Map(
          preferencesArray.map(([id, prefs]: [string, any]) => [
            id,
            {
              ...prefs,
              updatedAt: new Date(prefs.updatedAt),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }

  private async saveAnalytics(): Promise<void> {
    try {
      const analyticsData = this.analytics.map(event => ({
        ...event,
        timestamp: event.timestamp.toISOString(),
      }));
      await AsyncStorage.setItem('notification_analytics', JSON.stringify(analyticsData));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  private async loadAnalytics(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notification_analytics');
      if (stored) {
        this.analytics = JSON.parse(stored).map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  private async saveScheduledNotifications(): Promise<void> {
    try {
      const notificationsArray = Array.from(this.scheduledNotifications.entries()).map(([id, notif]) => ([
        id,
        {
          ...notif,
          scheduledFor: notif.scheduledFor.toISOString(),
          createdAt: notif.createdAt.toISOString(),
        },
      ]));
      await AsyncStorage.setItem('scheduled_notifications', JSON.stringify(notificationsArray));
    } catch (error) {
      console.error('Error saving scheduled notifications:', error);
    }
  }

  private async loadScheduledNotifications(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('scheduled_notifications');
      if (stored) {
        const notificationsArray = JSON.parse(stored);
        this.scheduledNotifications = new Map(
          notificationsArray.map(([id, notif]: [string, any]) => [
            id,
            {
              ...notif,
              scheduledFor: new Date(notif.scheduledFor),
              createdAt: new Date(notif.createdAt),
            },
          ])
        );
      }
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  }

  // Public API
  async getPushToken(): Promise<string | null> {
    return this.expoPushToken;
  }

  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      
      const notification = this.scheduledNotifications.get(notificationId);
      if (notification) {
        notification.status = 'cancelled';
        this.scheduledNotifications.set(notificationId, notification);
        await this.saveScheduledNotifications();
      }
    } catch (error) {
      console.error('Error cancelling scheduled notification:', error);
      throw error;
    }
  }

  async cancelCampaign(campaignId: string): Promise<void> {
    try {
      const campaign = this.campaigns.get(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Cancel all scheduled notifications for this campaign
      const campaignNotifications = Array.from(this.scheduledNotifications.values())
        .filter(notif => notif.campaignId === campaignId && notif.status === 'pending');

      for (const notification of campaignNotifications) {
        await this.cancelScheduledNotification(notification.id);
      }

      // Update campaign status
      campaign.status = 'cancelled';
      campaign.updatedAt = new Date();
      this.campaigns.set(campaignId, campaign);
      
      await this.saveCampaigns();
    } catch (error) {
      console.error('Error cancelling campaign:', error);
      throw error;
    }
  }

  // Start periodic processing
  startPeriodicProcessing(): void {
    // Process scheduled notifications every minute
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000);
  }
}

export default PushNotificationService.getInstance();}}}