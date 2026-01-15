import mongoose from "mongoose";
import { type } from "os";

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    // unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  ActiveWorkoutPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutPlan",
    default: null
  },
  planName:{
    type:String
  },
  WorkoutHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkoutHistory",
    default: null
  },
  accounttype:{
    type:String,
    default:'public'
  },
  Posts:{
    type:[mongoose.Schema.Types.ObjectId],
    ref: "PostsSchema",
    default: []

  },
  Friends:{
     type:[mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []

  },
  FriendRequest:{
     type:[mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []

  },

  LoginCount:{
    type:Number,
    default:0
  },
  CustomWorkoutPlanActivated:{
    type:Boolean,
    default:false
  },
  isPremium:{
    type:Boolean,
    default:false

  },
  Otp:{
    type:String
  },
  otpExpiry: {
    type:Date
  },
    Bio:{
    type:String,
    default:'We Love Fitlin!'
  },
  UserProfileUrl:{
     type:String,
     default:""
  },
  Weight:{
    type:Number
  },
  age:{
    type:Number
  },
  goal:{
     type:String,
  },
  height:{
    type:Number
  },
  Bmi:{
    type:String,
  },
  Bio:{
    type:String,
  },
  Gender:{
    type:String,
  },
  fullname:{
    type:String,

  }
  

});

export const UserModel = mongoose.model("User", UserSchema);
