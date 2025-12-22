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
      className="absolute z-50 p-2 rounded-lg shadow-lg bg-black/30 backdrop-blur-xl border border-white/20"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleClearChat}
        className="block w-full text-left px-4 py-2 text-sm rounded-md text-white hover:bg-white/10 transition-colors"
      >
        Clear Chat
      </button>
      <button
        onClick={handleDeleteChat}
        className="block w-full text-left px-4 py-2 text-sm rounded-md text-red-500 hover:bg-white/10 transition-colors"
      >
        Delete Chat
      </button>
    </div>
  );
};

export default ChatActions;
