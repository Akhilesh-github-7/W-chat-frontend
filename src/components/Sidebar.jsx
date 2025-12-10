import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BsSun, BsMoon, BsSearch, BsChatLeftTextFill } from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useSocket } from '../context/SocketContext';
import ChatActions from './ChatActions';
import { useAuth } from '../context/AuthContext';


const Sidebar = ({ onSelectChat, onShowProfile, currentUser, chats, loadingChats, onChatCreated,onChatDeleted, onChatCleared, onlineUsers }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(false);
  const socket = useSocket();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    chat: null,
    position: { x: 0, y: 0 },
  });
  const { token } = useAuth();


  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleSearch = async (query) => {
    setSearchTerm(query);

    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoadingSearchResults(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
      } else {
        console.error('Failed to search users:', data.message);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoadingSearchResults(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    (chat.chatName && chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (chat.users && chat.users.some(user => user?.name?.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const handleChatClick = (chat) => {
    onSelectChat(chat);
  };

  const handleUserClick = async (user) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        onChatCreated(data);
        onSelectChat(data); // Pass the chat to the parent component
        setSearchTerm(''); // Clear search term
        setSearchResults([]); // Clear search results
      } else {
        console.error('Failed to access/create chat:', data.message);
      }
    } catch (error) {
      console.error('Error accessing/creating chat:', error);
    }
  };

  const handleContextMenu = (e, chat) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      chat,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  const handleClearChat = async (chatId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}/clear`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        onChatCleared(chatId);
        alert('Chat cleared successfully');
      } else {
        alert(`Failed to clear chat: ${data.message}`);
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('An error occurred while clearing the chat.');
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        onChatDeleted(chatId);
        alert('Chat deleted successfully');
      } else {
        alert(`Failed to delete chat: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('An error occurred while deleting the chat.');
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`p-4
        ${theme === 'dark' ? 'bg-whatsapp-dark-bg-secondary text-gray-100' : 'bg-gray-200 text-gray-800'}
        flex flex-col h-full`}
      >
        {/* Profile and Theme Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center cursor-pointer" onClick={onShowProfile}>
            <img
              src={getAvatarUrl(currentUser?.avatar)}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">{currentUser?.name || 'My Profile'}</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
            {theme === 'dark' ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`w-full py-2 pl-10 pr-4 rounded-full outline-none
              ${theme === 'dark' ? 'bg-whatsapp-dark-bg-tertiary text-gray-100' : 'bg-white text-gray-800'}`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
            <h2 className="text-lg font-bold mb-2">Search Results</h2>
            {loadingSearchResults ? (
              <p>Searching users...</p>
            ) : searchResults.length === 0 ? (
              <p>No users found.</p>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer mb-2
                    ${theme === 'dark' ? 'hover:bg-whatsapp-dark-bg-tertiary' : 'hover:bg-gray-300'}`}
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={getAvatarUrl(user.avatar)}
                    alt={`${user.name}'s avatar`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  {onlineUsers[user._id] && (
                    <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-white border-2"></div>
                  )}
                  <h3 className="font-semibold">{user.name}</h3>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-lg font-bold mb-2">My Chats</h2>
          {loadingChats ? (
            <p>Loading chats...</p>
          ) : filteredChats.length === 0 ? (
            <p>No chats found.</p>
          ) : (
            filteredChats.map((chat) => {
              const otherUser = chat.users.find(u => u?._id !== currentUser._id);
              const isOnline = onlineUsers[otherUser?._id];

              // If it's not a group chat and no other user is found, skip rendering this chat to prevent errors.
              // This can happen if chat data is incomplete or corrupted.
              if (!chat.isGroupChat && !otherUser) {
                console.warn("Skipping chat due to missing otherUser:", chat);
                return null;
              }

              return (
                <div
                  key={chat._id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 relative
                    ${theme === 'dark' ? 'hover:bg-whatsapp-dark-bg-tertiary' : 'hover:bg-gray-300'}`}
                  onClick={() => handleChatClick(chat)}
                  onContextMenu={(e) => handleContextMenu(e, chat)}
                >
                  <div className="relative">
                    <img
                      src={chat.isGroupChat ? "https://i.pravatar.cc/150?img=group.jpg" : getAvatarUrl(otherUser?.avatar)}
                      alt="Chat Avatar"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    {!chat.isGroupChat && isOnline && (
                      <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-white border-2"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{chat.isGroupChat ? chat.chatName : otherUser?.name || 'Unknown User'}</h3>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <p className="truncate w-40">{chat.latestMessage?.content || "No messages yet"}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <ChatActions
          chat={contextMenu.chat}
          position={contextMenu.position}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onClearChat={handleClearChat}
          onDeleteChat={handleDeleteChat}
        />
      )}
    </>
  );
};

export default Sidebar;
