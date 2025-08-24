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

        <div className="fixed bottom-6 z-50 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
