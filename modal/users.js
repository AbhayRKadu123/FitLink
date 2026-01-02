import mongoose from "mongoose";

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
  Bio:{
    type:String,
    default:'We Love Fitlin!'
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

  }

});

export const UserModel = mongoose.model("User", UserSchema);
