import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import LiquidOverlay from '../ui/LiquidOverlay';

interface ImageUploadAreaProps {
  mousePosition: { x: number; y: number };
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ImageUploadArea = forwardRef<HTMLInputElement, ImageUploadAreaProps>(({
  mousePosition,
  onFileSelect,
  onDragOver,
  onDrop
}, ref) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mb-8"
    >
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 md:p-8 relative overflow-hidden">
        <LiquidOverlay mousePosition={mousePosition} />

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="w-6 h-6 text-green-400" />
            Bulk Upload Images
          </h2>
          
          <div
            className="border-2 border-dashed border-green-500/30 rounded-xl p-8 text-center hover:border-green-500/50 transition-all duration-300"
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              ref={ref}
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-green-400" />
              </motion.div>
              <div>
                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-400 text-sm">Multiple images supported (PNG, JPG, WEBP)</p>
              </div>
            </label>
          </div>

          <p className="text-gray-400 text-sm mt-4 text-center">
            Note: You can add a specific title for each image after selection
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ImageUploadArea.displayName = 'ImageUploadArea';

export default ImageUploadArea;

