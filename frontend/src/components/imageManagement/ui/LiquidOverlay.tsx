import { motion } from 'framer-motion';

interface LiquidOverlayProps {
  mousePosition: { x: number; y: number };
}

export default function LiquidOverlay({ mousePosition }: LiquidOverlayProps) {
  return (
    <motion.div
      className="absolute inset-0 opacity-30 pointer-events-none"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.15) 0%, transparent 50%)`
      }}
    />
  );
}

