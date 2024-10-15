import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import useConversation from "../../zustand/useConversation";
import { useEffect } from "react";
import { useQuery } from '@tanstack/react-query';

const MessageContainer = () => {
    const {selectedConversation, setSelectedConversation} = useConversation();
    
    useEffect(() => {
        //cleanup function (unmounts conversation)
        return () => setSelectedConversation(null);
    }, [setSelectedConversation]);
    return (
        <div className="md:min-w-[450px] md:max-w-[700px] w-full flex flex-col mx-auto bg-transparent backdrop-blur-lg rounded-lg shadow-lg">
            {!selectedConversation ? <NoChatSelected /> : (
                <>
                {/* Header Section */}
                <div className="bg-gray-200 px-6 py-3 mb-4 text-gray-700 rounded-t-lg">
                    <span className="text-lg font-semibold">To:</span>{" "}
                    <span className="font-bold">{selectedConversation.fullName}</span>
                </div>
                <Messages />
                <MessageInput />                
            </>
            )}
            
            
        </div>
    );
};

const NoChatSelected = () => {
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
    return(
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👋 {authUser.username}</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="text-3xl md:text-6xl text-center" />
            </div>
        </div>
    );
};

export default MessageContainer;