import { motion } from 'framer-motion';
import { Trash2, Edit2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ImageItem } from '../../../types/image.types';

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_IMG;

interface UploadedImageCardProps {
  image: ImageItem;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UploadedImageCard({
  image,
  index: _index,
  onEdit,
  onDelete
}: UploadedImageCardProps) {
  const imageId = image.id || image._id || '';
  const imageUrl = `${CLOUDINARY_URL}/${image.image}`;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = 
    useSortable({ id: imageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : isOver ? 1.05 : 1,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative bg-black/50 rounded-xl border overflow-hidden transition-all duration-200 will-change-transform ${
        isDragging 
          ? 'border-green-500/60 opacity-50 cursor-grabbing z-50' 
          : isOver
          ? 'border-green-500/60 shadow-lg shadow-green-500/20 cursor-grab'
          : 'border-green-500/20 hover:border-green-500/40 cursor-grab'
      }`}
    >
      {/* Drag Handle - Visual indicator only */}
      <div
        className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        <GripVertical className="w-5 h-5 text-green-400" />
      </div>

      {/* Image */}
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        <img
          src={imageUrl}
          alt={image.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Title */}
      <div className="p-4">
        <h3 className="text-white font-medium mb-3 line-clamp-2">{image.title}</h3>
        
        {/* Action Buttons */}
        <div className="flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(imageId);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-300 border border-green-500/30"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(imageId);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Drag Overlay - Show on dragged item */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-green-500/20 border-2 border-green-500 border-dashed z-10 flex items-center justify-center rounded-xl"
        >
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-green-400 font-medium"
          >
            Dragging...
          </motion.p>
        </motion.div>
      )}

      {/* Drop Indicator - Show on drop target */}
      {isOver && !isDragging && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-green-500/10 border-2 border-green-500 border-solid z-10 rounded-xl"
        />
      )}
    </motion.div>
  );
}

