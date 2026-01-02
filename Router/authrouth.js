import express from "express";
import { Login ,SignUp} from "../Controller/authcontroller.js"; // add .js if using ES modules

const authrouter = express.Router(); // ✅ create router instance

authrouter.post("/login", Login);
authrouter.post("/signup",SignUp) // ✅ define route

export default authrouter; // ✅ export router instance
