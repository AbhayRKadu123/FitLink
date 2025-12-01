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
    date: data.date, // optional
  });

  await newMessage.save();
}

app.use('/', authrouter);
app.use("/workout", WorkoutApi)
app.use("/User", UserApi)
app.use("/GetUserWeight", WeightRouter)
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
    pingInterval: 10000,
  pingTimeout: 5000
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
  socket.on("SendMessage", async (Msg) => {
    const { msg, SenderId, ReciverId,Date,Time } = Msg
    let ReciverUserName = await UserModel.findOne({ _id: ReciverId })
    let SenderUsername = await UserModel.findOne({ _id: SenderId })
    let Data = {
      senderId: SenderUsername?._id,
      receiverId: ReciverUserName?._id,
      SenderUsername: SenderUsername?.username,
      ReciverUsername: ReciverUserName?.username,
      message: msg,
      // conversationId,
      time: Time, // optional
      date: Date // optional}
    }
    saveMessage(Data)
    socket.to(users[ReciverId]).emit('IncommingMsg', { msg: msg, Sender: SenderId, Reciver: ReciverId, ReciverUsername: ReciverUserName?.username, SenderUsername: SenderUsername?.username,Date:Date,Time:Time })


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
server.listen(8080, () => {
  console.log('App is listening on port 8080');
});
