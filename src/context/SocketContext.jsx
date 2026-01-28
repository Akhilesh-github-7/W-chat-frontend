import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import useAuth

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { token, currentUser } = useAuth(); // Get token and currentUser from AuthContext
    const onlineUsersRef = useRef(onlineUsers);

    useEffect(() => {
        onlineUsersRef.current = onlineUsers;
    }, [onlineUsers]);

    useEffect(() => {
        if (token && currentUser) {
            const newSocket = io(import.meta.env.VITE_API_URL, {
                query: { token },
            });
            setSocket(newSocket);

            newSocket.emit('add-user', currentUser._id);

            newSocket.on('get-online-users', (users) => {
                setOnlineUsers(users);
                console.log('Online users:', users);
            });

            newSocket.on('user-online', (userId) => {
                console.log('User came online:', userId);
                setOnlineUsers((prevUsers) => {
                    if (!prevUsers.includes(userId)) {
                        return [...prevUsers, userId];
                    }
                    return prevUsers;
                });
            });

            newSocket.on('user-offline', (userId) => {
                console.log('User went offline:', userId);
                setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
            });

            return () => {
                newSocket.off('get-online-users');
                newSocket.off('user-online');
                newSocket.off('user-offline');
                newSocket.close();
                setSocket(null);
            };
        } else if (!token && socket) {
            // If token becomes null (user logs out), close the socket
            socket.close();
            setSocket(null);
            setOnlineUsers([]);
        }
    }, [token, currentUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

