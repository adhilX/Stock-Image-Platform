import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number };
}

export default function AnimatedBackground({ mousePosition }: AnimatedBackgroundProps) {
  const isTouchDevice = useRef(false);
  
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Use static position on touch devices to prevent flickering
  const x1 = isTouchDevice.current ? 0 : mousePosition.x * 0.02;
  const y1 = isTouchDevice.current ? 0 : mousePosition.y * 0.02;
  const x2 = isTouchDevice.current ? 0 : -mousePosition.x * 0.015;
  const y2 = isTouchDevice.current ? 0 : -mousePosition.y * 0.015;
  const x3 = isTouchDevice.current ? -160 : mousePosition.x * 0.01 - 160;
  const y3 = isTouchDevice.current ? -160 : mousePosition.y * 0.01 - 160;

  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 md:w-96 md:h-96 bg-green-500/20 rounded-full blur-3xl"
        style={{ willChange: 'transform, opacity' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: x1,
          y: y1,
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-3xl"
        style={{ willChange: 'transform, opacity' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
          x: x2,
          y: y2,
        }}
        transition={{
          scale: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-60 h-60 md:w-80 md:h-80 bg-green-400/10 rounded-full blur-3xl"
        style={{ willChange: 'transform, opacity' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: x3,
          y: y3,
        }}
        transition={{
          scale: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: {
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          },
          x: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: isTouchDevice.current ? undefined : {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
    </>
  );
}

