import mongoose from "mongoose";
import { type } from "os";

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      default: "text",
    },
    SenderUsername: {
      type: String,
      required: true,
    },
    ReciverUsername: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // For grouping chats by conversation
    conversationId: {
      type: String, // `${senderId}_${receiverId}`
      required: true,
    },
    // To store message time in readable format if needed
    time: {
      type: String, // example: "9:42 PM"
    },
    date: {
      type: String, // example: "2025-02-12"
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    ImageUrl:{
      type:String

    },
    UniqueMessageId:{
      type:String

    },
    RepliedToUniqueMessageId:{
 type:String
    },
    RepliedToImage:{
type:String
    },
    replyTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message",
  default: null
}

  },
  { timestamps: true } // auto adds createdAt, updatedAt
);

export const MessageStorage = mongoose.model("Message", MessageSchema);
