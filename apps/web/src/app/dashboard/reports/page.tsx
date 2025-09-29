'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { ClientOnly } from '@/components/core';
import { DashboardSubNav } from '@/components/dashboard/sub-nav';
import { EmptyState } from '@/components/empty/empty-state';
import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="space-y-6 p-6">
          <DashboardSubNav
            aria-label="Reports sub navigation"
            items={[
              { label: 'Tasks', href: '/dashboard/tasks' },
              { label: 'Reports', href: '/dashboard/reports' },
              { label: 'Wellness', href: '/dashboard/wellness' },
            ]}
          />
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">Team performance reports and insights</p>
            </div>
          </div>

          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics arriving soon"
            description="Powerful team insights, burnout trend correlation, and exportable performance data will appear here once enabled."
            primaryAction={{ label: 'View Tasks', href: '/dashboard/tasks' }}
            secondaryAction={{ label: 'Product roadmap', href: '/about' }}
            illustration={<svg aria-hidden="true" className="mx-auto mt-6 h-28 w-28 opacity-30" viewBox="0 0 200 200">
              <rect x="30" y="110" width="24" height="60" rx="4" className="fill-primary/10" />
              <rect x="70" y="90" width="24" height="80" rx="4" className="fill-primary/15" />
              <rect x="110" y="70" width="24" height="100" rx="4" className="fill-primary/20" />
              <rect x="150" y="50" width="24" height="120" rx="4" className="fill-primary/25" />
              <circle cx="55" cy="105" r="6" className="fill-primary/40" />
              <circle cx="95" cy="85" r="6" className="fill-primary/50" />
              <circle cx="135" cy="65" r="6" className="fill-primary/60" />
              <circle cx="175" cy="45" r="6" className="fill-primary/70" />
            </svg>}
          />
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
