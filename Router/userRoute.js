import express from 'express'
import { getUserDetails,GetUserFeed,AddFriendUser,GetAllFriendRequest } from '../Controller/userController.js';
import { verifyToken } from "../MiddleWare/VerifyToken.js";

const UserApi = express.Router(); // ✅ create router instance
// getUserDetails

UserApi.get("/getUserDetail",verifyToken,getUserDetails)
UserApi.get("/GetUserFeed",verifyToken,GetUserFeed)
UserApi.put("/AddFriendUser",verifyToken,AddFriendUser)
UserApi.get("/GetAllFriendRequest",GetAllFriendRequest)

export default UserApi;