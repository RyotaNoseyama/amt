import React from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ImageGallery } from './components/ImageGallery';
import { useImageStorage } from './hooks/useImageStorage';
import { Loader2 } from 'lucide-react';

function App() {
  const { images, isLoading, addImages, deleteImage } = useImageStorage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
          <p className="text-gray-600">画像を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header imageCount={images.length} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ImageUpload onUpload={addImages} />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              アップロード済み画像
            </h2>
            {images.length > 0 && (
              <p className="text-gray-600">
                合計 {images.length} 枚
              </p>
            )}
          </div>
          
          <ImageGallery images={images} onDelete={deleteImage} />
        </div>
      </main>
    </div>
  );
}

export default App;