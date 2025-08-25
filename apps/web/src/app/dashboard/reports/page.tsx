'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Team performance reports and insights</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Construction className="h-5 w-5" />
                Coming Soon
              </CardTitle>
              <CardDescription>This section is under development</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We&apos;re working on comprehensive reporting features including:
              </p>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>• Team productivity analytics</li>
                <li>• Burnout risk assessments</li>
                <li>• Work-life balance trends</li>
                <li>• Custom report generation</li>
                <li>• Data export capabilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
