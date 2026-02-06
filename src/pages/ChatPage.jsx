import React, { useState, useEffect } from 'react';
import { RiChat3Line } from 'react-icons/ri';
import ActiveChatWindow from '../components/ActiveChatWindow';
import ProfilePage from './ProfilePage';
import { useTheme } from '../context/ThemeContext';
import getAvatarUrl from '../utils/avatar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ChatPlaceholder = () => (
    <div className="flex-1 flex flex-col items-center justify-center bg-transparent p-8 text-center">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-neon-blue/20 rounded-full blur-xl animate-pulse"></div>
            <RiChat3Line className="relative z-10 text-neon-cyan/80 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" size={120} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-md">
            W-Chat Web
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-md leading-relaxed">
            Select a chat to start messaging instantly.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">Secure • Fast • Real-time</span>
        </p>
    </div>
);

const ChatPage = () => {
    const { theme } = useTheme();
    const [activeChat, setActiveChat] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const { token, currentUser, updateCurrentUser } = useAuth();
    const { socket, onlineUsers } = useSocket();
    console.log('ChatPage currentUser:', currentUser);

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
        if (token) {
            fetchChats();
        }
    }, [token]);

    useEffect(() => {
        if (!socket || !currentUser) return;

        const handleNewMessage = (newMessage) => {
            setChats(prevChats => {
                const chatIndex = prevChats.findIndex(c => c._id === newMessage.chat._id);

                if (chatIndex > -1) {
                    const updatedChat = { ...prevChats[chatIndex], latestMessage: newMessage };
                    const filteredChats = prevChats.filter(c => c._id !== newMessage.chat._id);
                    return [updatedChat, ...filteredChats];
                } else {
                    fetchChats();
                    return prevChats;
                }
            });

            setActiveChat(prevActiveChat => {
                if (prevActiveChat && prevActiveChat._id === newMessage.chat._id) {
                    return { ...prevActiveChat, latestMessage: newMessage, messages: [...(prevActiveChat.messages || []), newMessage] };  
                }
                return prevActiveChat;
            });
        };

        socket.on('msg-received', handleNewMessage);

        return () => {
            socket.off('msg-received', handleNewMessage);
        };
    }, [socket, currentUser, setActiveChat, fetchChats]);

    const handleAvatarUpdate = (relativeUrl) => {
        updateCurrentUser({ ...currentUser, avatar: relativeUrl });
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
        if (activeChat?._id === chatId) {
            setActiveChat(prev => ({ ...prev, messages: [] , latestMessage: null}));
        }
    };

    return (
        <div className="h-dvh w-dvw flex items-center justify-center bg-gray-900 font-inter overflow-hidden relative">
            {/* Animated Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-900 opacity-20 animate-gradient bg-[length:400%_400%]"></div>
            
             {/* Decorative Orbs - Reused for consistency but positioned subtly */}
             <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px]"></div>

            <div className="relative w-full sm:w-[95%] lg:w-[90%] xl:w-[85%] h-full sm:h-[92svh] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-none sm:rounded-3xl shadow-xl overflow-hidden flex">
                {/* Left Panel Container */}
                <div className={`relative w-full md:w-[35%] lg:w-[30%] md:min-w-[320px] border-r border-white/10 ${activeChat ? 'hidden md:flex' : 'flex'} flex-col flex-grow bg-black/20`}>
                    {/* Profile Panel (Sliding) */}
                    <div
                        className={`absolute top-0 left-0 w-full h-full bg-gray-900/95 backdrop-blur-xl z-30 transform transition-transform duration-300 ease-out ${
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
                    {currentUser && (
                        <Sidebar
                            onSelectChat={handleSelectChat}
                            activeChat={activeChat}
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
                <div className={`w-full md:w-[65%] lg:w-[70%] ${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-grow bg-black/40 relative`}>
                    {/* Background Pattern Overlay for Chat Area */}
                     <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                    
                    {activeChat ? (
                        <ActiveChatWindow 
                            chat={activeChat} 
                            currentUser={currentUser} 
                            onBack={() => setActiveChat(null)} 
                            onlineUsers={onlineUsers} 
                        />
                    ) : (
                        <ChatPlaceholder />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;