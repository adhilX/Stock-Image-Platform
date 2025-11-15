import { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
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

const IMAGES_PER_PAGE = 10;

export default function ImageManagementPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTouchDevice = useRef(false);
  const queryClient = useQueryClient();

  // Configure sensors for drag and drop (including touch support)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // Infinite query for images
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['userImages'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserImages(pageParam, IMAGES_PER_PAGE);
      return {
        images: response.data || response.images || [],
        hasMore: response.hasMore ?? false,
        page: response.page || pageParam,
        total: response.total || 0
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const selectedImages: ImageItem[] = data?.pages.flatMap(page => 
    page.images.map(formatImage)
  ) || [];

  useEffect(() => {
    // Detect if device is touch-enabled
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  useEffect(() => {
    if (error) {
      toast.error('Failed to load images');
    }
  }, [error]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip mouse move updates on touch devices to prevent flickering
    if (isTouchDevice.current) return;
    
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

      await saveImages(imagesToSave);
      
      previewImages.forEach(img => URL.revokeObjectURL(img.preview));
      setPreviewImages([]);

      // Invalidate and refetch images
      await queryClient.invalidateQueries({ queryKey: ['userImages'] });

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
      await updateImage(id, data);
      
      // Invalidate and refetch images
      await queryClient.invalidateQueries({ queryKey: ['userImages'] });
      
      toast.success('Image updated successfully');
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
      
      // Invalidate and refetch images
      await queryClient.invalidateQueries({ queryKey: ['userImages'] });
      
      toast.success('Image deleted successfully');
      setDeleteModalOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
      throw error;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedIndex = selectedImages.findIndex(img => getImageId(img) === active.id);
    const targetIndex = selectedImages.findIndex(img => getImageId(img) === over.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Optimistically update the cache
    queryClient.setQueryData(['userImages'], (oldData: any) => {
      if (!oldData) return oldData;

      const allImages = oldData.pages.flatMap((page: any) => page.images || []);
      const reorderedImages = reorderArray(allImages, draggedIndex, targetIndex)
        .map((img: any, index: number) => ({ ...img, order: index }));

      // Reconstruct pages with updated order
      const newPages = [];
      let currentIndex = 0;
      for (const page of oldData.pages) {
        const pageImages = reorderedImages.slice(currentIndex, currentIndex + (page.images?.length || 0));
        newPages.push({
          ...page,
          images: pageImages
        });
        currentIndex += pageImages.length;
      }

      return {
        ...oldData,
        pages: newPages
      };
    });

    const reorderedImages = reorderArray(selectedImages, draggedIndex, targetIndex)
      .map((img, index) => ({ ...img, order: index }));

    const orderUpdates = reorderedImages
      .map((img, index) => ({ id: getImageId(img), order: index }))
      .filter(item => item.id);

    if (orderUpdates.length > 0) {
      try {
        await updateImageOrder(orderUpdates);
        // Invalidate to ensure sync with backend
        await queryClient.invalidateQueries({ queryKey: ['userImages'] });
      } catch (error) {
        console.error('Error updating image order:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to update image order');
        // Refetch on error to restore correct state
        await queryClient.invalidateQueries({ queryKey: ['userImages'] });
      }
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
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <ImageGallery
              images={selectedImages}
              mousePosition={mousePosition}
              onEdit={handleEdit}
              onDelete={handleDelete}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={fetchNextPage}
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
