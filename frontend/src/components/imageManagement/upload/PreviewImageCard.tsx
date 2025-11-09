import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { PreviewImage } from '../../../types/image.types';

interface PreviewImageCardProps {
  image: PreviewImage;
  index: number;
  onTitleChange: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}

export default function PreviewImageCard({
  image,
  index,
  onTitleChange,
  onRemove
}: PreviewImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-black/50 rounded-xl border border-green-500/20 overflow-hidden hover:border-green-500/40 transition-all duration-300"
    >
      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4 text-white" />
      </motion.button>

      {/* Image Preview */}
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        <img
          src={image.preview}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title Input */}
      <div className="p-3 sm:p-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
          Image Title
        </label>
        <input
          type="text"
          value={image.title}
          onChange={(e) => onTitleChange(image.id, e.target.value)}
          className="w-full px-3 py-2 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 text-sm sm:text-base"
          placeholder="Enter image title"
        />
      </div>
    </motion.div>
  );
}

