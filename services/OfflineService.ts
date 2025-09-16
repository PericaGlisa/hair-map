import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Salon, Hairdresser, Appointment, Review } from '@/types';

export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'appointment' | 'review' | 'profile' | 'favorite';
  data: any;
  timestamp: Date;
  synced: boolean;
}

export interface SyncStatus {
  lastSyncTime: Date | null;
  pendingActions: number;
  isOnline: boolean;
  isSyncing: boolean;
}

class OfflineService {
  private static instance: OfflineService;
  private isOnline = true;
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private syncInProgress = false;

  private constructor() {
    this.initializeNetworkListener();
  }

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private initializeNetworkListener(): void {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      console.log('Network status changed:', this.isOnline ? 'Online' : 'Offline');
      
      // If we just came back online, trigger sync
      if (wasOffline && this.isOnline) {
        this.syncPendingActions();
      }
      
      this.notifySyncListeners();
    });
  }

  async initialize(): Promise<void> {
    // Check initial network status
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected ?? false;
    
    // Load cached data
    await this.loadCachedData();
    
    // Sync if online
    if (this.isOnline) {
      await this.syncPendingActions();
    }
  }

  // Cache management
  async cacheProviders(salons: Salon[], hairdressers: Hairdresser[]): Promise<void> {
    try {
      await AsyncStorage.setItem('cached_salons', JSON.stringify(salons));
      await AsyncStorage.setItem('cached_hairdressers', JSON.stringify(hairdressers));
      await AsyncStorage.setItem('cache_timestamp', new Date().toISOString());
    } catch (error) {
      console.error('Error caching providers:', error);
    }
  }

  async getCachedProviders(): Promise<{ salons: Salon[]; hairdressers: Hairdresser[] }> {
    try {
      const salonsData = await AsyncStorage.getItem('cached_salons');
      const hairdressersData = await AsyncStorage.getItem('cached_hairdressers');
      
      return {
        salons: salonsData ? JSON.parse(salonsData) : [],
        hairdressers: hairdressersData ? JSON.parse(hairdressersData) : [],
      };
    } catch (error) {
      console.error('Error getting cached providers:', error);
      return { salons: [], hairdressers: [] };
    }
  }

  async cacheAppointments(appointments: Appointment[]): Promise<void> {
    try {
      await AsyncStorage.setItem('cached_appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error('Error caching appointments:', error);
    }
  }

  async getCachedAppointments(): Promise<Appointment[]> {
    try {
      const data = await AsyncStorage.getItem('cached_appointments');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cached appointments:', error);
      return [];
    }
  }

  // Offline actions queue
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'synced'>): Promise<string> {
    const actionWithMeta: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      synced: false,
    };

    try {
      const stored = await AsyncStorage.getItem('offline_actions');
      const actions = stored ? JSON.parse(stored) : [];
      actions.push(actionWithMeta);
      await AsyncStorage.setItem('offline_actions', JSON.stringify(actions));
      
      console.log('Queued offline action:', actionWithMeta.type, actionWithMeta.entity);
      
      // Try to sync immediately if online
      if (this.isOnline) {
        this.syncPendingActions();
      }
      
      this.notifySyncListeners();
      return actionWithMeta.id;
    } catch (error) {
      console.error('Error queuing offline action:', error);
      throw error;
    }
  }

  async getPendingActions(): Promise<OfflineAction[]> {
    try {
      const stored = await AsyncStorage.getItem('offline_actions');
      const actions = stored ? JSON.parse(stored) : [];
      return actions.filter((action: OfflineAction) => !action.synced);
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }

  async syncPendingActions(): Promise<void> {
    if (!this.isOnline || this.syncInProgress) {
      return;
    }

    this.syncInProgress = true;
    this.notifySyncListeners();

    try {
      const pendingActions = await this.getPendingActions();
      console.log(`Syncing ${pendingActions.length} pending actions`);

      for (const action of pendingActions) {
        try {
          await this.syncAction(action);
          await this.markActionAsSynced(action.id);
        } catch (error) {
          console.error('Error syncing action:', action.id, error);
          // Continue with other actions even if one fails
        }
      }

      await this.updateLastSyncTime();
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.syncInProgress = false;
      this.notifySyncListeners();
    }
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    // In a real app, this would make API calls to your backend
    // For demo purposes, we'll simulate the sync
    
    console.log(`Syncing ${action.type} ${action.entity}:`, action.data);
    
    switch (action.entity) {
      case 'appointment':
        await this.syncAppointmentAction(action);
        break;
      case 'review':
        await this.syncReviewAction(action);
        break;
      case 'profile':
        await this.syncProfileAction(action);
        break;
      case 'favorite':
        await this.syncFavoriteAction(action);
        break;
      default:
        console.warn('Unknown entity type:', action.entity);
    }
  }

  private async syncAppointmentAction(action: OfflineAction): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch (action.type) {
      case 'create':
        console.log('Creating appointment on server:', action.data);
        // await api.createAppointment(action.data);
        break;
      case 'update':
        console.log('Updating appointment on server:', action.data);
        // await api.updateAppointment(action.data.id, action.data);
        break;
      case 'delete':
        console.log('Deleting appointment on server:', action.data.id);
        // await api.deleteAppointment(action.data.id);
        break;
    }
  }

  private async syncReviewAction(action: OfflineAction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (action.type) {
      case 'create':
        console.log('Creating review on server:', action.data);
        break;
      case 'update':
        console.log('Updating review on server:', action.data);
        break;
      case 'delete':
        console.log('Deleting review on server:', action.data.id);
        break;
    }
  }

  private async syncProfileAction(action: OfflineAction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Syncing profile changes:', action.data);
  }

  private async syncFavoriteAction(action: OfflineAction): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Syncing favorite changes:', action.data);
  }

  private async markActionAsSynced(actionId: string): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('offline_actions');
      const actions = stored ? JSON.parse(stored) : [];
      
      const actionIndex = actions.findIndex((a: OfflineAction) => a.id === actionId);
      if (actionIndex !== -1) {
        actions[actionIndex].synced = true;
        await AsyncStorage.setItem('offline_actions', JSON.stringify(actions));
      }
    } catch (error) {
      console.error('Error marking action as synced:', error);
    }
  }

  private async updateLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem('last_sync_time', new Date().toISOString());
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const stored = await AsyncStorage.getItem('last_sync_time');
      return stored ? new Date(stored) : null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }

  async getSyncStatus(): Promise<SyncStatus> {
    const pendingActions = await this.getPendingActions();
    const lastSyncTime = await this.getLastSyncTime();
    
    return {
      lastSyncTime,
      pendingActions: pendingActions.length,
      isOnline: this.isOnline,
      isSyncing: this.syncInProgress,
    };
  }

  private async loadCachedData(): Promise<void> {
    // Load any cached data that needs to be available immediately
    console.log('Loading cached data for offline use');
  }

  // Cleanup old synced actions
  async cleanupSyncedActions(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('offline_actions');
      const actions = stored ? JSON.parse(stored) : [];
      
      // Keep only unsynced actions and synced actions from last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const filteredActions = actions.filter((action: OfflineAction) => {
        return !action.synced || new Date(action.timestamp) > sevenDaysAgo;
      });
      
      await AsyncStorage.setItem('offline_actions', JSON.stringify(filteredActions));
      console.log(`Cleaned up ${actions.length - filteredActions.length} old synced actions`);
    } catch (error) {
      console.error('Error cleaning up synced actions:', error);
    }
  }

  // Event listeners
  addSyncListener(callback: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(callback);
    return () => {
      const index = this.syncListeners.indexOf(callback);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  private async notifySyncListeners(): Promise<void> {
    const status = await this.getSyncStatus();
    this.syncListeners.forEach(callback => callback(status));
  }

  // Utility methods
  isOnlineMode(): boolean {
    return this.isOnline;
  }

  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }

  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncPendingActions();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }

  async clearAllCache(): Promise<void> {
    try {
      const keys = [
        'cached_salons',
        'cached_hairdressers',
        'cached_appointments',
        'cache_timestamp',
        'offline_actions',
        'last_sync_time',
      ];
      
      await AsyncStorage.multiRemove(keys);
      console.log('All cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export default OfflineService.getInstance();