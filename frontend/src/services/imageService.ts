import { isAxiosError } from "axios";
import axiosInstance from "../axios/axiosInstance";
import type { SaveImageData, UpdateImageOrderData, UpdateImageData } from "../types/image.types";

export const saveImages = async (images: SaveImageData[]) => {
  try {
    const response = await axiosInstance.post("/images", { images }, {
      withCredentials: true
    });
    return response?.data;
  } catch (error) {
    console.log('error while saving images', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to save images');
    }
    throw new Error('An error occurred while saving images');
  }
};

export const getUserImages = async (page: number = 1, limit: number = 20) => {
  try {
    const response = await axiosInstance.get("/images", {
      params: { page, limit },
      withCredentials: true
    });
    return response?.data;
  } catch (error) {
    console.log('error while fetching images', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch images');
    }
    throw new Error('An error occurred while fetching images');
  }
};

export const updateImage = async (id: string, data: UpdateImageData) => {
  try {
    const response = await axiosInstance.put(`/images/${id}`, data, {
      withCredentials: true
    });
    return response?.data;
  } catch (error) {
    console.log('error while updating image', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update image');
    }
    throw new Error('An error occurred while updating image');
  }
};

export const deleteImage = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/images/${id}`, {
      withCredentials: true
    });
    return response?.data;
  } catch (error) {
    console.log('error while deleting image', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete image');
    }
    throw new Error('An error occurred while deleting image');
  }
};

export const updateImageOrder = async (images: UpdateImageOrderData[]) => {
  try {
    const response = await axiosInstance.put("/images/order/update", { images }, {
      withCredentials: true
    });
    return response?.data;
  } catch (error) {
    console.log('error while updating image order', error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update image order');
    }
    throw new Error('An error occurred while updating image order');
  }
};
