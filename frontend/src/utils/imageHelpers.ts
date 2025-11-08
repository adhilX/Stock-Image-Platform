import type { ImageItem } from '../types/image.types';

/**
 * Format backend image to frontend format
 */
export const formatImage = (img: any): ImageItem => ({
  _id: img._id,
  id: img._id,
  title: img.title,
  url: img.image,
  image: img.image,
  order: img.order,
  userId: img.userId
});

/**
 * Extract filename without extension
 */
export const getFileName = (fileName: string) => fileName.replace(/\.[^/.]+$/, '');

/**
 * Find image by ID
 */
export const findImageById = (images: ImageItem[], id: string) =>
  images.find(img => img.id === id || img._id === id);

/**
 * Get image ID (handles both id and _id)
 */
export const getImageId = (image: ImageItem) => image.id || image._id || '';

/**
 * Reorder array by moving item from one index to another
 */
export const reorderArray = <T,>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const newArray = [...array];
  const [removed] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, removed);
  return newArray;
};

