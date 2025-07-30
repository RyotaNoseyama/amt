import React from 'react';
import { Image as ImageIcon, Server } from 'lucide-react';

interface HeaderProps {
  imageCount: number;
}

export const Header: React.FC<HeaderProps> = ({ imageCount }) => {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Server size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                画像公開サーバー
              </h1>
              <p className="text-sm text-gray-600">
                /publicディレクトリに画像を保存・公開
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{imageCount}</span> 枚の画像
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              /public/uploads/
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              オンライン
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};