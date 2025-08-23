'use client';

import { useAuth } from '@/auth';
import { getStoredSession, isSessionExpiringSoon } from '@/auth/client';
import { AUTH_CONFIG } from '@/auth/config';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SessionTimer() {
  const { user, logout, extendCurrentSession } = useAuth();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!user) return;

    const updateTimer = () => {
      const session = getStoredSession();
      if (!session) {
        logout();
        return;
      }

      const now = Date.now();
      const timeout = session.saveLogin
        ? AUTH_CONFIG.EXTENDED_SESSION_TIMEOUT
        : AUTH_CONFIG.SESSION_TIMEOUT;
      const expirationTime = session.timestamp + timeout;
      const remaining = expirationTime - now;

      if (remaining <= 0) {
        logout();
        return;
      }

      // Format time remaining
      const minutes = Math.floor(remaining / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

      if (session.saveLogin) {
        // For 30-day sessions, show days and hours
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        setTimeLeft(`${days}d ${hours}h`);
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }

      // Check if expiring soon
      const expiringSoon = isSessionExpiringSoon();
      setIsExpiringSoon(expiringSoon);

      // Show warning for last minute of short sessions
      if (!session.saveLogin && remaining <= 60 * 1000 && remaining > 0) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user, logout]);

  const handleExtendSession = () => {
    const success = extendCurrentSession();
    if (success) {
      setShowWarning(false);
      setIsExpiringSoon(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {showWarning && (
        <div className="mb-2 rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-lg">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Session expiring soon!</span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExtendSession} className="text-xs">
              Extend Session
            </Button>
            <Button size="sm" variant="ghost" onClick={logout} className="text-xs">
              Logout
            </Button>
          </div>
        </div>
      )}

      <div
        className={`rounded-lg border bg-white p-2 shadow-lg ${isExpiringSoon ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
      >
        <div className="flex items-center gap-2 text-xs">
          <Clock className={`h-3 w-3 ${isExpiringSoon ? 'text-amber-600' : 'text-gray-500'}`} />
          <span className={isExpiringSoon ? 'font-medium text-amber-800' : 'text-gray-600'}>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}
