import React, { useState, useRef } from 'react';
import { BsEmojiSmile, BsPaperclip, BsSendFill, BsXCircle } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import { useTheme } from '../context/ThemeContext';

const MessageInput = ({ selectedChat, onSendMessage, onFileUpload }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // ... (keep all the handler functions as they are)
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
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message.');
    } finally {
      setShowEmojiPicker(false); // Close emoji picker after sending
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
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
    setShowEmojiPicker(false); // Close picker after selecting emoji
  };

  const containerStyle = theme === 'dark'
    ? "sticky bottom-0 z-10 p-4 bg-black/20 backdrop-blur-md"
    : "sticky bottom-0 z-10 p-4 bg-gray-200";
  
  const buttonStyle = theme === 'dark'
    ? "text-cyan-300 hover:text-cyan-100 p-2 rounded-full transition-colors"
    : "text-gray-600 hover:text-gray-800 p-2 rounded-full transition-colors";
  
  const textareaStyle = theme === 'dark'
    ? "flex-1 resize-none bg-black/30 text-white placeholder-gray-400 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-400/50 border border-white/20"
    : "flex-1 resize-none bg-white text-gray-800 placeholder-gray-500 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300";

  const sendButtonStyle = theme === 'dark'
    ? "bg-cyan-500 hover:bg-cyan-400 text-white p-3 rounded-full transition-colors shadow-lg"
    : "bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors shadow-lg";

  return (
    <div className={containerStyle}>
      {previewImage && (
        <div className="relative mb-2 w-32 h-32">
          <img src={previewImage} alt="Preview" className={`w-full h-full object-cover rounded-lg ${theme === 'dark' ? 'border border-white/30' : 'border border-gray-300'}`} />
          <button
            onClick={removePreviewImage}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 text-xs shadow-lg hover:bg-red-700"
            aria-label="Remove image"
          >
            <BsXCircle />
          </button>
        </div>
      )}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            className={buttonStyle}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <BsEmojiSmile size={24} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <Picker onEmojiClick={onEmojiClick} theme={theme} pickerStyle={theme === 'dark' ? { background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.3)' } : {}} />
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
          className={buttonStyle}
        >
          <BsPaperclip size={24} />
        </button>

        <textarea
          className={textareaStyle}
          placeholder="Type a message..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className={sendButtonStyle}
        >
          <BsSendFill size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
