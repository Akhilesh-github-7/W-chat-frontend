import React from 'react';
import { useTheme } from '../context/ThemeContext';
import profilePlaceholder from '../assets/images/profle placeholder.png?url';
import { IoArrowBack } from 'react-icons/io5';

const ChatHeader = ({ contactName, contactAvatar, isOnline, onBack }) => {
  const { theme } = useTheme();

  const headerStyle = theme === 'dark'
    ? "sticky top-0 z-10 p-4 flex items-center bg-black/20 backdrop-blur-md shadow-lg"
    : "sticky top-0 z-10 p-4 flex items-center bg-gray-100 shadow-md";
  
  const backButtonStyle = theme === 'dark' ? "mr-4 md:hidden text-white" : "mr-4 md:hidden text-gray-800";
  const avatarBorderStyle = theme === 'dark' ? "w-11 h-11 rounded-full mr-4 border-2 border-cyan-400/50" : "w-11 h-11 rounded-full mr-4 border-2 border-blue-500/50";
  const onlineIndicatorStyle = theme === 'dark'
    ? "absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-800 shadow-[0_0_5px_#39FF14]"
    : "absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white";
  const contactNameStyle = theme === 'dark' ? "text-lg font-bold text-white" : "text-lg font-semibold text-gray-800";
  const onlineStatusStyle = `text-sm font-semibold ${isOnline ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`;

  return (
    <div className={headerStyle}>
      <button onClick={onBack} className={backButtonStyle}>
        <IoArrowBack size={24} />
      </button>
      <div className="relative">
        <img
          src={contactAvatar || profilePlaceholder}
          alt={`${contactName}'s avatar`}
          className={avatarBorderStyle}
        />
        {isOnline && (
          <div className={onlineIndicatorStyle}></div>
        )}
      </div>
      <div>
        <h2 className={contactNameStyle}>{contactName}</h2>
        <p className={onlineStatusStyle}>
          {isOnline ? 'online' : 'offline'}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
