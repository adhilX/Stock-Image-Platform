import { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import AnimatedBackground from '../components/imageManagement/ui/AnimatedBackground';
import PageHeader from '../components/imageManagement/layout/PageHeader';
import Header from '../components/imageManagement/layout/Header';
import ImageUploadArea from '../components/imageManagement/upload/ImageUploadArea';
import PreviewSection from '../components/imageManagement/upload/PreviewSection';
import ImageGallery from '../components/imageManagement/gallery/ImageGallery';
import EditImageModal from '../components/imageManagement/modals/EditImageModal';
import DeleteConfirmModal from '../components/imageManagement/modals/DeleteConfirmModal';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { saveImages, getUserImages, updateImage, deleteImage, updateImageOrder } from '../services/imageService';
import { formatImage, getFileName, findImageById, getImageId, reorderArray } from '../utils/imageHelpers';
import type { ImageItem, PreviewImage } from '../types/image.types';

export default function ImageManagementPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserImages = async () => {
      try {
        setIsLoading(true);
        const response = await getUserImages();
        if (response?.images) {
          setSelectedImages(response.images.map(formatImage));
        }
      } catch (error) {
        console.error('Error loading images:', error);
        toast.error('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    };
    loadUserImages();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const processFiles = useCallback((files: FileList) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newPreviewImages: PreviewImage[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      title: getFileName(file.name)
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleTitleChange = (id: string, title: string) => {
    setPreviewImages(prev => prev.map(img => img.id === id ? { ...img, title } : img));
  };

  const handleRemovePreview = (id: string) => {
    setPreviewImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const handleCancel = () => {
    previewImages.forEach(img => URL.revokeObjectURL(img.preview));
    setPreviewImages([]);
  };

  const handleSubmit = async () => {
    if (previewImages.length === 0) return;

    setIsUploading(true);
    const uploadToast = toast.loading(`Uploading ${previewImages.length} image${previewImages.length > 1 ? 's' : ''}...`);

    try {
      const imagesToSave = await Promise.all(
        previewImages.map(async (previewImage, index) => ({
          image: await uploadToCloudinary(previewImage.file),
          title: previewImage.title,
          order: selectedImages.length + index
        }))
      );

      const response = await saveImages(imagesToSave);
      if (response?.images) {
        setSelectedImages(prev => [...prev, ...response.images.map(formatImage)]);
      }
      
      previewImages.forEach(img => URL.revokeObjectURL(img.preview));
      setPreviewImages([]);

      toast.success(`Successfully uploaded ${imagesToSave.length} image${imagesToSave.length > 1 ? 's' : ''}!`, {
        id: uploadToast
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload images. Please try again.', {
        id: uploadToast
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (id: string) => {
    const image = findImageById(selectedImages, id);
    if (image) {
      setSelectedImage(image);
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    const image = findImageById(selectedImages, id);
    if (image) {
      setSelectedImage(image);
      setDeleteModalOpen(true);
    }
  };

  const handleSaveEdit = async (id: string, data: { title: string; image?: string }) => {
    if (!id) return;

    try {
      const response = await updateImage(id, data);
      if (response?.image) {
        setSelectedImages(prev =>
          prev.map(img => (getImageId(img) === id) ? { ...img, ...formatImage(response.image) } : img)
        );
        toast.success('Image updated successfully');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update image');
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedImage) return;

    const imageId = getImageId(selectedImage);
    if (!imageId) return;

    try {
      await deleteImage(imageId);
      setSelectedImages(prev => prev.filter(img => getImageId(img) !== imageId));
      toast.success('Image deleted successfully');
      setDeleteModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
      throw error;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const previousImages = [...selectedImages];
    const draggedIndex = selectedImages.findIndex(img => getImageId(img) === active.id);
    const targetIndex = selectedImages.findIndex(img => getImageId(img) === over.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const reorderedImages = reorderArray(selectedImages, draggedIndex, targetIndex)
      .map((img, index) => ({ ...img, order: index }));

    setSelectedImages(reorderedImages);

    const orderUpdates = reorderedImages
      .map((img, index) => ({ id: getImageId(img), order: index }))
      .filter(item => item.id);

    if (orderUpdates.length > 0) {
      updateImageOrder(orderUpdates)
        .then(() => toast.success('Image order updated'))
        .catch((error) => {
          console.error('Error updating image order:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to update image order');
          setSelectedImages(previousImages);
        });
    }
  };

  return (
    <div 
      className="min-h-screen bg-black p-3 sm:p-4 md:p-8 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <AnimatedBackground mousePosition={mousePosition} />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <Header />
        <PageHeader />

        <ImageUploadArea
          ref={fileInputRef}
          mousePosition={mousePosition}
          onFileSelect={handleFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />

        <PreviewSection
          previewImages={previewImages}
          mousePosition={mousePosition}
          onTitleChange={handleTitleChange}
          onRemove={handleRemovePreview}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isUploading={isUploading}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4">Loading images...</p>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <ImageGallery
              images={selectedImages}
              mousePosition={mousePosition}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <EditImageModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedImage(null); }}
        image={selectedImage}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedImage(null); }}
        image={selectedImage}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
