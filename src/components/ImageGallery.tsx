import React, { useState } from 'react';
import { Trash2, Download, Eye, Calendar, HardDrive } from 'lucide-react';
import { ImageModal } from './ImageModal';

export interface ImageData {
  id: string;
  name: string;
  url: string;
  publicPath?: string;
  size: number;
  uploadDate: Date;
}

interface ImageGalleryProps {
  images: ImageData[];
  onDelete: (id: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDownload = (image: ImageData) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          画像がまだありません
        </h3>
        <p className="text-gray-600">
          上記のアップロードエリアから画像を追加してください
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => setSelectedImage(image)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="プレビュー"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDownload(image)}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="ダウンロード"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(image.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="削除"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate mb-2" title={image.name}>
                {image.name}
              </h3>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <HardDrive size={14} />
                  <span>{formatFileSize(image.size)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>{formatDate(image.uploadDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={() => {
            onDelete(selectedImage.id);
            setSelectedImage(null);
          }}
          onDownload={() => handleDownload(selectedImage)}
        />
      )}
    </>
  );
};