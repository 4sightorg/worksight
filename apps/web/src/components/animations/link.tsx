'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode } from 'react';

interface AnimatedLinkPropsExtended {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
  animationType?: 'slide' | 'fade' | 'scale' | 'bounce';
}

export function AnimatedLink({
  href,
  children,
  className = '',
  onClick,
  prefetch = true,
  animationType = 'scale',
}: AnimatedLinkPropsExtended) {
  const router = useRouter();

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Add a small delay for the click animation
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Navigate with router
    router.push(href);
  };

  const animationClasses = {
    slide:
      'transition-transform duration-200 hover:translate-x-1 active:scale-98 active:translate-x-0.5',
    fade: 'transition-opacity duration-200 hover:opacity-80 active:opacity-60',
    scale: 'transition-transform duration-200 hover:scale-105 active:scale-95',
    bounce:
      'transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 active:translate-y-0',
  };

  return (
    <div className="inline-block">
      <Link
        href={href}
        onClick={handleClick}
        className={cn(animationClasses[animationType], className)}
        prefetch={prefetch}
      >
        {children}
      </Link>
    </div>
  );
}

// Inline-safe animated link that uses span instead of div (for use inside p tags)
export function InlineAnimatedLink({
  href,
  children,
  className = '',
  onClick,
  prefetch = true,
  animationType = 'fade',
}: AnimatedLinkPropsExtended) {
  const router = useRouter();

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // Add a small delay for the click animation
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Navigate with router
    router.push(href);
  };

  const animationClasses = {
    slide: 'transition-transform duration-200 hover:translate-x-0.5 active:scale-98',
    fade: 'transition-opacity duration-200 hover:opacity-80 active:opacity-60',
    scale: 'transition-transform duration-200 hover:scale-102 active:scale-98',
    bounce:
      'transition-transform duration-200 hover:-translate-y-px active:scale-98 active:translate-y-0',
  };

  return (
    <span className="inline">
      <Link
        href={href}
        onClick={handleClick}
        className={cn(animationClasses[animationType], className)}
        prefetch={prefetch}
      >
        {children}
      </Link>
    </span>
  );
}

// Pre-configured link variants (block-level)
export function SlideLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <AnimatedLink {...props} animationType="slide" />;
}

export function FadeLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <AnimatedLink {...props} animationType="fade" />;
}

export function ScaleLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <AnimatedLink {...props} animationType="scale" />;
}

export function BounceLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <AnimatedLink {...props} animationType="bounce" />;
}

// Inline-safe pre-configured link variants (for use inside p tags)
export function InlineSlideLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <InlineAnimatedLink {...props} animationType="slide" />;
}

export function InlineFadeLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <InlineAnimatedLink {...props} animationType="fade" />;
}

export function InlineScaleLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <InlineAnimatedLink {...props} animationType="scale" />;
}

export function InlineBounceLink(props: Omit<AnimatedLinkPropsExtended, 'animationType'>) {
  return <InlineAnimatedLink {...props} animationType="bounce" />;
}
