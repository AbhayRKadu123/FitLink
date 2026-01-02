
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { WorkoutRoutine } from './modal/WorkoutRoutin.js';
import http from "http";
import { Server } from "socket.io";
const app = express();

app.use(express.json());
import authrouter from './Router/authrouth.js';
import WorkoutApi from './Router/WorkoutApi.js';
import UserApi from './Router/userRoute.js';
import path from "path";
import { fileURLToPath } from "url";
import WeightRouter from './Router/WeightRoute.js';
import { UserModel } from './modal/users.js';
import { MessageStorage } from './modal/MessageSchema.js';
import "./utils/CronsJob.js"
import NotificationRouter from "./Router/SendPushNotification.js"
import { sendEmail } from './utils/sendEmail.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "dist"))); // or "build" if using CRA

// Catch-all route


// enable CORS for all routes
// app.use(cors());
app.use(cors({
  origin: "*",          // accept all origins
  methods: ["GET", "POST", "PUT", "DELETE"],  // allowed methods
  // allowedHeaders: ["Content-Type", "Authorization"] // headers you allow
}));

// const MONGO_URI = 'mongodb://127.0.0.1:27017/FitLinkDB'; 
// mongodburl=mongodb+srv://abhay:SHnj@575575@cluster0.a97kb.mongodb.net/?appName=Cluster0
const MONGO_URI = 'mongodb+srv://abhaykadu203_db_user:afRFCezNGhSfqrOP@cluster0.g7hamw5.mongodb.net/?appName=Cluster0';
// or use your Atlas connection string

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define your route first
function createConversationId(user1, user2) {
  return [user1, user2].sort().join("_");
}

async function saveMessage(data) {
  const conversationId = createConversationId(data.senderId, data.receiverId);

  const newMessage = new MessageStorage({
    senderId: data.senderId,
    receiverId: data.receiverId,
    SenderUsername: data?.SenderUsername,
    ReciverUsername: data?.ReciverUsername,
    message: data.message,
    conversationId,
    time: data.time, // optional
    date: data.date,
    replyTo: data?.ReplyId || null, // optional
    ImageUrl:data?.ImageUrl,
    UniqueMessageId:data?.UniqueMessageId,
    RepliedToUniqueMessageId:data?.RepliedToUniqueMessageId,
    RepliedToImage:data?.RepliedToImage
  });

  await newMessage.save();
}
app.get("/keeprouteactive", (req, res) => {
  res.status(200).json({ msg: 'keep route active' })
})
app.use('/', authrouter);
app.use("/workout", WorkoutApi)
app.use("/pushnotification",NotificationRouter)
app.use("/User", UserApi)
app.use("/GetUserWeight", WeightRouter)
app.post("/SendMail",async(req,res)=>{
  let result=await sendEmail("abhaykadu203@gmail.com","Missed Your Todays Workout","if You Forgot to log workout u can still log workout from History section ")
res.status(200).json({MSG:'mail sent',result:result})
})
app.get('/', (req, res) => {
  console.log('test route')
  res.send('App is listening');
});
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

const server = http.createServer(app);

// Attach socket server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
     pingInterval: 25000,
  pingTimeout: 20000
  }
});
let users = {}
let MessagingOnlineUser = {}
let OnlineUsersList = []
io.on("connection", (socket) => {
  socket.on('UserJoined', (msg) => {
    users[msg?.Id] = socket?.id;
    socket.broadcast.emit("OnlineUsers", users)
  })

  socket.on("Notification", (Data) => {
    console.log('NotificationnData', Data)
    socket.to(users[Data.Id]).emit("IncommingNotification", { NotificationType: 'FriendRequest', from: Data?.CurrId })
  })
  socket.on("istyping",(Data)=>{
    console.log('istyping data',Data)
    socket.to(users[Data.Id]).emit('IsTyping',{msg:`${Data?.username} is typing..`})
  })
  socket.on("SendMessage", async (Msg) => {
    const { msg, SenderId, ReciverId, Date, Time, ReplyId, ImageUrl,UniqueMessageId,RepliedToUniqueMessageId,RepliedToImage,replyMessage} = Msg
    console.log('RepliedToUniqueMessageId=', RepliedToImage)
    let ReciverUserName = await UserModel.findOne({ _id: ReciverId })
    let SenderUsername = await UserModel.findOne({ _id: SenderId })
    let Data = {
      senderId: SenderUsername?._id,
      receiverId: ReciverUserName?._id,
      SenderUsername: SenderUsername?.username,
      ReciverUsername: ReciverUserName?.username,
      message: msg,
      
      time: Time, 
      date: Date ,
      ImageUrl,
      UniqueMessageId:UniqueMessageId,
      RepliedToImage,
      RepliedToUniqueMessageId:RepliedToUniqueMessageId
    }
    if (ReplyId) {
      Data['ReplyId'] = ReplyId;

    }
    saveMessage(Data)
    const receiverSocketId = users[ReciverId];

if (receiverSocketId) {
    socket.to(receiverSocketId).emit('IncommingMsg', { msg: msg, Sender: SenderId, Reciver: ReciverId, ReciverUsername: ReciverUserName?.username, SenderUsername: SenderUsername?.username, Date: Date, Time: Time,ImageUrl:ImageUrl,UniqueMessageId:UniqueMessageId,replyMessage:replyMessage,RepliedToImage:RepliedToImage })
}

    // console.log('msg sending',msg)
  })

  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    socket.broadcast.emit("OnlineUsers", users);
  });


})
// Correct listen syntax
server.listen(8080, async () => {
  

  console.log('App is listening on port 8080');
});
