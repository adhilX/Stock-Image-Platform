import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import LiquidOverlay from '../ui/LiquidOverlay';
import UploadedImageCard from './UploadedImageCard';
import type { ImageItem } from '../../../types/image.types';

interface ImageGalleryProps {
  images: ImageItem[];
  mousePosition: { x: number; y: number };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export default function ImageGallery({
  images,
  mousePosition,
  onEdit,
  onDelete,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore
}: ImageGalleryProps) {
  const imageIds = images.map(img => img.id || img._id || '').filter(Boolean);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || !onLoadMore || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: '200px', // Trigger 200px before the element is visible
        threshold: 0.1
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, onLoadMore, isFetchingNextPage]);
  
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <LiquidOverlay mousePosition={mousePosition} />
          <div className="relative z-10 text-center py-8 sm:py-12">
            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">No images uploaded yet</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Upload images using the section above</p>
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
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 p-4 sm:p-6 md:p-8 relative overflow-hidden">
        <LiquidOverlay mousePosition={mousePosition} />

        <div className="relative z-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            Your Uploaded Images
          </h2>

          <SortableContext items={imageIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
            
            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="py-6 flex justify-center">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading more images...</span>
                  </div>
                )}
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </motion.div>
  );
}

