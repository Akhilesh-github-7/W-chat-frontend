import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';


const ChatWindow = ({ selectedChat }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat._id) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${selectedChat._id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      } else {
        console.error('Failed to fetch messages:', data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    // Auto-scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text, image) => {
    if (!selectedChat) return;

    // This will be replaced by actual API call later
    const newMessage = {
      _id: `m${messages.length + 1}`,
      sender: { username: 'Me' }, // Assuming 'Me' for now
      content: text,
      createdAt: new Date().toISOString(),
      // image: image, // Store image data if available
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleFileUpload = (file) => {
    // In a real app, you would upload the file to a server
    console.log('File to upload:', file.name);
    // For now, the image is passed directly to handleSendMessage as a preview string
  };

  if (!selectedChat) {
    return (
      <div
        className={`flex-1 flex items-center justify-center
        ${theme === 'dark' ? 'bg-whatsapp-dark-bg-primary text-gray-400' : 'bg-gray-50 text-gray-600'}`}
      >
        Select a chat to start messaging
      </div>
    );
  }

  // Determine the chat name (for group chats vs. individual chats)
  const chatName = selectedChat.isGroupChat
    ? selectedChat.chatName
    : selectedChat.users.find(user => user.username !== 'Me')?.username || 'Unknown User'; // Needs to be dynamic based on logged in user

  return (
    <div
      className={`flex-1 flex flex-col h-screen
      ${theme === 'dark' ? 'bg-whatsapp-dark-bg-primary' : 'bg-gray-50'}`}
    >
      <ChatHeader
        contactName={chatName}
        contactAvatar={selectedChat.isGroupChat ? "https://i.pravatar.cc/150?img=group" : selectedChat.users.find(user => user.username !== 'Me')?.avatar || "https://i.pravatar.cc/150?img=68"}
        // isOnline={selectedChat.online} // Online status needs to be managed for users within a chat
      />

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Say hello!</p>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={(newMessage) => setMessages(prevMessages => [...prevMessages, newMessage])} onFileUpload={handleFileUpload} selectedChat={selectedChat} />
    </div>
  );
};

export default ChatWindow;
