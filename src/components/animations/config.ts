// Motion configuration for better performance in production
export const motionConfig = {
  // Reduce motion for better performance and accessibility
  reduce:
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  // Simplified animations for production
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },

  slideIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 },
  },

  // List animations with reduced complexity
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },

  listItem: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
};

// Conditional motion props based on user preferences
export const getMotionProps = (animationType: keyof typeof motionConfig) => {
  if (motionConfig.reduce) {
    return {
      initial: false,
      animate: { opacity: 1 },
      transition: { duration: 0.1 },
    };
  }

  return motionConfig[animationType];
};
