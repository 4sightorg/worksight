'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ArrowLeft, Heart, Target, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <ProtectedRoute>
      <ClientOnly>
        <SidebarProvider>
          <SidebarInset>
            <div className="flex flex-1 flex-col space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">About WorkSight</h1>
                  <p className="text-muted-foreground">Learn more about our mission and values</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <CardTitle>Our Mission</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      WorkSight is dedicated to improving workplace wellbeing by providing tools and
                      insights to help organizations identify and prevent employee burnout before it
                      becomes a serious issue.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <CardTitle>Our Values</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-muted-foreground space-y-1 text-sm">
                      <li>• Employee wellbeing first</li>
                      <li>• Data-driven insights</li>
                      <li>• Privacy and transparency</li>
                      <li>• Continuous improvement</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <CardTitle>Our Goal</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      To create healthier, more productive workplaces by empowering employees and
                      managers with the tools they need to maintain optimal work-life balance.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Support</h4>
                      <p className="text-muted-foreground text-sm">
                        Email: support@worksight.app
                        <br />
                        Phone: +1 (555) 123-4567
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Version</h4>
                      <p className="text-muted-foreground text-sm">
                        WorkSight v1.0.0
                        <br />
                        Last updated: August 2025
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ClientOnly>
    </ProtectedRoute>
  );
}
