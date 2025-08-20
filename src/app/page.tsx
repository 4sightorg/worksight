import { ModeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
          Welcome to WorkSight
        </h1>
        <h2 className="text-muted-foreground mt-4 max-w-xl text-center text-lg font-normal">
          Your personal dashboard to monitor burnout levels and foster well-being in the workplace.
        </h2>
        <div className="mt-8 flex gap-4">
          <Link href="/login">
            <Button>Log-in</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign up</Button>
          </Link>
        </div>
        <div className="fixed right-4 bottom-4 z-50">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
