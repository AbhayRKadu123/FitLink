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

app.use('/', authrouter);
app.use("/workout", WorkoutApi)
app.use("/User", UserApi)
app.use("/GetUserWeight",WeightRouter)
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
    methods: ["GET", "POST"]
  }
});
let users = {}
let OnlineUsersList = []
io.on("connection", (socket) => {
  socket.on('UserJoined',(msg)=>{ 
    users[msg?.Id]=socket?.id;
    socket.broadcast.emit("OnlineUsers",users)
  })

  socket.on("Notification",(Data)=>{
    console.log('NotificationnData',Data)
    socket.to(users[Data.Id]).emit("IncommingNotification",{NotificationType:'FriendRequest',from:Data?.CurrId})
  })

  socket.on('disconnect', () => {
    console.log('user disconnected with id ', socket?.id)
  })

})
// Correct listen syntax
server.listen(8080, () => {
  console.log('App is listening on port 8080');
});
