import { useSocketContext } from "../context/SocketContext"
import useConversation from "../zustand/useConversation";
import { useEffect } from "react";

const useListenMessages = () => {
    const {socket} = useSocketContext();
    const { messages, setMessages } = useConversation();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setMessages([...messages, newMessage]);
        })

        return () => socket?.off("newMessage");
    }, [socket, setMessages,messages])
}   

export default useListenMessages;