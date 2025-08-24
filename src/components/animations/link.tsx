'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode } from 'react';

interface AnimatedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'slide' | 'fade' | 'scale' | 'bounce';
}

const linkVariants = {
  slide: {
    initial: { x: -10, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    whileHover: { x: 5, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    whileHover: { opacity: 0.8, transition: { duration: 0.2 } },
    whileTap: { opacity: 0.6 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 },
  },
  bounce: {
    initial: { y: -5, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    whileHover: { y: -2, transition: { duration: 0.2 } },
    whileTap: { y: 0 },
  },
};

export function AnimatedLinkComponent({
  href,
  children,
  className = '',
  variant = 'fade',
}: AnimatedLinkProps) {
  const variants = linkVariants[variant];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      whileTap="whileTap"
      variants={variants}
      className="inline-block"
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

// Alternative simpler animated link
interface AnimatedLinkProps {
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
}: AnimatedLinkProps) {
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

// Pre-configured link variants
export function SlideLink(props: Omit<AnimatedLinkProps, 'animationType'>) {
  return <AnimatedLink {...props} animationType="slide" />;
}

export function FadeLink(props: Omit<AnimatedLinkProps, 'animationType'>) {
  return <AnimatedLink {...props} animationType="fade" />;
}

export function ScaleLink(props: Omit<AnimatedLinkProps, 'animationType'>) {
  return <AnimatedLink {...props} animationType="scale" />;
}

export function BounceLink(props: Omit<AnimatedLinkProps, 'animationType'>) {
  return <AnimatedLink {...props} animationType="bounce" />;
}
