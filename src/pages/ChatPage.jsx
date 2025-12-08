import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical, BsSearch } from 'react-icons/bs';
import { RiChat3Line } from 'react-icons/ri';
import ActiveChatWindow from '../components/ActiveChatWindow';
import ProfilePage from './ProfilePage'; // Import ProfilePage
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import getAvatarUrl from '../utils/avatar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext'; // Import useAuth

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
    const { currentUser, updateCurrentUser, token } = useAuth(); // Use currentUser from AuthContext

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
                />

            </div>

            {/* Right Panel: Messaging View */}
            <div className={`w-full md:w-2/3 ${activeChat ? 'flex' : 'hidden md:flex'} flex-col flex-grow`}>
                {activeChat ? <ActiveChatWindow chat={activeChat} currentUser={currentUser} onBack={() => setActiveChat(null)} /> : <ChatPlaceholder />}
            </div>
        </div>
    );
};

export default ChatPage;
