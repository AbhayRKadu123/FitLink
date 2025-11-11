import { UserModel } from "../modal/users.js"
import express from "express";
import { WorkoutRoutine } from "../modal/WorkoutRoutin.js";
import Session from "../modal/SessionSchema.js";
import mongoose from "mongoose";

let UserDetails = async (req, res) => {

  try {
    let User = await UserModel.findById(req?.user?.id)
    let result = await WorkoutRoutine.findOne({ username: User?.username })
    // console.log('result=', req.user?.id)
    res.json({ result: result })

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error Getting workout", error });
  }

}
const addcustomworkout = async (req, res) => {
  console.log("req.body=", req.body.data)
  console.log("req.body=", req.body.data)
  let Data = new WorkoutRoutine(req.body.data)
  let result = await Data.save();
  // console.log('result=',result?.Id)

  res.json({ val: result })
}
const Deleteworkoutroutin = async (req, res) => {

  // console.log('data deleted ', req.body.id)
  let result = await WorkoutRoutine.findByIdAndDelete(req.body.id)
  res.status(200).json({ result: 'deleted successfully' })
}

const Updateworkoutroutin = async (req, res) => {

  try {
    let { day, title, exercise } = req.body;
    let { id } = req.params;
    console.log('req.body', req.body)
    console.log('id', id)
    if (title.trim() == "") return res.status(400).json({ message: 'Title is required' })
    if (exercise.length <= 0) return res.status(400).json({ message: 'Add at least one exercise' })

    if (!id) return res.status(400).json({ message: 'id is required' })
    if (!day) return res.status(400).json({ message: 'day is required' })


    let result = await WorkoutRoutine.findOne({ _id: id })

    result[day].Title = title;
    result[day].exercises = exercise
    // console.log('result=after',result)
    let updateddata = await result.save();

    // console.log("updateddata", updateddata)


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating workout", error });
  }
}

const updateUserActiveWorkoutPlan = async (req, res) => {
  try {

    // console.log('updateUserActiveWorkoutPlan', req?.body?.Id)
    let Id = req?.body?.Id;
    let User = await UserModel.findByIdAndUpdate({ _id: req?.user?.id }, { $set: { ActiveWorkoutPlan: Id, planName: "CustomPlan" } })
    // console.log('Routin', User)

    // let 
  } catch (err) {
    res.status(500).json({ message: "Error updating workout", err });


  }

}
const AddWorkoutSession = async (req, res) => {

  console.log('AddWorkoutSessionAddWorkoutSession=', req.body)
  try {
    // let result=await SessionSchema(req?.body)
    // res.send(result)
    let session = new Session(req?.body);
    let result = await session.save()
    res.status(200).json({ result: result })


  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: "Error adding workout", err});


  }
}
const UpdateWorkoutSession = async (req, res) => {
  try{

console.log('req.body', req.body)
let {username,
  planType,
  Title,
  day,
  date,
  exercises}=req?.body;
let result=await Session.findByIdAndUpdate({_id:req.body._id},{username,
  planType,
  Title,
  day,
  date,
  exercises})
  console.log("result",result)
  res.status(200).json({ result: result })
  }catch(err){
    res.status(500).json({ message: "Error updating workout", err });


  }

  
}

const GetDailySession = async (req, res) => {
  try {
    console.log('req.query=', req?.query)
    let { plantype, Date, Title } = req?.query
    let result = await Session.findOne({ planType: plantype, date: Date, Title: Title })
    console.log('result', result)
    res.status(200).json({ getworkoutsession: result })


  } catch (err) {
    res.status(400).json({ message: "Error getting workout", err });


  }
}

const Getworkoutsession = async (req, res) => {
  try {
    // let Result=await WorkoutRoutine.findById(req?.)
    // console.log('req.query', req.query)
    let { ID, NestedId, ReqDay } = req.query;
    if (!ID || !NestedId) {
      return res.status(400).json({ message: 'ID Or Nested ID is missing' })
    }
    let result = await WorkoutRoutine.findOne({ _id: ID })
    // console.log(result?.[ReqDay])
    setTimeout(() => {
      res.json({ result: result?.[ReqDay] })

    }, 2000)


  } catch (Err) {
    res.status(400).json({ message: "something went wrong" })

  }
}

const GetWorkoutHistory=async (req,res)=>{
  try{
   let Result = await Session.aggregate([{$match:{planType:'custom'}},{$sort:{createdAt:-1}},{$project:{_id:1,planType:1,username:1,date:1,Title:1}}])
   console.log('Result=',Result)
   res.send(Result)




  }catch(err){
    res.status(400).json({ message: "something went wrong" })


  }
}

const WorkoutHistoryDetail=async (req,res)=>{
try{
  console.log('WorkoutHistoryDetail=')
  
  const id = new mongoose.Types.ObjectId(req?.query?.id);

  let Result=await Session.aggregate([{$match:{_id:id}}])
  // console.log('WorkoutHistoryDetail=',Result)
    // console.log('result=before', results)

  res.status(200).json({Result:Result})


}catch(err){
  console.log('err',err)
    res.status(400).json({ message: "something went wrong" })

  // consq

}

}


export {WorkoutHistoryDetail,GetWorkoutHistory, UpdateWorkoutSession, GetDailySession, Getworkoutsession, UserDetails, addcustomworkout, Deleteworkoutroutin, Updateworkoutroutin, updateUserActiveWorkoutPlan, AddWorkoutSession }