import React, { useState, useEffect } from 'react';
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

    const fetchChats = async () => {
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
    };

    useEffect(() => {
        if (token) { // Only fetch chats if a token exists
            fetchChats();
        }
    }, [token]); // Re-fetch chats when token changes

    // Listen for incoming messages to update the sidebar chat list
    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleNewMessage = (newMessage) => {
            setChats(prevChats => {
                const chatIndex = prevChats.findIndex(c => c._id === newMessage.chat._id);
        
                if (chatIndex > -1) {
                    // Chat exists, update its latestMessage and move to top
                    const updatedChat = { ...prevChats[chatIndex], latestMessage: newMessage };
                    const filteredChats = prevChats.filter(c => c._id !== newMessage.chat._id);
                    return [updatedChat, ...filteredChats];
                } else {
                    // New chat, fetch it and add to the list
                    // This case might happen if a new chat is initiated by another user
                    fetchChats(); // Or, ideally, you'd just fetch the single new chat info
                    return prevChats;
                }
            });

            // Also, update the active chat if it's the one receiving the message
            setActiveChat(prevActiveChat => {
                if (prevActiveChat && prevActiveChat._id === newMessage.chat._id) {
                    // This ensures the message count and latest message updates in the ActiveChatWindow
                    return { ...prevActiveChat, latestMessage: newMessage, messages: [...(prevActiveChat.messages || []), newMessage] };
                }
                return prevActiveChat;
            });
        };

        socket.on('msg-received', handleNewMessage);

        return () => {
            socket.off('msg-received', handleNewMessage);
        };
    }, [socket, currentUser, setActiveChat, fetchChats]); // Add fetchChats to dependencies

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
        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId ? { ...chat, latestMessage: null } : chat
            )
        );
        // If the cleared chat is the active chat, refresh the chat window
        if (activeChat?._id === chatId) {
            setActiveChat(prev => ({ ...prev, messages: [] , latestMessage: null}));
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
                                {currentUser && ( // Only render Sidebar if currentUser is not null
                                    <Sidebar
                                        onSelectChat={handleSelectChat}
                                        onShowProfile={() => setShowProfile(true)}
                                        currentUser={currentUser}
                                        chats={chats}
                                        loadingChats={loadingChats}
                                        onChatCreated={(newChat) => setChats(prevChats => [newChat, ...prevChats])}
                                        onChatDeleted={handleChatDeleted}
                                        onChatCleared={handleChatCleared}
                                        onlineUsers={onlineUsers}
                                    />
                                )}
            </div>

            {/* Right Panel: Messaging View */}
            <div className={`w-full md:w-2/3 ${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-grow`}>
                {activeChat ? <ActiveChatWindow chat={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} onlineUsers={onlineUsers} /> : <ChatPlaceholder />}
            </div>
        </div>
    );
};

export default ChatPage;
