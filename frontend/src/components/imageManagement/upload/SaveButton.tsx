import { motion } from 'framer-motion';

interface SaveButtonProps {
  onClick: () => void;
}

export default function SaveButton({ onClick }: SaveButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mt-8 flex justify-center"
    >
      <motion.button
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 0 30px rgba(34, 197, 94, 0.7)"
        }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 relative overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <span className="relative z-10">Save Changes</span>
      </motion.button>
    </motion.div>
  );
}

