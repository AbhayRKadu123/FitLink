import express from 'express'
import {ProfileSettingUserData, ProfileSetting,HandlePasswordChange,VerifyOtp,UpdatePassword,getUserDetailLogin,UploadImage,UserNotification,HandleDeleteMessage,GetReplyMessage, getUserDetails,GetUserFeed,AddFriendUser,GetAllFriendRequest,GetAllUserConversation} from '../Controller/userController.js';
import { verifyToken } from "../MiddleWare/VerifyToken.js";
import parser from '../MiddleWare/UploadPhoto.js';
const UserApi = express.Router(); // ✅ create router instance
// getUserDetails
UserApi.get("/getUserDetailLogin",getUserDetailLogin)
UserApi.get("/getUserDetail",verifyToken,getUserDetails)
UserApi.post("/HandlePasswordChange",verifyToken,HandlePasswordChange);

UserApi.get("/GetReplyMessage",GetReplyMessage)
UserApi.get("/GetUserFeed",verifyToken,GetUserFeed)
UserApi.put("/AddFriendUser",verifyToken,AddFriendUser)
UserApi.put("/ProfileSetting",verifyToken, ProfileSetting)
UserApi.get("/ProfileSettingUserData",verifyToken,ProfileSettingUserData)

UserApi.get("/GetAllFriendRequest",verifyToken,GetAllFriendRequest)
UserApi.get("/UserNotifications",verifyToken,UserNotification)
UserApi.get("/GetAllUserConversation",verifyToken,GetAllUserConversation)
// HandleDeleteMessage
UserApi.delete("/HandleDeleteMessage",verifyToken,HandleDeleteMessage)
UserApi.post("/UploadImage",verifyToken,parser.single('file'),UploadImage)
UserApi.post("/VerifyOtp",VerifyOtp)
UserApi.put("/UpdatePassword",UpdatePassword)

export default UserApi;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             