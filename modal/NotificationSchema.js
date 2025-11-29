import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {

    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // user who should receive the notification
    },
    username:{
type: String,
required:true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional: who triggered the notification
    },
    senderUserName:{
       type: String,
      
      required: false, // optional: who triggered the notification

    },
    reciverUsername:{
       type: String,
      
      required: false, // optional: who triggered the notification

    },
    type: {
      type: String,
      enum: ["message", "like", "comment", "follow", "friendRequest"],
      required: true,
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metaData: {
      type: Object, // for extra data like postId, chatId, etc.
      default: {},
    },
  },
  { timestamps: true }
);

export const AllNotification = mongoose.model("Notification", notificationSchema);
