import React from 'react';

// Real-time synchronization utilities
export class SyncManager {
  private static instance: SyncManager;
  private listeners: Map<string, ((data: unknown) => void)[]> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;
  private lastSync: number = 0;

  private constructor() {
    this.startPolling();
    this.setupStorageListener();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  // Subscribe to data changes
  subscribe(key: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Broadcast data change
  broadcast(key: string, data: unknown) {
    // Skip if we're on the server (no localStorage)
    if (typeof window === 'undefined') return;
    
    // Save to localStorage with timestamp
    const syncData = {
      data,
      timestamp: Date.now(),
      source: 'local'
    };
    
    localStorage.setItem(`sync_${key}`, JSON.stringify(syncData));
    
    // Notify local listeners
    this.notifyListeners(key, data);
  }

  // Get synced data
  getSyncedData(key: string) {
    // Skip if we're on the server (no localStorage)
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`sync_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data;
      }
    } catch (error) {
      console.error('Error reading synced data:', error);
    }
    return null;
  }

  private notifyListeners(key: string, data: unknown) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in sync callback:', error);
        }
      });
    }
  }

  private setupStorageListener() {
    // Listen for localStorage changes from other tabs/windows
    // Skip if we're on the server (no window object)
    if (typeof window === 'undefined') return;
    
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('sync_')) {
        const key = e.key.replace('sync_', '');
        if (e.newValue) {
          try {
            const syncData = JSON.parse(e.newValue);
            this.notifyListeners(key, syncData.data);
          } catch (error) {
            console.error('Error parsing storage event:', error);
          }
        }
      }
    });
  }

  private startPolling() {
    // Poll every 2 seconds for changes
    this.pollInterval = setInterval(() => {
      this.checkForUpdates();
    }, 2000);
  }

  private checkForUpdates() {
    // Check for updates in localStorage from other sessions
    // Skip if we're on the server (no localStorage)
    if (typeof window === 'undefined') return;
    
    const keys = ['students', 'courses', 'pickupLogs', 'authorizedPersons'];
    
    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(`sync_${key}`);
        if (stored) {
          const syncData = JSON.parse(stored);
          if (syncData.timestamp > this.lastSync) {
            this.notifyListeners(key, syncData.data);
          }
        }
      } catch (error) {
        console.error(`Error checking updates for ${key}:`, error);
      }
    });
    
    this.lastSync = Date.now();
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    this.listeners.clear();
  }
}

// Sync hooks for easy integration
export const useSyncData = <T>(key: string, initialData: T) => {
  const [data, setData] = React.useState<T>(() => {
    const syncManager = SyncManager.getInstance();
    const synced = syncManager.getSyncedData(key);
    return synced || initialData;
  });

  React.useEffect(() => {
    const syncManager = SyncManager.getInstance();
    
    const unsubscribe = syncManager.subscribe(key, (data: unknown) => {
      const newData = data as T;
      setData(newData);
    });

    return unsubscribe;
  }, [key]);

  const updateData = React.useCallback((newData: T) => {
    setData(newData);
    const syncManager = SyncManager.getInstance();
    syncManager.broadcast(key, newData);
  }, [key]);

  return [data, updateData] as const;
};
