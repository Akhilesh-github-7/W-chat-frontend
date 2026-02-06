import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useTheme } from '../context/ThemeContext';
import ChatHeader from './ChatHeader';
import getAvatarUrl from '../utils/avatar';
import { useSocket } from '../context/SocketContext';
import ImageViewer from './ImageViewer';

const ActiveChatWindow = ({ chat, currentUser, onBack, onlineUsers }) => {
    const { } = useTheme();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { socket } = useSocket();
    const scrollContainerRef = useRef(null);

    // State for image viewer
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const openImageViewer = (imageUrl) => {
        setCurrentImage(imageUrl);
        setShowImageViewer(true);
    };

    const closeImageViewer = () => {
        setCurrentImage(null);
        setShowImageViewer(false);
    };

    // Auto-scroll to bottom of messages - Refined to prevent parent container from shifting
    const scrollToBottom = useCallback((smooth = false) => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                top: scrollHeight,
                behavior: smooth ? "smooth" : "auto"
            });
        }
    }, []);

    useEffect(() => {
        scrollToBottom(false);
    }, [messages, chat?._id, scrollToBottom]);

    // Handle Visual Viewport (Keyboard) changes
    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            if (window.visualViewport.height < window.innerHeight) {
                // Viewport shrunk, likely keyboard opened
                requestAnimationFrame(() => {
                    scrollToBottom(true);
                });
            }
        };

        window.visualViewport.addEventListener('resize', handleResize);
        return () => window.visualViewport.removeEventListener('resize', handleResize);
    }, [scrollToBottom]);

    const fetchMessages = useCallback(async () => {
        if (chat?._id && currentUser?._id) {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chat._id}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    const messagesWithSentByMe = data.messages.map(msg => {
                        const sentByMe = msg.sender._id === currentUser._id;
                        return {
                            ...msg,
                            sentByMe: sentByMe
                        };
                    });
                    setMessages(messagesWithSentByMe.reverse());
                } else {
                    console.error('Failed to fetch messages:', data.message);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [chat?._id, currentUser?._id]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Effect to reset messages when the chat is cleared from the parent
    useEffect(() => {
        if (chat && (chat.messages?.length === 0 || chat.latestMessage === null)) {
            setMessages([]);
        }
    }, [chat?._id, chat?.messages, chat?.latestMessage]);

    // Mark messages as seen when they appear in the chat window
    useEffect(() => {
        if (currentUser && chat && messages.length > 0) {
            messages.forEach(async (msg) => {
                if (msg.sender._id !== currentUser._id && !msg.seenBy.includes(currentUser._id)) {
                    try {
                        const token = sessionStorage.getItem('token');
                        await fetch(`${import.meta.env.VITE_API_URL}/api/chats/message/seen`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ messageId: msg._id })
                        });
                        setMessages(prevMessages => 
                            prevMessages.map(m => 
                                m._id === msg._id && !m.seenBy.includes(currentUser._id) 
                                ? { ...m, seenBy: [...m.seenBy, currentUser._id] } 
                                : m
                            )
                        );
                    } catch (error) {
                        console.error('Error marking message as seen:', error);
                    }
                }
            });
        }
    }, [messages, chat, currentUser]);

    useEffect(() => {
        if (socket && chat?._id && currentUser?._id) {
            
            socket.emit('join-chat', chat._id);
            socket.on('msg-received', (newMessage) => {
                if (newMessage.chat._id === chat._id) {
                    setMessages((prevMessages) => {
                        const sentByMe = newMessage.sender._id === currentUser._id;
                        const messageWithSentByMe = {
                            ...newMessage,
                            sentByMe: sentByMe
                        };
                        if (!prevMessages.some(msg => msg._id === messageWithSentByMe._id)) {
                            return [...prevMessages, messageWithSentByMe];
                        }
                        return prevMessages;
                    });
                }
            });

            socket.on('message-seen', ({ messageId, userId }) => {
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg._id === messageId && !msg.seenBy.includes(userId)
                        ? { ...msg, seenBy: [...msg.seenBy, userId] }
                        : msg
                    )
                );
            });


            return () => {
                socket.off('msg-received');
                socket.off('message-seen');
            };
        }
    }, [socket, chat, currentUser]);

    const handleSendMessage = (newMessage) => {
        setMessages((prevMessages) => {
            const sentByMe = newMessage.sender._id === currentUser._id;
            const messageWithSentByMe = {
                ...newMessage,
                sentByMe: sentByMe
            };
            if (!prevMessages.some(msg => msg._id === messageWithSentByMe._id)) {
                return [...prevMessages, messageWithSentByMe];
            }
            return prevMessages;
        });
    };

    const contact = chat.users.find(u => u._id !== currentUser?._id);
    const avatarSrc = getAvatarUrl(contact?.avatar);
    const isContactOnline = onlineUsers.includes(contact?._id);

    return (
        <div className="h-full flex-1 flex flex-col bg-transparent relative overflow-hidden mobile-no-blur">
             <ChatHeader 
                contactName={contact?.name} 
                contactAvatar={avatarSrc} 
                isOnline={isContactOnline} 
                onBack={onBack} 
            />
            
            <div 
                ref={scrollContainerRef}
                className="flex-1 p-4 overflow-y-auto custom-scrollbar min-h-0 relative scroll-smooth"
            >
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-medium animate-pulse">Loading conversation...</p>
                    </div>
                ) : (
                    <>
                        {messages.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-4xl">👋</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                                <p className="text-gray-400">Send a message to start the conversation!</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <MessageBubble key={msg._id} message={msg} currentUserId={currentUser._id} onImageClick={openImageViewer} />
                        ))}
                    </>
                )}
            </div>
            
            <MessageInput onSendMessage={handleSendMessage} onFileUpload={() => { }} selectedChat={chat} />

            {showImageViewer && (
                <ImageViewer imageUrl={currentImage} onClose={closeImageViewer} />
            )}
        </div>
    );
};

ActiveChatWindow.propTypes = {
    chat: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        users: PropTypes.array.isRequired,
        latestMessage: PropTypes.object,
        messages: PropTypes.array,
    }),
    currentUser: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
    onlineUsers: PropTypes.array.isRequired,
};

export default ActiveChatWindow;

