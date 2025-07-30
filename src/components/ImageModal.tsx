import React, { useEffect } from 'react';
import { X, Download, Trash2, Calendar, HardDrive } from 'lucide-react';
import { ImageData } from './ImageGallery';

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  image,
  onClose,
  onDelete,
  onDownload
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 truncate pr-4">
            {image.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 overflow-auto p-4">
          <img
            src={image.url}
            alt={image.name}
            className="max-w-full max-h-full object-contain mx-auto"
          />
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <HardDrive size={16} />
                <span>{formatFileSize(image.size)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(image.uploadDate)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onDownload}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                <span>ダウンロード</span>
              </button>
              <button
                onClick={onDelete}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                <span>削除</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};