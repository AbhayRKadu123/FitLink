import express from 'express'
import { getUserDetails,GetUserFeed } from '../Controller/userController.js';
import { verifyToken } from "../MiddleWare/VerifyToken.js";

const UserApi = express.Router(); // ✅ create router instance
// getUserDetails

UserApi.get("/getUserDetail",verifyToken,getUserDetails)
UserApi.get("/GetUserFeed",verifyToken,GetUserFeed)

export default UserApi;