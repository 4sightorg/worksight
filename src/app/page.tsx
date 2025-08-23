import { ClientOnly } from '@/components/client-only';
import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br">
      <div className="flex flex-col items-center px-4 text-center">
        <div className="mb-8">
          <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-bold tracking-tight text-balance lg:text-5xl lg:leading-[1.1] xl:text-6xl xl:tracking-tighter">
            Welcome to WorkSight
          </h1>
          <h2 className="text-muted-foreground mt-6 max-w-2xl text-center text-lg leading-relaxed font-normal lg:text-xl">
            Your personal dashboard to monitor burnout levels and foster well-being in the
            workplace.
          </h2>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link href="/login">
            <Button size="lg" className="min-w-[140px]">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="min-w-[140px]">
              Sign up
            </Button>
          </Link>
        </div>

        <div className="fixed right-4 bottom-4 z-50">
          <ClientOnly fallback={<div className="bg-muted h-8 w-8 animate-pulse rounded" />}>
            <ModeToggle />
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
