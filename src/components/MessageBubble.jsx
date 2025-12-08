import React from 'react';
import { BsCheckAll } from 'react-icons/bs';
import { format } from 'date-fns';

const MessageBubble = ({ message, currentUserId, onImageClick }) => { // sentByMe is no longer a direct prop
  const { content, createdAt, sentByMe, seenBy, sender } = message;

  const isRead = seenBy && seenBy.includes(currentUserId);

  return (
    <div
      className={`flex ${sentByMe ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`relative max-w-[70%] px-3 py-2 rounded-lg shadow
          ${sentByMe
            ? 'bg-whatsapp-accent text-white rounded-br-none ml-auto'
            : 'bg-gray-200 dark:bg-whatsapp-dark-bg-tertiary text-gray-900 dark:text-gray-100 rounded-bl-none mr-auto'
          }
        `}
      >
        {!sentByMe && (
            <div className="text-xs font-semibold mb-1" style={{ color: sender.color || '#34B7F1' }}> {/* Example of dynamic color */}
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
                className="text-blue-500 underline"
              >
                View Attachment
              </a>
            )}
          </div>
        )}
        <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
        <div className={`flex items-center justify-end text-xs mt-1 ${sentByMe ? 'text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
          <span>{format(new Date(createdAt), 'p')}</span>
          {sentByMe && (
            <BsCheckAll className={`ml-1 ${isRead ? 'text-blue-400' : 'text-gray-300'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
