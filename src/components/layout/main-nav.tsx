'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';

export function MainNav() {
  const sections = ['Employee', 'Manager'];
  const defaultSection = sections[0];
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = React.useState(defaultSection);

  return (
    <div className="mr-4 ml-4 hidden md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="">{selectedSection}</span>
            </div>
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
          {sections.map((version) => (
            <DropdownMenuItem key={version} onSelect={() => setSelectedSection(version)}>
              {version} {version === selectedSection && <Check className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Button variant="ghost" size="icon" className="h-8 w-8 px-0">
          <Image
            src="/assets/icon.svg"
            className="h-6 w-6"
            width={24}
            height={24}
            alt="Site Icon"
          />
          <span className="sr-only hidden font-bold lg:inline-block">{siteConfig.name}</span>
        </Button>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Button variant="ghost">
          <Link
            href="/dashboard"
            className={cn(
              'hover:text-foreground/80 transition-colors',
              pathname?.startsWith('/themes') ? 'text-foreground' : 'text-foreground/80'
            )}
          >
            Dashboard
          </Link>
        </Button>
      </nav>
    </div>
  );
}
