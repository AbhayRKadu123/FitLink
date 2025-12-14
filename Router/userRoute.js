import express from 'express'
import {UploadImage,UserNotification,HandleDeleteMessage,GetReplyMessage, getUserDetails,GetUserFeed,AddFriendUser,GetAllFriendRequest,GetAllUserConversation} from '../Controller/userController.js';
import { verifyToken } from "../MiddleWare/VerifyToken.js";
import parser from '../MiddleWare/UploadPhoto.js';
const UserApi = express.Router(); // ✅ create router instance
// getUserDetails

UserApi.get("/getUserDetail",verifyToken,getUserDetails)
UserApi.get("/GetReplyMessage",GetReplyMessage)
UserApi.get("/GetUserFeed",verifyToken,GetUserFeed)
UserApi.put("/AddFriendUser",verifyToken,AddFriendUser)
UserApi.get("/GetAllFriendRequest",verifyToken,GetAllFriendRequest)
UserApi.get("/UserNotifications",verifyToken,UserNotification)
UserApi.get("/GetAllUserConversation",verifyToken,GetAllUserConversation)
// HandleDeleteMessage
UserApi.delete("/HandleDeleteMessage",verifyToken,HandleDeleteMessage)
UserApi.post("/UploadImage",verifyToken,parser.single('file'),UploadImage)

export default UserApi;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             