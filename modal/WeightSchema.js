// models/Weight.js
import mongoose from "mongoose";

const weightSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId,ref: "User"},
  username:{type:String},

  weight: Number,
  TodaysDate:{type:String},
  date: {
    type: Date,
    default: Date.now,
  }
});
 const WeightTrackingTable=new mongoose.model("Weight", weightSchema);
export default WeightTrackingTable;
