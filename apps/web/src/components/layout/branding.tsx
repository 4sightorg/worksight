import Image from 'next/image';
import Link from 'next/link';

export function Branding() {
  return (
    <Link href="/" className="flex items-center gap-2 self-center font-medium">
      <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
        <Image src="/images/logo.svg" alt="Logo" width="16" height="16" className="size-4" />
      </div>
      WorkSight
    </Link>
  );
}
