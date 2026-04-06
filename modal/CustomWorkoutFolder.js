import mongoose from 'mongoose';
const CustomWorkoutFolder = new mongoose.Schema(
    {
        username:{type:String,required:true},
        FolderName:{type:String,required:true},
        FolderDate:{type:String,required:true}
    },
    { timestamps: true }


  );


let CustomWorkoutFolders=new mongoose.model("CustomWorkoutFolder",CustomWorkoutFolder)

export default CustomWorkoutFolders;