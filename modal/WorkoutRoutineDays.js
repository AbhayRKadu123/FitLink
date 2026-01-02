import { ObjectId } from "bson";
import mongoose from "mongoose";
import { type } from "os";

const RoutineDays = new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId,ref: "User"},
      username:{type:String},
  daysArr: { type: [String], default: [] },
  
});

export const selectedRoutineDays = mongoose.model("RoutineDays", RoutineDays);
