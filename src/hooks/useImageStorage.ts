import { useState, useCallback, useEffect } from 'react';
import { ImageData } from '../components/ImageGallery';
import { saveImageToPublic, getPublicImageUrl, deletePublicImage } from '../utils/fileUtils';

const STORAGE_KEY = 'gallery-images';

export const useImageStorage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load images from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedImages = JSON.parse(stored).map((img: any) => ({
          ...img,
          uploadDate: new Date(img.uploadDate)
        }));
        setImages(parsedImages);
      }
    } catch (error) {
      console.error('Failed to load images from storage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save images to localStorage whenever images change
  const saveToStorage = useCallback((imagesToSave: ImageData[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(imagesToSave));
    } catch (error) {
      console.error('Failed to save images to storage:', error);
    }
  }, []);

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageData[] = [];
    
    for (const file of files) {
      try {
        // Save image to public directory
        const publicPath = await saveImageToPublic(file);
        const url = getPublicImageUrl(publicPath);

        const imageData: ImageData = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url,
          publicPath,
          size: file.size,
          uploadDate: new Date()
        };

        newImages.push(imageData);
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
      }
    }

    if (newImages.length > 0) {
      setImages(prev => {
        const updated = [  ...newImages, ...prev];
        saveToStorage(updated);
        return updated;
      });
    }
  }, [saveToStorage]);

  const deleteImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToDelete = prev.find(img => img.id === id);
      if (imageToDelete?.publicPath) {
        deletePublicImage(imageToDelete.publicPath);
      }
      
      const updated = prev.filter(img => img.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearAllImages = useCallback(() => {
    // Clean up all public images
    images.forEach(image => {
      if (image.publicPath) {
        deletePublicImage(image.publicPath);
      }
    });
    
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    images,
    isLoading,
    addImages,
    deleteImage,
    clearAllImages
  };
};