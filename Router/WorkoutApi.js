import express from "express"
import {WorkoutHistoryDetail,GetWorkoutHistory,UpdateWorkoutSession,GetDailySession,Getworkoutsession, UserDetails,addcustomworkout,Deleteworkoutroutin,Updateworkoutroutin,updateUserActiveWorkoutPlan,AddWorkoutSession


 } from "../Controller/workoutcontroller.js";
 import { verifyToken } from "../MiddleWare/VerifyToken.js";

const WorkoutApi = express.Router(); // ✅ create router instance

WorkoutApi.get("/getUserExercise",verifyToken,UserDetails)
// app.post("/Workout/CustomWorkout",
WorkoutApi.post("/CustomWorkout",verifyToken,addcustomworkout)
// "/Workout/DeleteRoutin"
WorkoutApi.delete("/DeleteRoutin",verifyToken,Deleteworkoutroutin)
// /workout/UpdateRoutin/:id
WorkoutApi.put("/UpdateRoutin/:id",verifyToken,Updateworkoutroutin)
WorkoutApi.put("/updateUserActiveWorkoutPlan",verifyToken,updateUserActiveWorkoutPlan)
WorkoutApi.post("/addworkoutsession",AddWorkoutSession);
WorkoutApi.get("/getworkoutsession",Getworkoutsession)
WorkoutApi.get("/GetDailySession",GetDailySession)
WorkoutApi.put("/UpdateWorkoutSession",UpdateWorkoutSession)
WorkoutApi.get("/GetWorkoutHistory",GetWorkoutHistory)
WorkoutApi.get("/WorkoutHistoryDetail",WorkoutHistoryDetail)

export default WorkoutApi;