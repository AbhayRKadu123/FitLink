import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  reps: { type: Number },
  weight: { type: Number}, // in kg or lbs
});

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  sets: { type: [SetSchema], default: [] },
});

const SessionSchema = new mongoose.Schema({
    username:{type:String,required:true},
  planType: { type: String, enum: ["strength", "hypertrophy", "endurance", "power", "custom"], default: "custom" },

  Title: { type: String, default: "" },
  exercises: { type: [ExerciseSchema], default: [] },
  day: { type: String },
  date: { type:String, required: true }, // 👈 New field — must be provided when creating a Day
} ,{ timestamps: true });

// export default SessionSchema;
let Session=new mongoose.model("Session",SessionSchema)

export default Session
