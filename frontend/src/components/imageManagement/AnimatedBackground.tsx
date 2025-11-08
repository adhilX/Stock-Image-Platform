import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  mousePosition: { x: number; y: number };
}

export default function AnimatedBackground({ mousePosition }: AnimatedBackgroundProps) {
  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
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
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
          x: -mousePosition.x * 0.015,
          y: -mousePosition.y * 0.015,
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
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: mousePosition.x * 0.01 - 160,
          y: mousePosition.y * 0.01 - 160,
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
          x: {
            type: "spring",
            stiffness: 50,
            damping: 20
          },
          y: {
            type: "spring",
            stiffness: 50,
            damping: 20
          }
        }}
      />
    </>
  );
}

