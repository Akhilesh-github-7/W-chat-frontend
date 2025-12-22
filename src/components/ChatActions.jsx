import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ChatActions = ({ chat, position, onClose, onClearChat, onDeleteChat }) => {
  const { theme } = useTheme();

  const handleClearChat = (e) => {
    e.stopPropagation();
    onClearChat(chat._id);
    onClose();
  };

  const handleDeleteChat = (e) => {
    e.stopPropagation();
    onDeleteChat(chat._id);
    onClose();
  };

  const menuStyle = theme === 'dark'
    ? "absolute z-50 p-2 rounded-lg shadow-lg bg-black/30 backdrop-blur-xl border border-white/20"
    : "absolute z-50 p-2 rounded-lg shadow-lg bg-white border border-gray-200";
  
  const buttonStyle = theme === 'dark'
    ? "block w-full text-left px-4 py-2 text-sm rounded-md text-white hover:bg-white/10 transition-colors"
    : "block w-full text-left px-4 py-2 text-sm rounded-md text-gray-800 hover:bg-gray-100 transition-colors";
  
  const deleteButtonStyle = theme === 'dark'
    ? "block w-full text-left px-4 py-2 text-sm rounded-md text-red-500 hover:bg-white/10 transition-colors"
    : "block w-full text-left px-4 py-2 text-sm rounded-md text-red-600 hover:bg-gray-100 transition-colors";

  return (
    <div
      style={{ top: position.y, left: position.x }}
      className={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClearChat}
        className={buttonStyle}
      >
        Clear Chat
      </button>
      <button
        onClick={handleDeleteChat}
        className={deleteButtonStyle}
      >
        Delete Chat
      </button>
    </div>
  );
};

export default ChatActions;
