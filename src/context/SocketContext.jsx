import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext'; // Import useAuth

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token, currentUser } = useAuth(); // Get token and currentUser from AuthContext

    useEffect(() => {
        if (token) {
            const newSocket = io(import.meta.env.VITE_API_URL, {
                query: { token },
            });
            setSocket(newSocket);

            if (currentUser && currentUser._id) {
                newSocket.emit('add-user', currentUser._id);
            }

            return () => {
                newSocket.close();
            };
        }
    }, [token, currentUser]); // Depend on token and currentUser

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
