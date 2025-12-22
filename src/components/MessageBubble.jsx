import React from 'react';
import { BsCheckAll } from 'react-icons/bs';
import { format } from 'date-fns';

const MessageBubble = ({ message, currentUserId, onImageClick }) => { // sentByMe is no longer a direct prop
  const { content, createdAt, sentByMe, seenBy, sender } = message;

  const isRead = seenBy && seenBy.includes(currentUserId);

  return (
    <div className={`flex ${sentByMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg
          ${sentByMe
            ? 'bg-white/20 backdrop-blur-md text-white rounded-br-none ml-auto border border-white/30'
            : 'bg-black/20 backdrop-blur-md text-gray-200 rounded-bl-none mr-auto border border-white/20'
          }
        `}
      >
        {!sentByMe && (
          <div className="text-xs font-bold mb-1" style={{ color: sender.color || '#00FFFF' }}>
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
                className="text-cyan-400 underline"
              >
                View Attachment
              </a>
            )}
          </div>
        )}
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        <div className={`flex items-center justify-end text-xs mt-1 ${sentByMe ? 'text-gray-200' : 'text-gray-400'}`}>
          <span>{format(new Date(createdAt), 'p')}</span>
          {sentByMe && (
            <BsCheckAll className={`ml-1 ${isRead ? 'text-neon-cyan' : 'text-gray-300/70'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
