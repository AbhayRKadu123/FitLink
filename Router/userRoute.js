import express from 'express'
import {GetAllPointHistoryData,GetAllPointHistoryOptions,HandleDeletePaymentMethod,HandleUpdatePaymentMethod,HandleGetPaymentMethods,HandleAddPaymentMethod,SendQuery,GenerateCouponCode,GetReferalCode,ProfileSettingUserData, ProfileSetting,HandlePasswordChange,VerifyOtp,UpdatePassword,getUserDetailLogin,UploadImage,UserNotification,HandleDeleteMessage,GetReplyMessage, getUserDetails,GetUserFeed,AddFriendUser,GetAllFriendRequest,GetAllUserConversation} from '../Controller/userController.js';
import { verifyToken } from "../MiddleWare/VerifyToken.js";
import parser from '../MiddleWare/UploadPhoto.js';
const UserApi = express.Router(); // ✅ create router instance
// getUserDetails
UserApi.get("/getUserDetailLogin",getUserDetailLogin)
UserApi.get("/GetAllPointHistoryOptions",verifyToken,GetAllPointHistoryOptions)
UserApi.get("/getUserDetail",verifyToken,getUserDetails)
UserApi.get("/GetReferalCode",verifyToken,GetReferalCode)
UserApi.get("/HandleGetPaymentMethods",verifyToken,HandleGetPaymentMethods)
UserApi.get("/GetAllPointHistoryData",verifyToken,GetAllPointHistoryData)
UserApi.put("/HandleUpdatePaymentMethod",verifyToken,HandleUpdatePaymentMethod)
UserApi.delete("/HandleDeletePaymentMethod",verifyToken,HandleDeletePaymentMethod)
//  HandleGetPaymentMethods
UserApi.put("/GenerateCouponCode",verifyToken,GenerateCouponCode)

// GenerateCouponCode
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
UserApi.post("/HandleAddPaymentMethod",verifyToken,HandleAddPaymentMethod)

// HandleAddPaymentMethod
UserApi.post("/VerifyOtp",VerifyOtp)
UserApi.post("/SendQuery",verifyToken,SendQuery)
UserApi.put("/UpdatePassword",UpdatePassword)

export default UserApi;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             