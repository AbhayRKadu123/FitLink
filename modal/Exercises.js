import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  muscleGroup: {
    type: String,
    required: true,
    index: true   // fast filtering
  },

  category: {
    type: String, // Push / Pull / Legs / Core / Functional
    required: true,
    index: true
  },

  type: {
    type: String, // Compound / Isolation / Bodyweight
    required: true
  },

  equipment: {
    type: String, // Barbell / Dumbbell / Machine / BW / Mixed
  },

  weighted: {
    type: Boolean,
    default: false
  },

  instructions: [{
    type: String
  }],

  gifUrl: {
    type: String,
    default: "https://mockgym.com/exercises/default.gif"
  }

}, { timestamps: true });

export const Exercises = mongoose.model("exercisenames", exerciseSchema,"exercisenames");

