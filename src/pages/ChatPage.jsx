import React, { useState, useEffect, useCallback } from 'react';
import { BsThreeDotsVertical, BsSearch } from 'react-icons/bs';
import { RiChat3Line } from 'react-icons/ri';
import ActiveChatWindow from '../components/ActiveChatWindow';
import ProfilePage from './ProfilePage'; // Import ProfilePage
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import getAvatarUrl from '../utils/avatar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useSocket } from '../context/SocketContext';

const ChatPlaceholder = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
            <RiChat3Line className="mx-auto text-gray-400 dark:text-gray-600" size={80} />
            <h1 className="mt-4 text-3xl text-gray-600 dark:text-gray-500">ChatApp Web</h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-600">
                Select a chat to start messaging
            </p>
        </div>
    </div>
);

const ChatPage = () => {
    const { theme } = useTheme();
    const [activeChat, setActiveChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState({});
    const { currentUser, updateCurrentUser, token } = useAuth(); // Use currentUser from AuthContext
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
          socket.on('get-online-users', (onlineUserIds) => {
            const onlineUsersObj = onlineUserIds.reduce((acc, userId) => {
              acc[userId] = true;
              return acc;
            }, {});
            setOnlineUsers(onlineUsersObj);
          });
    
          socket.on('user-online', (userId) => {
            setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
          });
          socket.on('user-offline', (userId) => {
            setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
          });
    
          return () => {
            socket.off('get-online-users');
            socket.off('user-online');
            socket.off('user-offline');
          };
        }
      }, [socket]);

    const handleSelectChat = (chat) => {
        setActiveChat(chat);
    };

    const fetchChats = useCallback(async () => {
        setLoadingChats(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setChats(data);
                if (activeChat) {
                    const updatedActiveChat = data.find(c => c._id === activeChat._id);
                    if (updatedActiveChat) {
                        setActiveChat(updatedActiveChat);
                    }
                }
            } else {
                console.error('Failed to fetch chats:', data.message);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        } finally {
            setLoadingChats(false);
        }
    }, [token, activeChat]); // Depend on token and activeChat

    useEffect(() => {
        if (token) { // Only fetch chats if a token exists
            fetchChats();
        }
    }, [token, fetchChats]); // Re-fetch chats when token or fetchChats changes

    // Listen for incoming messages to update the sidebar chat list
    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleNewMessage = (newMessage) => {
            setChats((prevChats) => {
                const existingChatIndex = prevChats.findIndex(chat => chat._id === newMessage.chat._id);

                let newChats;
                if (existingChatIndex > -1) {
                    // Chat already exists, update it with the new latest message
                    const updatedChat = {
                        ...prevChats[existingChatIndex],
                        latestMessage: newMessage,
                        // TODO: Potentially add logic for unread count here
                    };

                    // Move the updated chat to the top of the list
                    newChats = [updatedChat, ...prevChats.filter(chat => chat._id !== newMessage.chat._id)];
                } else {
                    // This is a new chat (e.g., someone started a conversation with me)
                    // We need to add this new chat to the list.
                    // The newMessage object should contain the full chat object.
                    // If not, a fetch for this specific chat might be necessary.
                    const newChat = {
                        ...newMessage.chat, // Assuming newMessage.chat contains enough info for the sidebar
                        latestMessage: newMessage,
                        // TODO: Potentially add unread count
                    };
                    newChats = [newChat, ...prevChats];
                }
                return newChats;
            });

            // Also, update the active chat if it's the one receiving the message
            // This ensures the ChatWindow also gets the latestMessage update if it's active
            setActiveChat(prevActiveChat => {
                if (prevActiveChat && prevActiveChat._id === newMessage.chat._id) {
                    // Only update latestMessage, ChatWindow's own msg-received listener will handle messages array
                    return { ...prevActiveChat, latestMessage: newMessage };
                }
                return prevActiveChat;
            });
        };

        socket.on('msg-received', handleNewMessage);

        return () => {
            socket.off('msg-received', handleNewMessage);
        };
    }, [socket, currentUser, setActiveChat]); // fetchChats is no longer directly in this dependency array

    const handleAvatarUpdate = (relativeUrl) => {
        updateCurrentUser(prevUser => ({ ...prevUser, avatar: relativeUrl }));
        fetchChats();
    };

    const handleChatDeleted = (chatId) => {
        setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
        if (activeChat?._id === chatId) {
            setActiveChat(null);
        }
    };
    
    const handleChatCleared = (chatId) => {
        // Refetch chats to get the updated latestMessage
        fetchChats();
        // If the cleared chat is the active chat, refresh the chat window
        if (activeChat?._id === chatId) {
            setActiveChat(prev => ({ ...prev, messages: [] }));
        }
    };
    
    return (
        <div className={`flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden`}>
            {/* Left Panel Container */}
            <div className={`relative w-full md:w-1/3 md:max-w-md ${activeChat ? 'hidden md:flex' : 'flex'} flex-col flex-grow`}>
                {/* Profile Panel (Sliding) */}
                <div
                    className={`absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 z-20 transform transition-transform duration-300 ease-in-out ${
                        showProfile ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <ProfilePage
                        onCloseProfile={() => setShowProfile(false)}
                        onAvatarUpdate={handleAvatarUpdate}
                        avatar={getAvatarUrl(currentUser?.avatar)}
                        user={currentUser}
                    />
                </div>

                {/* Chat List Panel (Static) */}
                <Sidebar 
                    onSelectChat={handleSelectChat} 
                    onShowProfile={() => setShowProfile(true)} 
                    currentUser={currentUser}
                    chats={chats}
                    loadingChats={loadingChats}
                    onChatCreated={fetchChats}
                    onChatDeleted={handleChatDeleted}
                    onChatCleared={handleChatCleared}
                    onlineUsers={onlineUsers}
                />

            </div>

            {/* Right Panel: Messaging View */}
            <div className={`w-full md:w-2/3 ${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-grow`}>
                {activeChat ? <ActiveChatWindow chat={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} onlineUsers={onlineUsers} /> : <ChatPlaceholder />}
            </div>
        </div>
    );
};

export default ChatPage;
