import mongoose from "mongoose"
const ProgressPhotoSchema=new mongoose.Schema({
     user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    
        imageUrl: {
            type: String,
            required: true
        },
       TodaysDate:{type:String},
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model("ProgressPhotos", ProgressPhotoSchema);
// ProgressPhotoModal