import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  scheduledTime?: Date;
  type: 'appointment_reminder' | 'promotional' | 'availability_update' | 'review_request';
}

class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });
      
      this.pushToken = token.data;
      await this.storePushToken(token.data);
      
      console.log('Push token:', token.data);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  private async storePushToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('pushToken', token);
    } catch (error) {
      console.error('Error storing push token:', error);
    }
  }

  async getPushToken(): Promise<string | null> {
    if (this.pushToken) {
      return this.pushToken;
    }

    try {
      const storedToken = await AsyncStorage.getItem('pushToken');
      this.pushToken = storedToken;
      return storedToken;
    } catch (error) {
      console.error('Error retrieving push token:', error);
      return null;
    }
  }

  async scheduleNotification(notification: NotificationData): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
        trigger: notification.scheduledTime
          ? { date: notification.scheduledTime }
          : null,
      });

      // Store notification for tracking
      await this.storeNotification(notificationId, notification);
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      await this.removeStoredNotification(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('scheduledNotifications');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  private async storeNotification(id: string, notification: NotificationData): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications');
      const notifications = stored ? JSON.parse(stored) : {};
      notifications[id] = notification;
      await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  private async removeStoredNotification(id: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('scheduledNotifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        delete notifications[id];
        await AsyncStorage.setItem('scheduledNotifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error removing stored notification:', error);
    }
  }

  // AI-powered appointment reminders
  async scheduleAppointmentReminder(
    appointmentId: string,
    appointmentDate: Date,
    providerName: string,
    serviceName: string
  ): Promise<void> {
    const reminderTimes = [
      { hours: 24, message: 'tomorrow' },
      { hours: 2, message: 'in 2 hours' },
      { hours: 0.5, message: 'in 30 minutes' },
    ];

    for (const reminder of reminderTimes) {
      const reminderTime = new Date(appointmentDate.getTime() - reminder.hours * 60 * 60 * 1000);
      
      if (reminderTime > new Date()) {
        await this.scheduleNotification({
          id: `${appointmentId}_${reminder.hours}h`,
          title: `Appointment Reminder`,
          body: `Your ${serviceName} appointment with ${providerName} is ${reminder.message}`,
          scheduledTime: reminderTime,
          type: 'appointment_reminder',
          data: { appointmentId, reminderType: `${reminder.hours}h` },
        });
      }
    }
  }

  // Promotional notifications
  async schedulePromotionalNotification(
    title: string,
    message: string,
    scheduledTime?: Date
  ): Promise<string> {
    return await this.scheduleNotification({
      id: `promo_${Date.now()}`,
      title,
      body: message,
      scheduledTime,
      type: 'promotional',
    });
  }

  // Real-time availability updates
  async sendAvailabilityUpdate(
    providerId: string,
    providerName: string,
    availableSlots: string[]
  ): Promise<void> {
    // This would typically be sent from a backend service
    // For demo purposes, we'll show a local notification
    await this.scheduleNotification({
      id: `availability_${providerId}_${Date.now()}`,
      title: 'New Availability!',
      body: `${providerName} has new time slots available: ${availableSlots.join(', ')}`,
      type: 'availability_update',
      data: { providerId, availableSlots },
    });
  }

  // Review request notifications
  async scheduleReviewRequest(
    appointmentId: string,
    providerName: string,
    appointmentDate: Date
  ): Promise<void> {
    // Schedule review request 24 hours after appointment
    const reviewRequestTime = new Date(appointmentDate.getTime() + 24 * 60 * 60 * 1000);
    
    await this.scheduleNotification({
      id: `review_${appointmentId}`,
      title: 'How was your experience?',
      body: `Please rate your recent appointment with ${providerName}`,
      scheduledTime: reviewRequestTime,
      type: 'review_request',
      data: { appointmentId, providerName },
    });
  }

  // Listen for notification responses
  addNotificationResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Listen for received notifications
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }
}

export default NotificationService.getInstance();