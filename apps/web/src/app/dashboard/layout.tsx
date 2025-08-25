'use client';

import { useAuth } from '@/auth';
import { isOfflineMode } from '@/auth/offline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, CheckSquare, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Dashboard overview and stats',
  },
  {
    name: 'My Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    description: 'Your assigned tasks and progress',
  },
  {
    name: 'Wellness',
    href: '/dashboard/wellness',
    icon: Activity,
    description: 'Wellness surveys and results',
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    description: 'Team reports and analytics',
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account and app settings',
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(isOfflineMode());
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  // Filter sidebar items based on user role
  const getFilteredSidebarItems = () => {
    if (!user) return sidebarItems;

    switch (user.role) {
      case 'guest':
        // Guests can only see wellness surveys and results
        return sidebarItems.filter((item) => ['Wellness', 'Settings'].includes(item.name));

      case 'employee':
        // Employees see overview, tasks, wellness, and settings
        return sidebarItems.filter((item) =>
          ['Overview', 'My Tasks', 'Wellness', 'Settings'].includes(item.name)
        );

      case 'manager':
        // Managers see everything except wellness (they manage reports instead)
        return sidebarItems.filter((item) =>
          ['Overview', 'My Tasks', 'Reports', 'Settings'].includes(item.name)
        );

      case 'exec':
        // Executives see overview, reports, and settings (high-level view)
        return sidebarItems.filter((item) =>
          ['Overview', 'Reports', 'Settings'].includes(item.name)
        );

      default:
        // Fallback to full menu
        return sidebarItems;
    }
  };

  const filteredSidebarItems = getFilteredSidebarItems();

  return (
    <div className="bg-background flex h-screen">
      {/* Sidebar */}
      <aside className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto border-r backdrop-blur">
        <div className="flex items-center justify-center gap-3 p-4 pb-3">
          <h1 className="text-xl font-bold">WorkSight</h1>
          {isOffline && <Badge variant="secondary">Offline</Badge>}
        </div>
        <nav className="space-y-2 border-t p-4">
          {filteredSidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:bg-accent hover:text-accent-foreground flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions - show for guests and employees */}
        {(user?.role === 'guest' || user?.role === 'employee') && (
          <div className="border-t p-4">
            <h3 className="mb-2 text-sm font-medium">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link href="/survey">
                  <Activity className="mr-2 h-4 w-4" />
                  Take Survey
                </Link>
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="ml-64 h-screen flex-1 overflow-y-auto">
        <div className="px-6 py-3">{children}</div>
      </main>
    </div>
  );
}
