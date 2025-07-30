// File utility functions for handling image uploads to public directory

export const saveImageToPublic = async (file: File): Promise<string> => {
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);
  const extension = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${randomId}.${extension}`;
  const publicPath = `/uploads/${filename}`;
  
  try {
    // Convert file to base64 for storage
    const base64Data = await fileToBase64(file);
    
    // In a real server environment, you would save the file to the filesystem
    // For this demo, we'll simulate saving to public directory by storing in localStorage
    // with a reference to the public path
    const imageData = {
      filename,
      publicPath,
      base64Data,
      originalName: file.name,
      size: file.size,
      type: file.type
    };
    
    // Store the file data with public path reference
    localStorage.setItem(`public_image_${filename}`, JSON.stringify(imageData));
    
    // Create a blob URL that simulates the public path
    const blob = new Blob([await base64ToBlob(base64Data)], { type: file.type });
    const blobUrl = URL.createObjectURL(blob);
    
    // Store mapping of public path to blob URL
    localStorage.setItem(`public_url_${publicPath}`, blobUrl);
    
    return publicPath;
  } catch (error) {
    console.error('Failed to save image to public directory:', error);
    throw new Error('Failed to save image');
  }
};

export const getPublicImageUrl = (publicPath: string): string => {
  // In a real server, this would just return the public path
  // For demo purposes, we return the stored blob URL
  const storedUrl = localStorage.getItem(`public_url_${publicPath}`);
  return storedUrl || publicPath;
};

export const deletePublicImage = (publicPath: string): void => {
  const filename = publicPath.split('/').pop();
  if (filename) {
    // Remove from localStorage (simulating file deletion)
    localStorage.removeItem(`public_image_${filename}`);
    
    // Clean up blob URL
    const blobUrl = localStorage.getItem(`public_url_${publicPath}`);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      localStorage.removeItem(`public_url_${publicPath}`);
    }
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const base64ToBlob = async (base64: string): Promise<Uint8Array> => {
  const response = await fetch(`data:image/jpeg;base64,${base64}`);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};