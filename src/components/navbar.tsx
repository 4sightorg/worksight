import { ModeToggle } from './theme-toggle';
import { Button } from './ui/button';
import Link from 'next/link';
import { SiGithub } from 'react-icons/si';
import { ViewSwitcher } from './version-switcher';
import { sections } from '@/data/sections';

export function SiteHeader() {
  return (
    <header className="border-grid sticky top-0 z-50 w-full">
      <div className="container-wrapper">
        <div className="container flex h-14">
          <ViewSwitcher views={sections.parts} defaultSection={sections.defaultPart} />
          <div className="flex items-center gap-2">
            <nav className="5 flex items-center gap-0">
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 px-0">
                <Link
                  href="https://github.com/4sightorg/worksight"
                  target="_blank"
                  rel="noreferrer"
                >
                  <SiGithub className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
