import React from 'react';
import { useTheme } from '../context/ThemeContext';
import profilePlaceholder from '../assets/images/profle placeholder.png?url';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = ({ contactName, contactAvatar, isOnline, onBack }) => {
  const { theme } = useTheme();

  return (
    <div
      className="p-3 px-6 flex items-center bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg z-10"
    >
      <button 
        onClick={onBack} 
        className="mr-4 md:hidden text-white hover:bg-white/10 p-2 rounded-full transition-colors"
      >
        <IoArrowBack size={22} />
      </button>
      
      <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        <div className="relative">
            <img
            src={contactAvatar || profilePlaceholder}
            alt={`${contactName}'s avatar`}
            className="w-10 h-10 rounded-full mr-4 border-2 border-neon-blue/30 shadow-md object-cover"
            />
            {isOnline && (
            <div className="absolute bottom-0 right-4 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-[0_0_8px_#39FF14]"></div>
            )}
        </div>
        <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">{contactName}</h2>
            <p className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${isOnline ? 'text-green-400 drop-shadow-[0_0_2px_rgba(74,222,128,0.5)]' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
