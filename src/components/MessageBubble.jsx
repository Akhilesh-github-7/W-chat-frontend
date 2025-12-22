import React from 'react';
import { BsCheckAll } from 'react-icons/bs';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const MessageBubble = ({ message, currentUserId, onImageClick }) => {
  const { theme } = useTheme();
  const { content, createdAt, sentByMe, seenBy, sender } = message;

  const isRead = seenBy && seenBy.includes(currentUserId);

  const sentBubbleStyle = theme === 'dark' 
    ? 'bg-white/20 backdrop-blur-md text-white rounded-br-none ml-auto border border-white/30'
    : 'bg-blue-500 text-white rounded-br-none ml-auto';
  
  const receivedBubbleStyle = theme === 'dark'
    ? 'bg-black/20 backdrop-blur-md text-gray-200 rounded-bl-none mr-auto border border-white/20'
    : 'bg-gray-200 text-gray-800 rounded-bl-none mr-auto';

  return (
    <div className={`flex ${sentByMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg
          ${sentByMe ? sentBubbleStyle : receivedBubbleStyle}
        `}
      >
        {!sentByMe && (
          <div className="text-xs font-bold mb-1" style={{ color: theme === 'dark' ? (sender.color || '#00FFFF') : (sender.color || '#1976D2') }}>
            {sender.name}
          </div>
        )}
        {message.file && (
          <div className="mt-2">
            {message.file.endsWith('.jpg') || message.file.endsWith('.jpeg') || message.file.endsWith('.png') || message.file.endsWith('.gif') ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`}
                alt="attachment"
                className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] h-auto rounded-lg cursor-pointer"
                onClick={() => onImageClick && onImageClick(`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`)}
              />
            ) : message.file.endsWith('.mp4') || message.file.endsWith('.webm') || message.file.endsWith('.ogg') ? (
              <video src={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`} controls className="max-w-[150px] sm:max-w-[200px] md:max-w-[250px] h-auto rounded-lg" />
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={theme === 'dark' ? "text-cyan-400 underline" : "text-blue-600 underline"}
              >
                View Attachment
              </a>
            )}
          </div>
        )}
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        <div className={`flex items-center justify-end text-xs mt-1 ${sentByMe ? (theme === 'dark' ? 'text-gray-200' : 'text-gray-50') : (theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}`}>
          <span>{format(new Date(createdAt), 'p')}</span>
          {sentByMe && (
            <BsCheckAll className={`ml-1 ${isRead ? (theme === 'dark' ? 'text-neon-cyan' : 'text-blue-300') : (theme === 'dark' ? 'text-gray-300/70' : 'text-gray-200/70')}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
