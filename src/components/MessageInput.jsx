import React, { useState, useRef } from 'react';
import { BsEmojiSmile, BsPaperclip, BsSendFill, BsXCircle } from 'react-icons/bs';
import Picker from 'emoji-picker-react';

const MessageInput = ({ selectedChat, onSendMessage, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedChat || (!message.trim() && !selectedFile)) return;

    try {
      const token = sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('chatId', selectedChat._id);
      if (message.trim()) {
        formData.append('content', message.trim());
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/message`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        onSendMessage(data);
        setMessage('');
        setPreviewImage(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setShowEmojiPicker(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removePreviewImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <div className="relative z-20 p-4 bg-white/5 backdrop-blur-2xl border-t border-white/10 mt-auto">
      {/* File Preview Area */}
      {previewImage && (
        <div className="absolute bottom-full left-4 mb-4 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl animate-fadeIn">
          <div className="relative group">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl border border-white/10" 
            />
            <button
              onClick={removePreviewImage}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-transform hover:scale-110 active:scale-90"
              aria-label="Remove image"
            >
              <BsXCircle size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2 sm:space-x-4 max-w-7xl mx-auto">
        {/* Emoji and Attachment Buttons */}
        <div className="flex items-center space-x-1 mb-1">
          <div className="relative">
            <button
              className={`p-2.5 rounded-xl transition-all duration-200 ${showEmojiPicker ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400 hover:text-neon-cyan hover:bg-white/5'}`}
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              title="Emoji"
            >
              <BsEmojiSmile size={22} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-4 shadow-2xl animate-fadeIn">
                <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)}></div>
                <div className="relative z-50">
                   <Picker 
                    onEmojiClick={onEmojiClick} 
                    theme="dark" 
                    lazyLoadEmojis={true}
                    searchPlaceholder="Search emojis..."
                    width={window.innerWidth < 640 ? 280 : 350}
                    height={window.innerWidth < 640 ? 320 : 450}
                    previewConfig={{ showPreview: false }}
                  />
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2.5 text-gray-400 hover:text-neon-cyan hover:bg-white/5 rounded-xl transition-all duration-200"
            title="Attach File"
          >
            <BsPaperclip size={24} className="rotate-45" />
          </button>
        </div>

        {/* Text Input Area */}
        <div className="flex-1 relative group">
          <textarea
            className="w-full resize-none bg-white/5 text-gray-100 placeholder-gray-500 rounded-2xl py-3 px-4 max-h-32 outline-none focus:ring-2 focus:ring-neon-blue/40 border border-white/10 hover:border-white/20 transition-all duration-300 text-[15px] scrollbar-hide"
            placeholder="Type a message..."
            rows="1"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && !selectedFile}
          className={`mb-1 p-3.5 rounded-2xl transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center
            ${(!message.trim() && !selectedFile) 
              ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5' 
              : 'bg-gradient-to-r from-neon-blue to-blue-600 text-white hover:shadow-neon-blue/40 border border-transparent'
            }
          `}
        >
          <BsSendFill size={18} className={`${message.trim() || selectedFile ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

