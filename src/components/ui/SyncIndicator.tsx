'use client';

import React, { useState, useEffect } from 'react';
import { SyncManager } from '@/lib/sync';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const SyncIndicator: React.FC = () => {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const syncManager = SyncManager.getInstance();
    
    // Listen for sync events
    const unsubscribers = [
      syncManager.subscribe('students', () => {
        setIsSyncing(true);
        setLastSync(new Date());
        setTimeout(() => setIsSyncing(false), 1000);
      }),
      syncManager.subscribe('courses', () => {
        setIsSyncing(true);
        setLastSync(new Date());
        setTimeout(() => setIsSyncing(false), 1000);
      }),
      syncManager.subscribe('pickupLogs', () => {
        setIsSyncing(true);
        setLastSync(new Date());
        setTimeout(() => setIsSyncing(false), 1000);
      }),
      syncManager.subscribe('authorizedPersons', () => {
        setIsSyncing(true);
        setLastSync(new Date());
        setTimeout(() => setIsSyncing(false), 1000);
      }),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  if (!lastSync && !isSyncing) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50 transition-all duration-300 ${
      isSyncing ? 'scale-110 border-blue-300 bg-blue-50' : ''
    }`}>
      <div className="flex items-center space-x-2">
        {isSyncing ? (
          <>
            <ArrowPathIcon className="h-4 w-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700 font-medium">Sincronizando...</span>
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">
              Sincronizado {lastSync?.toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default SyncIndicator;
