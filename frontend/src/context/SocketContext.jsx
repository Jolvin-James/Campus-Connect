import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { useQuery } from '@tanstack/react-query';

export const SocketContext = createContext();
  
export const useSocketContext = () => {
    return useContext(SocketContext);
}
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { data: authUser } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
    });

    useEffect(() => {
        console.log('authUser:', authUser); // Debug: Check if authUser is being set

        if (authUser) {
            const socket = io("http://localhost:5000", {
                query: {
                    userId: authUser?._id,
                }
            });

            setSocket(socket);

            // Handle online users
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Handle errors
            socket.on('connect_error', (err) => {
                console.log('Socket connection error:', err);
            });

            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
