import express from "express";
import {UpdateOldPassword, Login ,SignUp} from "../Controller/authcontroller.js"; // add .js if using ES modules

const authrouter = express.Router(); // ✅ create router instance

authrouter.post("/login", Login);
authrouter.post("/signup",SignUp) // ✅ define route
authrouter.put("/UpdateOldPassword",UpdateOldPassword)

export default authrouter; // ✅ export router instance
