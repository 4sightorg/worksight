'use client';
import * as React from 'react';
import { SectionGroup } from '@/data/sections';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SiteHeader } from './navbar';
import { useSidebarStore } from '@/store/sidebar-store';
import { useAuth } from '@/store/auth-store';
import { TrendingUp } from 'lucide-react';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sections: SectionGroup[];
  defaultSection: string;
};

export function AppSidebar({ sections, defaultSection, ...props }: AppSidebarProps) {
  // Use Zustand store for activeItem
  const activeItem = useSidebarStore((state) => state.activeItem) || defaultSection;
  const setActiveItem = useSidebarStore((state) => state.setActiveItem);
  const { user } = useAuth();

  // Generate a random number with color for the stats card
  const randomNumber = React.useMemo(() => Math.floor(Math.random() * 100) + 1, []);
  const getRandomColor = () => {
    const colors = [
      'text-blue-600 bg-blue-50 border-blue-200',
      'text-green-600 bg-green-50 border-green-200',
      'text-purple-600 bg-purple-50 border-purple-200',
      'text-orange-600 bg-orange-50 border-orange-200',
      'text-red-600 bg-red-50 border-red-200',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const colorClass = React.useMemo(() => getRandomColor(), []);

  // Get user initials for avatar fallback
  const getUserInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SiteHeader />
      </SidebarHeader>
      <SidebarContent>
        {/* Random Stats Card */}
        <SidebarGroup>
          <SidebarGroupContent>
            <Card className={`border ${colorClass}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-70">Productivity</p>
                    <p className="text-2xl font-bold">{randomNumber}%</p>
                  </div>
                  <TrendingUp className="h-6 w-6 opacity-70" />
                </div>
              </CardContent>
            </Card>
          </SidebarGroupContent>
        </SidebarGroup>

        {sections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === item.title}
                      onClick={() => setActiveItem(item.title)}
                    >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Avatar and Info at Bottom */}
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="hover:bg-sidebar-accent flex items-center gap-3 rounded-lg p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name || user?.email} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
