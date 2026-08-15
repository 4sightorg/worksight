export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

const AUDIT_STORAGE_KEY = 'worksight_admin_audit_logs';

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    actor: 'admin@worksight.com',
    action: 'SETTINGS_UPDATE',
    target: 'System Settings',
    details: 'Updated survey frequency default to weekly',
    status: 'info',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    actor: 'admin@worksight.com',
    action: 'USER_CREATE',
    target: 'User: Sarah Connor',
    details: 'Created new user account with engineering role',
    status: 'success',
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actor: 'admin@worksight.com',
    action: 'SURVEY_CREATE',
    target: 'Survey: Q3 Burnout & Workload Assessment',
    details: 'Published new wellness assessment survey template',
    status: 'success',
  },
  {
    id: 'audit-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    actor: 'system',
    action: 'SYSTEM_BACKUP',
    target: 'Database snapshot',
    details: 'Automated daily backup completed successfully',
    status: 'info',
  },
];

export function getAuditEvents(): AuditEvent[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read audit logs:', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
  const newEvent: AuditEvent = {
    ...event,
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const logs = getAuditEvents();
      const updated = [newEvent, ...logs];
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save audit log:', err);
    }
  }

  return newEvent;
}

export function clearAuditEvents(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }
}
