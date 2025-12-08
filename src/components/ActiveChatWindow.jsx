import React, { useState, useEffect, useContext, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useTheme } from '../context/ThemeContext';
import ChatHeader from './ChatHeader';
import getAvatarUrl from '../utils/avatar';
import { useSocket } from '../context/SocketContext';
import notificationSound from '../assets/notification sound/mixkit-software-interface-start-2574.wav';
import ChatBackground from '../assets/images/Chat Background.jpg';
import ImageViewer from './ImageViewer'; // Import ImageViewer

const ActiveChatWindow = ({ chat, currentUser, onBack, onlineUsers }) => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

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

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (chat?._id && currentUser?._id) { // Ensure currentUser is available
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
                            console.log('fetchMessages - BEFORE SET: Message sender ID:', msg.sender._id, 'Current user ID:', currentUser._id, 'Calculated Sent by me:', sentByMe);
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
        };

        fetchMessages();
    }, [chat, currentUser]); // Add currentUser to dependencies

    // Mark messages as seen when they appear in the chat window
    useEffect(() => {
        if (currentUser && chat && messages.length > 0) {
            messages.forEach(async (msg) => {
                // If it's a message from someone else, and current user hasn't seen it
                // And it's not a message sent by the current user (to avoid marking own message as seen by self for blue tick logic)
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
                        // Optimistically update seenBy for current user's view
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
    }, [messages, chat, currentUser]); // Rerun when messages, chat, or current user changes

    useEffect(() => {
        if (socket && chat?._id && currentUser?._id) { // Ensure currentUser is available
            const audio = new Audio(notificationSound); // Create Audio instance inside useEffect
            socket.emit('join-chat', chat._id);
            socket.on('msg-received', (newMessage) => {
                if (newMessage.chat._id === chat._id) {
                    if (newMessage.sender._id !== currentUser._id) {
                        audio.play();
                    }
                    setMessages((prevMessages) => {
                        const sentByMe = newMessage.sender._id === currentUser._id;
                        console.log('msg-received - BEFORE SET: New Message sender ID:', newMessage.sender._id, 'Current user ID:', currentUser._id, 'Calculated Sent by me:', sentByMe);
                        const messageWithSentByMe = {
                            ...newMessage,
                            sentByMe: sentByMe
                        };
                        // Prevent duplicates if the message is already there
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
            console.log('handleSendMessage - BEFORE SET: New Message sender ID:', newMessage.sender._id, 'Current user ID:', currentUser._id, 'Calculated Sent by me:', sentByMe);
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
    const isContactOnline = onlineUsers[contact?._id]; // Determine online status here

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Loading messages...</p>
            </div>
        );
    }

    return (
        <div 
            className="flex-1 flex flex-col bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${ChatBackground})` }}
        >
            <ChatHeader 
                contactName={contact?.name} 
                contactAvatar={avatarSrc} 
                isOnline={isContactOnline} 
                onBack={onBack} 
            />
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                {messages.map(msg => (
                    <MessageBubble key={msg._id} message={msg} currentUserId={currentUser._id} onImageClick={openImageViewer} />
                ))}
                <div ref={messagesEndRef} /> {/* For auto-scrolling */}
            </div>
            <MessageInput onSendMessage={handleSendMessage} onFileUpload={() => { }} selectedChat={chat} />

            {showImageViewer && (
                <ImageViewer imageUrl={currentImage} onClose={closeImageViewer} />
            )}
        </div>
    );
};

export default ActiveChatWindow;
