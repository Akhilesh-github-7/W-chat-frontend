import React from 'react';
import { useTheme } from '../context/ThemeContext';
import profilePlaceholder from '../assets/images/profle placeholder.png?url';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = ({ contactName, contactAvatar, isOnline, onBack }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`sticky top-0 z-10 p-4 flex items-center shadow-md
      ${theme === 'dark' ? 'bg-whatsapp-dark-bg-tertiary text-white' : 'bg-white text-gray-800'}`}
    >
      <button onClick={onBack} className="mr-4 md:hidden">
        <IoArrowBack size={24} />
      </button>
      <img
        src={contactAvatar || profilePlaceholder}
        alt={`${contactName}'s avatar`}
        className="w-10 h-10 rounded-full mr-4"
      />
      <div>
        <h2 className="text-lg font-semibold">{contactName}</h2>
        <p className={`text-sm ${isOnline ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {isOnline ? 'online' : 'offline'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
