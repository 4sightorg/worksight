'use client';

import { motion } from 'motion/react';
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

  const animationVariants = {
    slide: {
      whileHover: { x: 5, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98, x: 2 },
    },
    fade: {
      whileHover: { opacity: 0.8, transition: { duration: 0.2 } },
      whileTap: { opacity: 0.6 },
    },
    scale: {
      whileHover: { scale: 1.05, transition: { duration: 0.2 } },
      whileTap: { scale: 0.95 },
    },
    bounce: {
      whileHover: {
        y: -2,
        transition: {
          duration: 0.2,
          type: 'spring' as const,
          stiffness: 400,
          damping: 10,
        },
      },
      whileTap: { scale: 0.95, y: 0 },
    },
  };

  return (
    <motion.div {...animationVariants[animationType]} className="inline-block">
      <Link href={href} onClick={handleClick} className={className} prefetch={prefetch}>
        {children}
      </Link>
    </motion.div>
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

  const animationVariants = {
    slide: {
      whileHover: { x: 2, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
    },
    fade: {
      whileHover: { opacity: 0.8, transition: { duration: 0.2 } },
      whileTap: { opacity: 0.6 },
    },
    scale: {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
    },
    bounce: {
      whileHover: {
        y: -1,
        transition: {
          duration: 0.2,
          type: 'spring' as const,
          stiffness: 400,
          damping: 10,
        },
      },
      whileTap: { scale: 0.98, y: 0 },
    },
  };

  return (
    <motion.span {...animationVariants[animationType]} className="inline">
      <Link href={href} onClick={handleClick} className={className} prefetch={prefetch}>
        {children}
      </Link>
    </motion.span>
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
