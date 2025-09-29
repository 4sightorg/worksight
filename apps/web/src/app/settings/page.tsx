'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Lock, Monitor, ShieldAlert, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                  <p className="text-muted-foreground">
                    Manage your account preferences and privacy settings
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <CardTitle>Profile</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your profile information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Display Name</label>
                        <p className="text-muted-foreground mt-1 text-sm">John Doe</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-muted-foreground mt-1 text-sm">john.doe@company.com</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings (always visible) */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Choose what notifications you want to receive</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Survey Reminders</label>
                          <p className="text-muted-foreground text-sm">
                            Get notified when surveys are available
                          </p>
                        </div>
                        <Switch checked={notifications} onCheckedChange={setNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Wellness Insights</label>
                          <p className="text-muted-foreground text-sm">
                            Receive weekly wellness reports
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance Settings with advanced subsection */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>Customize how WorkSight looks on your device</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Dark Mode</label>
                          <p className="text-muted-foreground text-sm">Use dark theme throughout the app</p>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                      </div>
                      <CollapsibleSection
                        title="Advanced Theme Options"
                        description="Fine tune visual density and motion preferences"
                      >
                        <div className="space-y-4 pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Reduced Motion</p>
                              <p className="text-muted-foreground text-xs">Minimize animations for accessibility</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Compact Spacing</p>
                              <p className="text-muted-foreground text-xs">Denser layout for large screens</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </CollapsibleSection>
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy & Data with progressive disclosure */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      <CardTitle>Privacy & Data</CardTitle>
                    </div>
                    <CardDescription>Control how your data is used and shared</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Analytics</label>
                          <p className="text-muted-foreground text-sm">Help improve WorkSight with usage data</p>
                        </div>
                        <Switch checked={analytics} onCheckedChange={setAnalytics} />
                      </div>
                      <CollapsibleSection
                        title="Advanced Data Controls"
                        description="Export, retention and consent history"
                      >
                        <div className="space-y-4 pt-1">
                          <div>
                            <p className="text-sm font-medium">Data Export</p>
                            <p className="text-muted-foreground mb-2 text-xs">Generate a portable JSON of your activity and survey data.</p>
                            <Button variant="outline" size="sm">Download My Data</Button>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Retention Policy</p>
                            <p className="text-muted-foreground mb-2 text-xs">We automatically prune raw telemetry after 90 days.</p>
                            <Button variant="ghost" size="sm">Learn more</Button>
                          </div>
                        </div>
                      </CollapsibleSection>
                    </div>
                  </CardContent>
                </Card>

                {/* Danger Zone collapsed by default */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-red-600" />
                      <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>Irreversible actions that affect your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CollapsibleSection
                      title="Account Deletion"
                      description="Permanently remove your account and associated data"
                    >
                      <div className="space-y-4 pt-1">
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          This action cannot be undone. All personal data, survey results and task
                          history will be permanently removed.
                        </p>
                        <Button variant="destructive" size="sm">Delete Account</Button>
                      </div>
                    </CollapsibleSection>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}
