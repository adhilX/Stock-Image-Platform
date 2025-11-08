/**
 * Image-related types
 */

// Frontend image item type
export interface ImageItem {
  _id?: string;
  id?: string;
  title: string;
  url?: string;
  image?: string;
  order: number;
  userId?: string;
}

// Preview image type (before upload)
export interface PreviewImage {
  id: string;
  file: File;
  preview: string;
  title: string;
}

// Backend image type
export interface IImage {
  _id?: string;
  userId: string;
  image: string;
  title: string;
  order: number;
}

// Image data for saving
export interface SaveImageData {
  image: string;
  title: string;
  order: number;
}

// Image order update data
export interface UpdateImageOrderData {
  id: string;
  order: number;
}

// Image update data
export interface UpdateImageData {
  image?: string;
  title?: string;
}

