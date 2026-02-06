import React from 'react';
import { BsCheckAll, BsCheck, BsFileEarmarkPdfFill, BsFileEarmarkWordFill, BsFileEarmarkBarGraphFill, BsFileEarmarkMusicFill, BsFileEarmarkZipFill, BsFileEarmarkFill, BsDownload } from 'react-icons/bs';
import { format } from 'date-fns';

const FileIcon = ({ fileName }) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const iconSize = 24;
  
  if (ext === 'pdf') return <BsFileEarmarkPdfFill size={iconSize} className="text-red-500" />;
  if (['doc', 'docx'].includes(ext)) return <BsFileEarmarkWordFill size={iconSize} className="text-blue-500" />;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return <BsFileEarmarkBarGraphFill size={iconSize} className="text-green-500" />;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return <BsFileEarmarkMusicFill size={iconSize} className="text-purple-500" />;
  if (['zip', 'rar', '7z'].includes(ext)) return <BsFileEarmarkZipFill size={iconSize} className="text-yellow-500" />;
  
  return <BsFileEarmarkFill size={iconSize} className="text-gray-400" />;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MessageBubble = ({ message, currentUserId, onImageClick }) => {
  const { content, createdAt, sentByMe, seenBy, sender, fileName, fileSize } = message;

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
                download={fileName}
                className="flex items-center gap-3 p-3 rounded-xl bg-black/30 hover:bg-black/40 transition-all duration-200 border border-white/5 group/file shadow-inner"
              >
                <div className="bg-white/5 p-2.5 rounded-lg group-hover/file:bg-white/10 transition-colors">
                  <FileIcon fileName={fileName || message.file} />
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                    <span className="text-[13px] font-semibold truncate text-gray-100 group-hover/file:text-neon-cyan transition-colors">
                        {fileName || 'Document'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                        {formatFileSize(fileSize)}
                    </span>
                </div>
                <div className="text-gray-500 group-hover/file:text-white transition-colors">
                    <BsDownload size={18} />
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
