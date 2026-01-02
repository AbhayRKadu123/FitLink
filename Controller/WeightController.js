import WeightTrackingTable from "../modal/WeightSchema.js"
import { UserModel } from "../modal/users.js"
import mongoose from "mongoose"

const WeightController = async (req, res) => {
    try {
        console.log('req?.user', req?.user)
        console.log('weight tracker in the home', req?.query?.TodaysDate)
        let id = new mongoose.Types.ObjectId(req?.user?.id);
        let TodaysWeight = await WeightTrackingTable.findOne({ TodaysDate: req?.query?.TodaysDate, userId: id })
        res.status(200).json({ message: 'fetch success full', Data: TodaysWeight })

        // res.status(200).json({ message: 'weight tracker' })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Side Error" })

    }
}
const GetAllWeightGraphandDetail = async (req, res) => {
    try {
        let User = await UserModel.findOne({ _id: req?.user?.id })
        console.log('User=', User)
        let WeightData = await WeightTrackingTable.find({
            username:User?.username
        })
        console.log('WeightData', WeightData)


        res.status(200).json({ message: 'fetch success full', data: WeightData })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Side Error",err:err })

    }
}
const AddWeight = async (req, res) => {
    try {

        let User = await UserModel.findOne({ _id: req?.user?.id })
        let { weight, TodaysDate } = req?.body;
        if (!weight || weight == 0) {
            return res.status(400).json({ message: "Weight is required" })

        } else if (!TodaysDate) {
            return res.status(400).json({ message: "Day is required" })

        }
        if (!User) {
            return res.status(404).json({ message: "User Not Found" })
        }
        let CheckEnteryExists = await WeightTrackingTable.findOne({ userId: req?.user?.id, TodaysDate: TodaysDate })
        if (CheckEnteryExists) {
            return res.status(400).json({ message: 'Weight Have Been Logged Already' })
        }
        let userTodaysWt = new WeightTrackingTable(
            {
                userId: req?.user?.id,
                username: User?.username,
                weight: req?.body?.weight,
                TodaysDate: req?.body?.TodaysDate,
            }
        )
        await userTodaysWt.save()
        console.log('AddWeight', req?.body)
        // setTimeout(()=>{
        res.status(200).json({ message: 'weight tracked successfully' })

     

    } catch (err) {
        return res.status(500).json({ message: "Server Side Error" })

    }

}

export { WeightController, AddWeight, GetAllWeightGraphandDetail }