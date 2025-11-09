import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

export default function PageHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-8"
    >
      <motion.div
        className="inline-block mb-4"
        whileHover={{ 
          scale: 1.1,
          rotate: [0, -5, 5, -5, 0],
        }}
        transition={{ 
          scale: { type: "spring", stiffness: 300 },
          rotate: { duration: 0.5 }
        }}
      >
        <motion.div 
          className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50"
          animate={{
            boxShadow: [
              "0 10px 30px rgba(34, 197, 94, 0.3)",
              "0 10px 40px rgba(34, 197, 94, 0.5)",
              "0 10px 30px rgba(34, 197, 94, 0.3)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ImageIcon className="w-8 h-8 text-white" />
        </motion.div>
      </motion.div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Image Management</h1>
      <p className="text-gray-400 text-sm sm:text-base">Upload, organize, and manage your stock images</p>
    </motion.div>
  );
}

