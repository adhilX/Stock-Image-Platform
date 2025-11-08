import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import LiquidOverlay from '../ui/LiquidOverlay';
import PreviewImageCard from './PreviewImageCard';
import type { PreviewImage } from '../../../types/image.types';

interface PreviewSectionProps {
  previewImages: PreviewImage[];
  mousePosition: { x: number; y: number };
  onTitleChange: (id: string, title: string) => void;
  onRemove: (id: string) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
  isUploading?: boolean;
}

export default function PreviewSection({
  previewImages,
  mousePosition,
  onTitleChange,
  onRemove,
  onSubmit,
  onCancel,
  isUploading = false
}: PreviewSectionProps) {
  if (previewImages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mb-8"
    >
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 md:p-8 relative overflow-hidden">
        <LiquidOverlay mousePosition={mousePosition} />

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-green-400" />
            Preview Images ({previewImages.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {previewImages.map((image, index) => (
              <PreviewImageCard
                key={image.id}
                image={image}
                index={index}
                onTitleChange={onTitleChange}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex gap-4 justify-end">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onCancel}
              disabled={isUploading}
              className="px-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 text-gray-300 font-semibold rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ 
                scale: isUploading ? 1 : 1.03,
                boxShadow: isUploading ? "none" : "0 0 30px rgba(34, 197, 94, 0.7)"
              }}
              whileTap={{ scale: isUploading ? 1 : 0.97 }}
              onClick={onSubmit}
              disabled={isUploading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="relative z-10 flex items-center gap-2">
                {isUploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Uploading...
                  </>
                ) : (
                  'Submit Images'
                )}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

