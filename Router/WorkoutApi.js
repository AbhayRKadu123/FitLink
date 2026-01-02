import express from "express"
import {DeleteWorkoutRoutineExerise,UpdateCustomWorkoutPlan,UpdateSelectedRoutinedays,GetSelectedRoutineDays,storedselectedRoutineDays,AddselectedRoutineDays,GetAllExercisesLastSessionHistory,UpdateUserWorkoutHistory,GetLastSessionHistory,DailyWorkoutSessionUpdate,GetUserProgress,GetWorkoutBarChartDetail,WorkoutHistoryDetail,GetWorkoutHistory,UpdateWorkoutSession,GetDailySession,Getworkoutsession, UserDetails,addcustomworkout,Deleteworkoutroutin,Updateworkoutroutin,updateUserActiveWorkoutPlan,AddWorkoutSession


 } from "../Controller/workoutcontroller.js";
 import { verifyToken } from "../MiddleWare/VerifyToken.js";

const WorkoutApi = express.Router(); // ✅ create router instance

WorkoutApi.get("/GetSelectedRoutineDays",verifyToken,GetSelectedRoutineDays)
WorkoutApi.put("/UpdateSelectedRoutinedays",verifyToken,UpdateSelectedRoutinedays);
WorkoutApi.put("/UpdateCustomWorkoutPlan",UpdateCustomWorkoutPlan)
WorkoutApi.put("/DeleteWorkoutRoutineExerise",verifyToken,DeleteWorkoutRoutineExerise)

WorkoutApi.get("/getUserExercise",verifyToken,UserDetails)
WorkoutApi.get("/storedselectedRoutineDays",verifyToken,storedselectedRoutineDays)
WorkoutApi.post("/AddselectedRoutineDays",verifyToken,AddselectedRoutineDays)
// app.post("/Workout/CustomWorkout",
WorkoutApi.post("/CustomWorkout",verifyToken,addcustomworkout)
// "/Workout/DeleteRoutin"
WorkoutApi.delete("/DeleteRoutin",verifyToken,Deleteworkoutroutin)
WorkoutApi.get("/GetLastSessionHistory",verifyToken,GetLastSessionHistory)
// /workout/UpdateRoutin/:id
WorkoutApi.put("/UpdateUserWorkoutHistory",verifyToken,UpdateUserWorkoutHistory)
WorkoutApi.get("/GetAllExercisesLastSessionHistory",verifyToken,GetAllExercisesLastSessionHistory)
WorkoutApi.put("/UpdateRoutin/:id",verifyToken,Updateworkoutroutin)
WorkoutApi.put("/updateUserActiveWorkoutPlan",verifyToken,updateUserActiveWorkoutPlan)
WorkoutApi.post("/addworkoutsession",verifyToken,AddWorkoutSession);
WorkoutApi.get("/getworkoutsession",verifyToken,Getworkoutsession)
WorkoutApi.get("/GetDailySession",verifyToken,GetDailySession)
WorkoutApi.put("/UpdateWorkoutSession",verifyToken,UpdateWorkoutSession)
WorkoutApi.get("/GetWorkoutHistory",verifyToken,GetWorkoutHistory)
WorkoutApi.get("/WorkoutHistoryDetail",verifyToken,WorkoutHistoryDetail)
WorkoutApi.get("/GetWorkoutBarChartDetail",verifyToken,GetWorkoutBarChartDetail)
WorkoutApi.get("/GetUserProgress",verifyToken,GetUserProgress)
WorkoutApi.post("/DailyWorkoutSessionUpdate",verifyToken,DailyWorkoutSessionUpdate)

export default WorkoutApi;