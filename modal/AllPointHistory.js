import mongoose from "mongoose";
const AllPointHistory = new mongoose.Schema({
    paymentMethod: {
        type: "String",
        },
        PointsType:{
            type: "String"

        },
        username: {
            type: "String"
        },

        points: {
            type: "Number"
        },
        Date:{
            type:String
        }



    
})


export const AllPointHistorys = mongoose.model("AllPointHistory", AllPointHistory);