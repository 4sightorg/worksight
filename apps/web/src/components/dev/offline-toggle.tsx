// Environment configuration for WorkSight offline mode
'use client';

import { getOfflineUsers, isOfflineMode, setOfflineMode } from '@/auth/offline';
import { useEffect, useState } from 'react';

export function OfflineModeToggle() {
  const [isOffline, setIsOffline] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    setIsOffline(isOfflineMode());
  }, []);

  const toggleOfflineMode = () => {
    const newMode = !isOffline;
    setOfflineMode(newMode);
    setIsOffline(newMode);
    if (newMode) {
      setShowUsers(true);
    }
  };

  const offlineUsers = getOfflineUsers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">{isOffline ? '🔧 Offline Mode' : '🌐 Online Mode'}</p>
          <p className="text-muted-foreground text-xs">
            {isOffline ? 'Using local 4sight employee data' : 'Using Supabase authentication'}
          </p>
        </div>
        <button
          onClick={toggleOfflineMode}
          className="hover:bg-muted rounded-md border px-3 py-1 text-xs"
        >
          Switch to {isOffline ? 'Online' : 'Offline'}
        </button>
      </div>

      {isOffline && showUsers && (
        <div className="bg-muted/50 rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">👥 Available Test Users</h3>
          <p className="text-muted-foreground mb-3 text-xs">
            All users use password: <code className="bg-background rounded px-1">testuser</code>
          </p>
          <div className="space-y-2">
            {offlineUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono">{user.email}</span>
                  <span className="text-muted-foreground ml-2">({user.name})</span>
                </div>
                <span className="text-muted-foreground">{user.department}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
