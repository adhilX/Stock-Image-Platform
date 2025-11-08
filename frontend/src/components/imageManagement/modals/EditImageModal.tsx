import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../../../utils/cloudinaryUpload';
import type { ImageItem } from '../../../types/image.types';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ImageItem | null;
  onSave: (id: string, data: { title: string; image?: string }) => Promise<void>;
}

export default function EditImageModal({ isOpen, onClose, image, onSave }: EditImageModalProps) {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_IMG;

  useEffect(() => {
    if (image) {
      setTitle(image.title);
      // Use cloudinary base URL if image path exists
      if (image.image) {
        setPreview(`${cloudinaryUrl}/${image.image}`);
      } else if (image.url) {
        // Fallback to url if image path doesn't exist
        setPreview(image.url);
      } else {
        setPreview('');
      }
      setSelectedFile(null);
    }
  }, [image, cloudinaryUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!image || !title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = image.image;

      // If a new file is selected, upload it to Cloudinary
      if (selectedFile) {
        setIsUploading(true);
        imageUrl = await uploadToCloudinary(selectedFile);
        setIsUploading(false);
      }

      await onSave(image._id || image.id || '', {
        title: title.trim(),
        image: imageUrl
      });

      // Clean up preview URL if it was created
      if (selectedFile && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }

      onClose();
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    // Clean up preview URL if it was created
    if (selectedFile && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFile(null);
    onClose();
  };

  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/20 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Edit Image</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Image Preview */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image Preview
              </label>
              <div className="relative aspect-video bg-zinc-800 rounded-xl overflow-hidden border border-green-500/20">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Change Image (Optional)
              </label>
              <input
                type="file"
                id="edit-image-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="edit-image-upload"
                className="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-green-500/30 hover:border-green-500/50 rounded-lg cursor-pointer transition-all duration-300"
              >
                <Upload className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm">
                  {selectedFile ? selectedFile.name : 'Choose new image'}
                </span>
              </label>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                placeholder="Enter image title"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-6 border-t border-green-500/20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-zinc-800/50 hover:bg-zinc-800 text-gray-300 font-semibold rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
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
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

