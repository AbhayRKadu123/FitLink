import { ObjectId } from "bson";
import mongoose from "mongoose";
import { type } from "os";

const WorkoutHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  PlanType: { type: String, required: true },
  Date: { type: Date, default: Date.now },
  exerciseName: { type: String, required: true },
  set: { type: Number, required: true },
  reps: { type: Number, required: true }
});


export const WorkoutHistoryModal = mongoose.model("WorkoutHistory", WorkoutHistory);