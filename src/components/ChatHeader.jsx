import React from 'react';
import { useTheme } from '../context/ThemeContext';
import profilePlaceholder from '../assets/images/profle placeholder.png?url';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = ({ contactName, contactAvatar, isOnline, onBack }) => {
  const { theme } = useTheme();

  return (
    <div
      className="sticky top-0 z-10 p-4 flex items-center bg-black/20 backdrop-blur-md shadow-lg"
    >
      <button onClick={onBack} className="mr-4 md:hidden text-white">
        <IoArrowBack size={24} />
      </button>
      <div className="relative">
        <img
          src={contactAvatar || profilePlaceholder}
          alt={`${contactName}'s avatar`}
          className="w-11 h-11 rounded-full mr-4 border-2 border-cyan-400/50"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-800 shadow-[0_0_5px_#39FF14]"></div>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{contactName}</h2>
        <p className={`text-sm font-semibold ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
          {isOnline ? 'online' : 'offline'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
