import React from 'react';
import { BsDownload, BsX } from 'react-icons/bs';

const ImageViewer = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.substring(imageUrl.lastIndexOf('/') + 1); // Extract filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close when clicking outside the image
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking on the content */}
        <button
          className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2"
          onClick={onClose}
        >
          <BsX size={24} />
        </button>
        <img src={imageUrl} alt="Full view" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" />
        <button
          className="absolute bottom-2 right-2 bg-whatsapp-accent text-white rounded-full p-3 flex items-center space-x-2"
          onClick={handleDownload}
        >
          <BsDownload size={20} />
          <span>Save Image</span>
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
