import { ObjectId } from "bson";
import mongoose from "mongoose";
import { type } from "os";

const DaySchema = new mongoose.Schema({
    // username:{type:String,required:true},
  Title: { type: String, default: "" },
  exercises: { type: [String], default: [] },
  day: { type: String },
});

const WorkoutRoutineSchema = new mongoose.Schema({
    userId:{type:ObjectId},
    username:{type:String,required:true},
  mon: { type: DaySchema, default: { day: "monday" } },
  tue: { type: DaySchema, default: { day: "tuesday" } },
  wed: { type: DaySchema, default: { day: "wednesday" } },
  thur: { type: DaySchema, default: { day: "thursday" } },
  fri: { type: DaySchema, default: { day: "friday" } },
  sat: { type: DaySchema, default: { day: "saturday" } },
  sun: { type: DaySchema, default: { day: "sunday" } },
});

export const WorkoutRoutine = mongoose.model("WorkoutRoutine", WorkoutRoutineSchema);
