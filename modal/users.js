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
  }
});

export const UserModel = mongoose.model("User", UserSchema);
