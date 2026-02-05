import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BsSun, BsMoon, BsSearch, BsChatLeftTextFill } from 'react-icons/bs';
import getAvatarUrl from '../utils/avatar';
import { useSocket } from '../context/SocketContext';
import ChatActions from './ChatActions';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';


const Sidebar = ({ onSelectChat, onShowProfile, currentUser, chats, loadingChats, onChatCreated,onChatDeleted, onChatCleared, onlineUsers, activeChat }) => {
  console.log('Sidebar currentUser:', currentUser);
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
        toast.error('Failed to find users');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Network error while searching');
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
        toast.success('Chat started successfully');
      } else {
        console.error('Failed to access/create chat:', data.message);
        toast.error(data.message || 'Failed to start chat');
      }
    } catch (error) {
      console.error('Error accessing/creating chat:', error);
      toast.error('Unable to connect to server');
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
        toast.success('Chat cleared successfully');
      } else {
        toast.error(`Failed to clear chat: ${data.message}`);
      }
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('An error occurred while clearing the chat.');
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
        toast.success('Chat deleted successfully');
      } else {
        toast.error(`Failed to delete chat: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('An error occurred while deleting the chat.');
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="bg-transparent text-white flex flex-col h-full p-4">
        {/* Profile and Theme Toggle */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-4">
          <div 
            className="flex items-center cursor-pointer group p-2 rounded-xl hover:bg-white/5 transition-all duration-300 w-full" 
            onClick={onShowProfile}
          >
            <div className="relative">
               <img
                src={getAvatarUrl(currentUser?.avatar)}
                alt="User Avatar"
                className="w-12 h-12 rounded-full mr-4 border-2 border-neon-blue/50 shadow-[0_0_10px_rgba(0,191,255,0.3)] group-hover:shadow-[0_0_15px_rgba(0,191,255,0.6)] transition-all duration-300"
              />
              <div className="absolute bottom-0 right-4 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
           
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white group-hover:text-neon-cyan transition-colors">{currentUser?.name || 'My Profile'}</span>
              <span className="text-xs text-gray-400">My Status</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-3 pl-11 pr-4 rounded-xl bg-black/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 border border-white/10 hover:border-white/20 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 animate-fadeIn">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neon-cyan mb-3 px-2">Search Results</h2>
            {loadingSearchResults ? (
              <p className="text-gray-400 px-2 italic">Searching users...</p>
            ) : searchResults.length === 0 ? (
              <p className="text-gray-500 px-2 italic">No users found.</p>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-3 rounded-xl cursor-pointer mb-2 hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/5"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="relative">
                    <img
                      src={getAvatarUrl(user.avatar)}
                      alt={`${user.name}'s avatar`}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    {onlineUsers.includes(user._id) && (
                      <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-base text-gray-200">{user.name}</h3>
                </div>
              ))
            )}
            <hr className="border-white/10 my-4"/>
          </div>
        )}

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {!searchTerm && <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">Recent Chats</h2>}
          {loadingChats ? (
            <div className="flex justify-center py-4">
                 <div className="w-6 h-6 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <p className="text-gray-500 text-center py-4 text-sm">No chats found.</p>
          ) : (
            filteredChats.map((chat) => {
              const otherUser = chat.users.find(u => u?._id !== currentUser._id);
              const isOnline = onlineUsers.includes(otherUser?._id);
              const isActive = activeChat?._id === chat._id;

              if (!chat.isGroupChat && !otherUser) {
                console.warn("Skipping chat due to missing otherUser:", chat);
                return null;
              }

              return (
                <div
                  key={chat._id}
                  className={`flex items-center p-3 rounded-xl cursor-pointer mb-2 relative transition-all duration-200 group border
                    ${isActive 
                        ? 'bg-neon-blue/10 border-neon-blue/50 shadow-[0_0_15px_rgba(0,191,255,0.1)]' 
                        : 'border-transparent hover:bg-white/5 hover:border-white/5'
                    }
                  `}
                  onClick={() => handleChatClick(chat)}
                  onContextMenu={(e) => handleContextMenu(e, chat)}
                >
                  <div className="relative mr-4">
                    <img
                      src={chat.isGroupChat ? "https://i.pravatar.cc/150?img=group.jpg" : getAvatarUrl(otherUser?.avatar)}
                      alt="Chat Avatar"
                      className={`w-12 h-12 rounded-full object-cover transition-transform duration-300 ${isActive ? 'scale-105 ring-2 ring-neon-blue/50' : 'group-hover:scale-105'}`}
                    />
                    {!chat.isGroupChat && isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900 shadow-[0_0_5px_#39FF14]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-semibold text-base truncate ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                        {chat.isGroupChat ? chat.chatName : otherUser?.name || 'Unknown User'}
                      </h3>
                       {/* Optional: Add time here if available in future */}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className={`truncate w-full ${isActive ? 'text-neon-blue/80' : 'text-gray-400 group-hover:text-gray-300'}`}>
                        {chat.latestMessage?.content || <span className="italic opacity-50">No messages yet</span>}
                      </p>
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
