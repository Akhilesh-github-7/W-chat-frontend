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

  return (
    <div
      style={{ top: position.y, left: position.x }}
      className={`absolute z-50 p-2 rounded-md shadow-lg ${
        theme === 'dark' ? 'bg-whatsapp-dark-bg-tertiary' : 'bg-white'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClearChat}
        className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
          theme === 'dark' ? 'text-gray-200 hover:bg-whatsapp-dark-bg-secondary' : 'text-gray-800 hover:bg-gray-200'
        }`}
      >
        Clear Chat
      </button>
      <button
        onClick={handleDeleteChat}
        className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
          theme === 'dark' ? 'text-red-500 hover:bg-whatsapp-dark-bg-secondary' : 'text-red-600 hover:bg-gray-200'
        }`}
      >
        Delete Chat
      </button>
    </div>
  );
};

export default ChatActions;
