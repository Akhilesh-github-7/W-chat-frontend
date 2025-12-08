import React, { useState, useRef } from 'react';
import { BsEmojiSmile, BsPaperclip, BsSendFill, BsXCircle } from 'react-icons/bs';
import Picker from 'emoji-picker-react';
import { useSocket } from '../context/SocketContext'; // Import useSocket


const MessageInput = ({ selectedChat, onSendMessage, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker visibility
  const socket = useSocket(); // Get socket instance

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

        // Emit message via socket
        socket.emit('send-msg', data);
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

  return (
    <div className="sticky bottom-0 z-10 p-4 bg-gray-100 dark:bg-whatsapp-dark-bg-tertiary shadow-lg">
      {previewImage && (
        <div className="relative mb-2 w-32 h-32">
          <img src={previewImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
          <button
            onClick={removePreviewImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
            aria-label="Remove image"
          >
            <BsXCircle />
          </button>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <BsEmojiSmile size={24} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2">
              <Picker onEmojiClick={onEmojiClick} theme="auto" />
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
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full"
        >
          <BsPaperclip size={24} />
        </button>

        <textarea
          className="flex-1 resize-none bg-white dark:bg-whatsapp-dark-bg-secondary text-gray-800 dark:text-gray-100 rounded-lg p-3 outline-none focus:ring-2 focus:ring-whatsapp-accent"
          placeholder="Type a message..."
          rows="1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="bg-whatsapp-accent hover:bg-green-600 text-white p-3 rounded-full transition duration-300 ease-in-out"
        >
          <BsSendFill size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
