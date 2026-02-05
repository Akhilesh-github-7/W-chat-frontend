import React from 'react';
import { BsCheckAll, BsCheck } from 'react-icons/bs';
import { format } from 'date-fns';

const MessageBubble = ({ message, currentUserId, onImageClick }) => {
  const { content, createdAt, sentByMe, seenBy, sender } = message;

  const isRead = seenBy && seenBy.includes(currentUserId);

  return (
    <div className={`flex w-full ${sentByMe ? 'justify-end' : 'justify-start'} mb-3 group animate-fadeIn`}>
      <div
        className={`relative max-w-[75%] sm:max-w-[70%] px-4 py-2.5 shadow-md transition-all duration-200 hover:shadow-lg
          ${sentByMe
            ? 'bg-gradient-to-r from-neon-blue to-blue-600 text-white rounded-2xl rounded-tr-sm'
            : 'bg-white/10 backdrop-blur-md text-gray-100 rounded-2xl rounded-tl-sm border border-white/10'
          }
        `}
      >
        {!sentByMe && (
          <div className="text-xs font-bold mb-1 opacity-90 drop-shadow-sm" style={{ color: sender.color || '#00FFFF' }}>
            {sender.name}
          </div>
        )}
        
        {message.file && (
          <div className="mb-2 mt-1 rounded-lg overflow-hidden">
            {message.file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`}
                alt="attachment"
                className="w-full max-w-[280px] h-auto object-cover rounded-lg cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                onClick={() => onImageClick && onImageClick(`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`)}
              />
            ) : message.file.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`} controls className="max-w-full rounded-lg" />
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL}/uploads/${message.file.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/10"
              >
                <div className="bg-white/10 p-2 rounded">📄</div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate text-cyan-300">View Attachment</span>
                    <span className="text-xs text-gray-400 truncate opacity-70">Click to open</span>
                </div>
              </a>
            )}
          </div>
        )}

        <p className={`text-[15px] leading-relaxed break-words whitespace-pre-wrap ${!sentByMe ? 'text-gray-100' : 'text-white'}`}>{content}</p>
        
        <div className={`flex items-center justify-end gap-1 mt-1 select-none`}>
          <span className={`text-[10px] ${sentByMe ? 'text-blue-100/80' : 'text-gray-400'}`}>
            {format(new Date(createdAt), 'p')}
          </span>
          {sentByMe && (
             isRead ? (
                 <BsCheckAll className="text-neon-cyan drop-shadow-[0_0_2px_rgba(0,255,255,0.8)]" size={16} />
             ) : (
                 <BsCheck className="text-gray-300/80" size={16} />
             )
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
