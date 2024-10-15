import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js"; 

export const sendMessage =async (req, res) => {
    try{
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
    

        await Promise.all([conversation.save(), newMessage.save()]);
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            //io.to (<socketId>).emit() is used to send events to a specific client. Can be used both on client and server side
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.status(201).json(newMessage);

    }catch(error){
        console.log("Error in sendMessage controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]},
        }).populate("messages");

        if(!conversation) return res.status(200).json([]);
        const messages = conversation.messages;
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have user authentication in place

        // Fetch the user's followers
        const user = await User.findById(userId).populate('followers');
        const followerIds = user.followers.map(follower => follower._id);

        // Fetch conversations where the user is a participant and the other participant is a follower
        const conversations = await Conversation.find({
            participants: { $all: [userId, { $in: followerIds }] },
        }).populate('messages');

        res.status(200).json(conversations);
    } catch (error) {
        console.log("Error in getConversations controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};