'use client';

import { useAuth } from '@/auth';
import { isOfflineMode } from '@/auth/offline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  BarChart3,
  CheckSquare,
  FileText,
  Info,
  Settings,
  Shield,
  User,
} from 'lucide-react';
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
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [surveyData, setSurveyData] = useState<unknown>(null);

  useEffect(() => {
    setIsOffline(isOfflineMode());

    // Load latest survey results for burnout level
    const loadSurveyData = () => {
      const results = localStorage.getItem('survey_results');
      if (results) {
        try {
          const data = JSON.parse(results);
          setSurveyData(data);
        } catch (error) {
          console.error('Error parsing survey data:', error);
        }
      }
    };

    loadSurveyData();
  }, []);

  const getBurnoutLevel = (score: number) => {
    if (score < 40) return { level: 'Low', color: 'text-green-600' };
    if (score < 65) return { level: 'Moderate', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  // Get the burnout score with fallback handling
  const getBurnoutScore = () => {
    if (!surveyData) return null;

    // Try different possible property names
    return (
      surveyData.overallScore ||
      surveyData.totalScore ||
      surveyData.score ||
      surveyData.burnoutScore ||
      null
    );
  };

  const burnoutScore = getBurnoutScore();
  const currentBurnout =
    burnoutScore !== null
      ? getBurnoutLevel(burnoutScore)
      : { level: 'No Data', color: 'text-gray-500' };

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
      <aside className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r backdrop-blur">
        <div className="flex items-center justify-center gap-3 p-4 pb-3">
          <h1 className="text-xl font-bold">WorkSight</h1>
          {isOffline && <Badge variant="secondary">Offline</Badge>}
        </div>

        <div className="flex-1 overflow-y-auto">
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
        </div>
        {/* Burnout Level Card */}
        <div className="px-4 pt-2">
          <Card className="mb-4">
            <CardHeader>
              <p
                className={`text-muted-foreground text-center text-7xl font-bold ${currentBurnout.color}`}
              >
                {burnoutScore !== null
                  ? `${burnoutScore}%`
                  : 'Take a survey to see your burnout level'}
              </p>
            </CardHeader>
            <CardContent>
              <div className={`text-center text-lg font-bold ${currentBurnout.color}`}>
                {currentBurnout.level}
              </div>
              <CardTitle className="text-center text-sm font-medium">
                Current Burnout Level
              </CardTitle>
            </CardContent>
          </Card>
        </div>
        {/* Profile Section - Fixed at bottom */}
        <div className="relative mt-auto border-t p-3">
          {/* Expandable Profile Menu - Shows upward */}
          {isProfileExpanded && (
            <div className="absolute bottom-full left-3 right-3 mb-2">
              <Card className="border shadow-lg">
                <CardContent className="px-0 py-1">
                  <div className="space-y-0">
                    <Link
                      href="/settings"
                      className="hover:bg-accent flex items-center rounded px-3 py-1.5 text-sm transition-colors"
                    >
                      <Settings className="text-muted-foreground mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/about"
                      className="hover:bg-accent flex items-center rounded px-3 py-1.5 text-sm transition-colors"
                    >
                      <Info className="text-muted-foreground mr-3 h-4 w-4" />
                      <span>About</span>
                    </Link>
                    <Link
                      href="/help"
                      className="hover:bg-accent flex items-center rounded px-3 py-1.5 text-sm transition-colors"
                    >
                      <FileText className="text-muted-foreground mr-3 h-4 w-4" />
                      <span>Help & Support</span>
                    </Link>
                    <Link
                      href="/privacy"
                      className="hover:bg-accent flex items-center rounded px-3 py-1.5 text-sm transition-colors"
                    >
                      <Shield className="text-muted-foreground mr-3 h-4 w-4" />
                      <span>Privacy Policy</span>
                    </Link>
                    <div className="my-1 border-t"></div>
                    <Link
                      href="/login"
                      onClick={handleLogout}
                      className="hover:bg-accent flex items-center rounded px-3 py-1.5 text-sm transition-colors"
                    >
                      <span>Log Out</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Profile Trigger */}
          <Button
            variant="ghost"
            className="hover:bg-accent/50 h-auto w-full justify-start rounded p-2"
            onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          >
            <div className="flex w-full items-center gap-3">
              <div className="relative">
                <div className="bg-primary/10 border-primary/20 flex h-7 w-7 items-center justify-center rounded-full border">
                  <User className="text-primary h-3.5 w-3.5" />
                </div>
                <div className="border-background absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 bg-green-500"></div>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium">{user?.name || 'User'}</div>
                <div className="text-muted-foreground text-xs">{user?.email}</div>
              </div>
            </div>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 h-screen flex-1 overflow-y-auto">
        <div className="px-6 py-3">{children}</div>
      </main>
    </div>
  );
}
