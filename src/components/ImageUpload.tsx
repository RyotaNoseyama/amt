import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (images: File[]) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragOver ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            <Upload size={32} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              画像を/publicディレクトリにアップロード
            </h3>
            <p className="text-gray-600 mb-4">
              画像は/public/uploads/に保存され、公開URLでアクセス可能になります
            </p>
            
            <label className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              ファイルを選択
            </label>
          </div>
          
          <p className="text-sm text-gray-500">
            対応形式: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
    </div>
  );
};