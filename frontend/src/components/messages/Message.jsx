import { useQuery } from '@tanstack/react-query';
import useConversation from '../../zustand/useConversation';
import { extractTime } from '../../utils/extractTime';


const Message = ({message}) => {
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
  const {selectedConversation} = useConversation();
  const formattedTime = extractTime(message.createdAt);
  // Check if the message is from the current logged-in user
  const fromMe = message.senderId === authUser?._id;
  
  // Determine the alignment class based on the sender
  const chatClassName = !fromMe ? "chat-start" : "chat-end";
  
  // Determine the profile picture for sender/receiver
  const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
  
  // Set the background color of the message bubble
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-gray-700";

  return (
    <div className={`chat ${chatClassName}`}>
        {/* Profile picture for the sender/receiver */}
        <div className={`chat-image avatar`}>
            <div className="w-10 rounded-full">
                <img src={profilePic} alt="User avatar"/>
            </div>
        </div>
        
        {/* Message bubble */}
        <div className={`chat-bubble text-white ${bubbleBgColor} p-3 rounded-lg max-w-xs pb-2`}>
            {message.message}
        </div>

        {/* Message timestamp */}
        <div className={'chat-footer opacity-50 text-xs flex gap-1 items-center'}>{formattedTime}</div>
    </div>
  );
}

export default Message;
