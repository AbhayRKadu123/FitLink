import mongoose from "mongoose";
const UserPaymentMethods = new mongoose.Schema({
    paymentMethod: {
        type: "String",
        },
        username: {
            type: "String"
        },
        Id: {
            type: "String"
        },
        number: {
            type: "Number"
        },



    
})


export const Transictions = mongoose.model("PayMentsMethods", UserPaymentMethods);