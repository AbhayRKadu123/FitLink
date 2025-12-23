import { Subscribe } from "../Controller/SendPushNotificationController.js";
import { Notify} from "../Controller/SendPushNotificationController.js"
import express from 'express' 
const NotificationRouter = express.Router(); 

NotificationRouter.post("/subscribe",Subscribe)
NotificationRouter.get("/Notify",Notify)

export default NotificationRouter
