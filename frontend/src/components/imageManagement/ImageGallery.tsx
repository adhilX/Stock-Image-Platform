import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import LiquidOverlay from './LiquidOverlay';
import UploadedImageCard from './UploadedImageCard';
import type { ImageItem } from '../../types/image.types';

interface ImageGalleryProps {
  images: ImageItem[];
  mousePosition: { x: number; y: number };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ImageGallery({
  images,
  mousePosition,
  onEdit,
  onDelete
}: ImageGalleryProps) {
  const imageIds = images.map(img => img.id || img._id || '').filter(Boolean);
  
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 md:p-8 relative overflow-hidden">
          <LiquidOverlay mousePosition={mousePosition} />
          <div className="relative z-10 text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No images uploaded yet</p>
            <p className="text-gray-500 text-sm mt-2">Upload images using the section above</p>
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-6 md:p-8 relative overflow-hidden">
        <LiquidOverlay mousePosition={mousePosition} />

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-green-400" />
            Your Uploaded Images
          </h2>

          <SortableContext items={imageIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, index) => (
                <UploadedImageCard
                  key={image.id || image._id || index}
                  image={image}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </motion.div>
  );
}

