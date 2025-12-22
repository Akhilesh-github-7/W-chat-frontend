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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close when clicking outside the image
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking on the content */}
        <button
          className="absolute -top-12 right-0 text-white rounded-full p-2"
          onClick={onClose}
        >
          <BsX size={32} />
        </button>
        <img src={imageUrl} alt="Full view" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border-2 border-white/20" />
        <button
          className="absolute bottom-4 right-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-full p-4 flex items-center space-x-2 transition-colors shadow-lg"
          onClick={handleDownload}
        >
          <BsDownload size={22} />
          <span>Save Image</span>
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
