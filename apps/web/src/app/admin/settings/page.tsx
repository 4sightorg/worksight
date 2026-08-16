'use client';

import { useAuth } from '@/auth';
import { AdminRoute } from '@/components/admin';
import { SessionTimer } from '@/components/features';
import { AppSidebar } from '@/components/main/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { sections } from '@/data/sections';
import { settingsApi } from '@/lib/api';
import { logAuditEvent } from '@/lib/audit-store';
import { UserSettings } from '@/lib/supabase';
import { Bell, Database, LogOut, Save, Settings, Shield, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function AdminSettingsContent() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadSettings = async () => {
      try {
        const userSettings = await settingsApi.get(user.id);
        setSettings(
          userSettings || {
            id: '',
            user_id: user.id,
            notifications_enabled: true,
            theme: 'system',
            survey_frequency: 'weekly',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        );
      } catch (error) {
        console.error('Failed to load admin settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const handleSave = async () => {
    if (!user || !settings) return;

    setSaving(true);
    try {
      const updatedSettings = await settingsApi.upsert(user.id, settings);
      setSettings(updatedSettings);
      logAuditEvent({
        actor: user.email || 'admin@worksight.com',
        action: 'SETTINGS_UPDATE',
        target: 'System Settings',
        details: `Updated system configuration: theme=${settings.theme}, survey_freq=${settings.survey_frequency}`,
        status: 'info',
      });
      toast.success('System settings saved successfully');
    } catch (error) {
      console.error('Failed to save admin settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: unknown) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar sections={sections.sections} defaultSection={sections.defaultSection} />
      <SidebarInset>
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>System Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <SessionTimer />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-orange-600" />
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
              </div>
              <p className="text-muted-foreground">
                Configure global administrative settings, preferences, and security policies
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Notification Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  System Notifications
                </CardTitle>
                <CardDescription>Manage global alert preferences and automated notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">System-wide Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Enable system alerts for high-risk burnout detection and critical updates
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings?.notifications_enabled || false}
                    onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>Default visual themes for the admin dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme Preference</Label>
                  <Select
                    value={settings?.theme || 'system'}
                    onValueChange={(value) => updateSetting('theme', value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Wellness Governance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Burnout & Survey Governance
                </CardTitle>
                <CardDescription>Configure organizational survey cadences and burnout thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="survey-frequency">Default Survey Reminders</Label>
                  <Select
                    value={settings?.survey_frequency || 'weekly'}
                    onValueChange={(value) => updateSetting('survey_frequency', value)}
                  >
                    <SelectTrigger id="survey-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Check-ins</SelectItem>
                      <SelectItem value="weekly">Weekly Cadence</SelectItem>
                      <SelectItem value="monthly">Monthly Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-500" />
                  Audit & Data Retention
                </CardTitle>
                <CardDescription>System backup policies and audit trail settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Audit Log Retention</Label>
                  <p className="text-muted-foreground text-sm">
                    System activity and security logs are preserved for 90 days in local storage/database.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminRoute requireAdmin>
      <AdminSettingsContent />
    </AdminRoute>
  );
}
