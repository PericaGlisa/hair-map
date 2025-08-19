import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';
import NotificationService from './NotificationService';
import OfflineService from './OfflineService';

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  providerId: string;
  serviceId?: string;
  price?: number;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  date: Date;
  timeSlots: TimeSlot[];
  lastUpdated: Date;
  isOnline: boolean;
  nextAvailableSlot?: TimeSlot;
}

export interface AvailabilityUpdate {
  providerId: string;
  date: Date;
  updatedSlots: TimeSlot[];
  timestamp: Date;
  updateType: 'booking' | 'cancellation' | 'block' | 'unblock' | 'schedule_change';
}

export interface BookingRequest {
  id: string;
  customerId: string;
  providerId: string;
  timeSlotId: string;
  serviceId: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'rejected' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

class AvailabilityService {
  private static instance: AvailabilityService;
  private socket: Socket | null = null;
  private availabilityCache: Map<string, ProviderAvailability> = new Map();
  private pendingBookings: Map<string, BookingRequest> = new Map();
  private availabilityListeners: Map<string, (availability: ProviderAvailability) => void> = new Map();
  private isConnected = false;

  private constructor() {
    this.initializeSocket();
    this.loadCachedAvailability();
    this.startBookingExpirationCheck();
  }

  static getInstance(): AvailabilityService {
    if (!AvailabilityService.instance) {
      AvailabilityService.instance = new AvailabilityService();
    }
    return AvailabilityService.instance;
  }

  // Socket connection management
  private initializeSocket(): void {
    try {
      // In production, replace with your actual server URL
      this.socket = io('ws://localhost:3001', {
        transports: ['websocket'],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to availability server');
        this.isConnected = true;
        this.syncPendingUpdates();
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from availability server');
        this.isConnected = false;
      });

      this.socket.on('availability_update', (update: AvailabilityUpdate) => {
        this.handleAvailabilityUpdate(update);
      });

      this.socket.on('booking_confirmed', (booking: BookingRequest) => {
        this.handleBookingConfirmation(booking);
      });

      this.socket.on('booking_rejected', (booking: BookingRequest) => {
        this.handleBookingRejection(booking);
      });

      this.socket.on('provider_online', (providerId: string) => {
        this.updateProviderOnlineStatus(providerId, true);
      });

      this.socket.on('provider_offline', (providerId: string) => {
        this.updateProviderOnlineStatus(providerId, false);
      });

    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  // Real-time availability checking
  async getProviderAvailability(providerId: string, date: Date): Promise<ProviderAvailability | null> {
    try {
      const cacheKey = `${providerId}_${date.toDateString()}`;
      
      // Check cache first
      if (this.availabilityCache.has(cacheKey)) {
        const cached = this.availabilityCache.get(cacheKey)!;
        // Return cached data if it's less than 5 minutes old
        if (Date.now() - cached.lastUpdated.getTime() < 5 * 60 * 1000) {
          return cached;
        }
      }

      // Fetch fresh data
      if (this.isConnected && this.socket) {
        return new Promise((resolve) => {
          this.socket!.emit('get_availability', { providerId, date }, (availability: ProviderAvailability) => {
            if (availability) {
              this.availabilityCache.set(cacheKey, availability);
              this.cacheAvailability(availability);
            }
            resolve(availability);
          });
        });
      } else {
        // Return cached data if offline
        return this.availabilityCache.get(cacheKey) || null;
      }
    } catch (error) {
      console.error('Error getting provider availability:', error);
      return null;
    }
  }

  async getMultipleProviderAvailability(providerIds: string[], date: Date): Promise<ProviderAvailability[]> {
    try {
      const availabilities = await Promise.all(
        providerIds.map(id => this.getProviderAvailability(id, date))
      );
      return availabilities.filter(a => a !== null) as ProviderAvailability[];
    } catch (error) {
      console.error('Error getting multiple provider availability:', error);
      return [];
    }
  }

  async findAvailableSlots(
    providerIds: string[],
    date: Date,
    serviceDuration: number,
    preferredTimes?: { start: string; end: string }
  ): Promise<{ providerId: string; slots: TimeSlot[] }[]> {
    try {
      const availabilities = await this.getMultipleProviderAvailability(providerIds, date);
      
      return availabilities.map(availability => {
        let availableSlots = availability.timeSlots.filter(slot => 
          slot.isAvailable && !slot.isBlocked
        );

        // Filter by preferred times if specified
        if (preferredTimes) {
          const startTime = this.parseTimeString(preferredTimes.start);
          const endTime = this.parseTimeString(preferredTimes.end);
          
          availableSlots = availableSlots.filter(slot => {
            const slotStart = slot.startTime.getHours() * 60 + slot.startTime.getMinutes();
            return slotStart >= startTime && slotStart <= endTime;
          });
        }

        // Filter by service duration
        availableSlots = availableSlots.filter(slot => {
          const duration = (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60);
          return duration >= serviceDuration;
        });

        return {
          providerId: availability.providerId,
          slots: availableSlots,
        };
      });
    } catch (error) {
      console.error('Error finding available slots:', error);
      return [];
    }
  }

  // Booking management
  async requestBooking(
    providerId: string,
    timeSlotId: string,
    serviceId: string,
    customerId: string
  ): Promise<BookingRequest | null> {
    try {
      const bookingRequest: BookingRequest = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId,
        providerId,
        timeSlotId,
        serviceId,
        date: new Date(),
        status: 'pending',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        createdAt: new Date(),
      };

      this.pendingBookings.set(bookingRequest.id, bookingRequest);
      await this.savePendingBookings();

      if (this.isConnected && this.socket) {
        this.socket.emit('request_booking', bookingRequest);
      } else {
        // Queue for later when online
        await OfflineService.queueAction({
          type: 'create',
          entity: 'appointment',
          data: bookingRequest,
        });
      }

      // Schedule expiration notification
      await NotificationService.scheduleAppointmentReminder(
        bookingRequest.id,
        'Booking request expires soon',
        bookingRequest.expiresAt
      );

      return bookingRequest;
    } catch (error) {
      console.error('Error requesting booking:', error);
      return null;
    }
  }

  async cancelBookingRequest(bookingId: string): Promise<boolean> {
    try {
      const booking = this.pendingBookings.get(bookingId);
      if (!booking) {
        return false;
      }

      booking.status = 'expired';
      this.pendingBookings.delete(bookingId);
      await this.savePendingBookings();

      if (this.isConnected && this.socket) {
        this.socket.emit('cancel_booking_request', bookingId);
      }

      return true;
    } catch (error) {
      console.error('Error cancelling booking request:', error);
      return false;
    }
  }

  // Real-time updates handling
  private async handleAvailabilityUpdate(update: AvailabilityUpdate): Promise<void> {
    try {
      const cacheKey = `${update.providerId}_${update.date.toDateString()}`;
      const cached = this.availabilityCache.get(cacheKey);
      
      if (cached) {
        // Update the cached availability
        update.updatedSlots.forEach(updatedSlot => {
          const existingSlotIndex = cached.timeSlots.findIndex(slot => slot.id === updatedSlot.id);
          if (existingSlotIndex !== -1) {
            cached.timeSlots[existingSlotIndex] = updatedSlot;
          } else {
            cached.timeSlots.push(updatedSlot);
          }
        });
        
        cached.lastUpdated = update.timestamp;
        this.availabilityCache.set(cacheKey, cached);
        await this.cacheAvailability(cached);

        // Notify listeners
        const listener = this.availabilityListeners.get(update.providerId);
        if (listener) {
          listener(cached);
        }
      }

      // Send notification for significant changes
      if (update.updateType === 'cancellation') {
        await NotificationService.scheduleAvailabilityUpdate(
          `New slots available at ${update.providerId}`,
          new Date(Date.now() + 1000) // Immediate notification
        );
      }

      console.log('Availability updated:', update.updateType, update.providerId);
    } catch (error) {
      console.error('Error handling availability update:', error);
    }
  }

  private async handleBookingConfirmation(booking: BookingRequest): Promise<void> {
    try {
      const pendingBooking = this.pendingBookings.get(booking.id);
      if (pendingBooking) {
        pendingBooking.status = 'confirmed';
        this.pendingBookings.delete(booking.id);
        await this.savePendingBookings();

        await NotificationService.scheduleAppointmentReminder(
          booking.id,
          'Your booking has been confirmed!',
          new Date(Date.now() + 1000)
        );

        console.log('Booking confirmed:', booking.id);
      }
    } catch (error) {
      console.error('Error handling booking confirmation:', error);
    }
  }

  private async handleBookingRejection(booking: BookingRequest): Promise<void> {
    try {
      const pendingBooking = this.pendingBookings.get(booking.id);
      if (pendingBooking) {
        pendingBooking.status = 'rejected';
        this.pendingBookings.delete(booking.id);
        await this.savePendingBookings();

        await NotificationService.scheduleAppointmentReminder(
          booking.id,
          'Your booking request was declined. Please try another time slot.',
          new Date(Date.now() + 1000)
        );

        console.log('Booking rejected:', booking.id);
      }
    } catch (error) {
      console.error('Error handling booking rejection:', error);
    }
  }

  private async updateProviderOnlineStatus(providerId: string, isOnline: boolean): Promise<void> {
    try {
      // Update all cached availability for this provider
      for (const [key, availability] of this.availabilityCache.entries()) {
        if (availability.providerId === providerId) {
          availability.isOnline = isOnline;
          this.availabilityCache.set(key, availability);
        }
      }

      console.log(`Provider ${providerId} is now ${isOnline ? 'online' : 'offline'}`);
    } catch (error) {
      console.error('Error updating provider online status:', error);
    }
  }

  // Subscription management
  subscribeToProviderAvailability(
    providerId: string,
    callback: (availability: ProviderAvailability) => void
  ): () => void {
    const listenerId = `${providerId}_${Date.now()}`;
    this.availabilityListeners.set(listenerId, callback);

    if (this.isConnected && this.socket) {
      this.socket.emit('subscribe_availability', providerId);
    }

    return () => {
      this.availabilityListeners.delete(listenerId);
      if (this.isConnected && this.socket) {
        this.socket.emit('unsubscribe_availability', providerId);
      }
    };
  }

  // Cache management
  private async cacheAvailability(availability: ProviderAvailability): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('cached_availability');
      const cached = stored ? JSON.parse(stored) : {};
      
      const key = `${availability.providerId}_${availability.date.toDateString()}`;
      cached[key] = availability;
      
      await AsyncStorage.setItem('cached_availability', JSON.stringify(cached));
    } catch (error) {
      console.error('Error caching availability:', error);
    }
  }

  private async loadCachedAvailability(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('cached_availability');
      if (stored) {
        const cached = JSON.parse(stored);
        
        Object.entries(cached).forEach(([key, availability]) => {
          const typedAvailability = availability as ProviderAvailability;
          // Convert date strings back to Date objects
          typedAvailability.date = new Date(typedAvailability.date);
          typedAvailability.lastUpdated = new Date(typedAvailability.lastUpdated);
          typedAvailability.timeSlots.forEach(slot => {
            slot.startTime = new Date(slot.startTime);
            slot.endTime = new Date(slot.endTime);
          });
          
          this.availabilityCache.set(key, typedAvailability);
        });
      }
    } catch (error) {
      console.error('Error loading cached availability:', error);
    }
  }

  private async savePendingBookings(): Promise<void> {
    try {
      const bookingsArray = Array.from(this.pendingBookings.values());
      await AsyncStorage.setItem('pending_bookings', JSON.stringify(bookingsArray));
    } catch (error) {
      console.error('Error saving pending bookings:', error);
    }
  }

  private async loadPendingBookings(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('pending_bookings');
      if (stored) {
        const bookings = JSON.parse(stored) as BookingRequest[];
        bookings.forEach(booking => {
          // Convert date strings back to Date objects
          booking.date = new Date(booking.date);
          booking.expiresAt = new Date(booking.expiresAt);
          booking.createdAt = new Date(booking.createdAt);
          
          this.pendingBookings.set(booking.id, booking);
        });
      }
    } catch (error) {
      console.error('Error loading pending bookings:', error);
    }
  }

  // Utility methods
  private parseTimeString(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private async syncPendingUpdates(): Promise<void> {
    try {
      // Sync any pending booking requests
      for (const [id, booking] of this.pendingBookings.entries()) {
        if (booking.status === 'pending' && new Date() < booking.expiresAt) {
          this.socket?.emit('request_booking', booking);
        }
      }
    } catch (error) {
      console.error('Error syncing pending updates:', error);
    }
  }

  private startBookingExpirationCheck(): void {
    setInterval(async () => {
      const now = new Date();
      const expiredBookings: string[] = [];
      
      for (const [id, booking] of this.pendingBookings.entries()) {
        if (booking.status === 'pending' && now > booking.expiresAt) {
          booking.status = 'expired';
          expiredBookings.push(id);
        }
      }
      
      // Remove expired bookings
      expiredBookings.forEach(id => {
        this.pendingBookings.delete(id);
      });
      
      if (expiredBookings.length > 0) {
        await this.savePendingBookings();
        console.log(`Expired ${expiredBookings.length} booking requests`);
      }
    }, 60 * 1000); // Check every minute
  }

  // Public utility methods
  async getPendingBookings(): Promise<BookingRequest[]> {
    return Array.from(this.pendingBookings.values());
  }

  async getBookingStatus(bookingId: string): Promise<BookingRequest | null> {
    return this.pendingBookings.get(bookingId) || null;
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  async clearAvailabilityCache(): Promise<void> {
    try {
      this.availabilityCache.clear();
      await AsyncStorage.removeItem('cached_availability');
      console.log('Availability cache cleared');
    } catch (error) {
      console.error('Error clearing availability cache:', error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default AvailabilityService.getInstance();}}}