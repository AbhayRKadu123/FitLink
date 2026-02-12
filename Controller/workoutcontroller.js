import { UserModel } from "../modal/users.js"
import express from "express";
import { WorkoutRoutine } from "../modal/WorkoutRoutin.js";
import { selectedRoutineDays } from "../modal/WorkoutRoutineDays.js";
import Session from "../modal/SessionSchema.js";
import mongoose from "mongoose";
import ProgressPhotoModal from "../modal/ProgressPhotoModal.js";
import e from "express";
import { AllPointHistorys } from "../modal/AllPointHistory.js";
import { Exercises } from "../modal/Exercises.js";
let storedselectedRoutineDays = async (req, res) => {
  try {
    let User = await UserModel.findById(req?.user?.id);
    let StoredDaysArray = await selectedRoutineDays.findOne({ username: User?.username })
    // result?.daysArr
    res.status(200).json({ StoredDaysArray: StoredDaysArray?.daysArr })



  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error Getting workout", error });
  }

}
const dayIndex = {
  mon: 0,
  tue: 1,
  wed: 2,
  thur: 3,
  fri: 4,
  sat: 5,
  sun: 6
};
function arrangeDays(days) {

  return days
    .filter(day => dayIndex[day] !== undefined)
    .sort((a, b) => dayIndex[a] - dayIndex[b]);
}
let GetSelectedRoutineDays = async (req, res) => {
  try {
    let User = await UserModel.findById(req?.user?.id);
    let Day = await selectedRoutineDays.findOne({ username: User?.username });
    return res.status(200).json({ Days: Day });


  } catch (error) {
    return res.status(400).json({ message: "Error Getting workout", error });

  }


}
let UpdateSelectedRoutinedays = async (req, res) => {
  try {

    let { DaysArray } = req.body;
    console.log("DaysArray", DaysArray)
    let User = await UserModel.findById(req?.user?.id);
    let Day = await selectedRoutineDays.findOneAndUpdate({ username: User?.username }, {
      $set: {
        daysArr: DaysArray
      }
    });
    return res.status(200).json({ Days: Day });



  } catch (err) {
    return res.status(400).json({ message: "Error Getting workout", err });
  }
}
let AddselectedRoutineDays = async (req, res) => {

  try {
    let User = await UserModel.findById(req?.user?.id);
    let isDaysExists = await selectedRoutineDays.findOne({ username: User?.username })
    if (isDaysExists) {
      return res.status(401).json({ message: 'Days aready exists' })
    }
    let arr = req.body;
    arr = arrangeDays(arr);

    let Obj = {
      userId: User?._id,
      username: User?.username,
      daysArr: arr,

    }
    const DaysArr = new selectedRoutineDays(Obj)
    let result = await DaysArr.save();



    console.log("Arr", result)
    res.status(200).json({ result: result?.daysArr })
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error Getting workout", error });
  }


}

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
  try {
    //  console.log("req.body=", req.body.data)
    //   console.log("req.body=", req.body.data)
    let User = await UserModel.findById(req?.user?.id)
    let RecievedData = req?.body?.data;
    RecievedData.username = User?.username;
    let Data = new WorkoutRoutine(RecievedData)
    console.log('Data', Data)
    let result = await Data.save();
    console.log('result=', result)
    setTimeout(() => {
      res.status(200).json({ message: "New Routin Created SuccessFully", val: result })

    }, [1000])
  } catch (err) {
    res.status(500).json({ message: "Error adding routin", err });

  }

}
const Deleteworkoutroutin = async (req, res) => {
  try {
    // console.log('data deleted ', req.body.id)
    let result = await WorkoutRoutine.findByIdAndDelete(req.body.id)
    let Result = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $set: { planName: "" } },
      { new: true } // returns updated document
    );

    console.log("Result", Result)
    res.status(200).json({ result: 'deleted successfully' })


  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'server error' })
  }


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
    res.status(200).json({ message: "Update Successfull" });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating workout", error });
  }
}

const updateUserActiveWorkoutPlan = async (req, res) => {
  try {

    console.log('updateUserActiveWorkoutPlan', req?.body)
    let Id = req?.body?.Id;
    let User = await UserModel.findByIdAndUpdate({ _id: req?.user?.id }, { $set: { ActiveWorkoutPlan: Id, planName: "CustomPlan", CustomWorkoutPlanActivated: true } })
    // console.log('Routin', User)
    res.status(200).json({ message: 'Plan Activated' })
    // let 
  } catch (err) {
    res.status(500).json({ message: "Error updating workout", err });


  }

}
function getFormattedToday() {
  // const utcNow = new Date().toISOString();
  const utcDate = new Date();
  console.log('utcDate', utcDate)
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
  console.log('isodate', istDate.toISOString()?.split('T')[0]);

  return istDate.toISOString()?.split('T')[0]
}
const GetRelatedExerciseData=async (req,res)=>{
  try{
  console.log("GetRelatedExerciseData",req?.query.Val)
  let result=await Exercises.aggregate([{$match:{name:{ $regex: req?.query.Val, $options: "i"}}}]);
  // console.log(result);
  res.status(200).json({message:result})
  }catch(err){
   return res.status(500).json({ message: "Error updating workout", err });

  }


}
const GetAllPointsSum= async (req,res)=>{
  try{
     let User = await UserModel.findOne({ _id: req?.user?.id })
    let Data= await AllPointHistorys.aggregate([
      {
        $match:{username:User?.username}
      },
      {
        $group:{
          _id:null,
          Total:{"$sum":"$points"}
        }
      },
      {
        $project:{
          Total:1
        }
      }

    ])
    res.status(200).json({Data:Data})

  }catch(err){

  }
}

// getFormattedToday()
const AddWorkoutSession = async (req, res) => {

  console.log('AddWorkoutSessionAddWorkoutSession=', req.user)
  try {
    // let result=await SessionSchema(req?.body)
    // res.send(result)
    console.log("req.body=",req.body?.exercises[0])
    let Id = req?.body?.Id;
    let User = await UserModel.findOne({ _id: req?.user?.id })
    // getISTDate
    let Res = await Session.findOne({ username: User?.username, date: getFormattedToday() })
    console.log(" Res", Res)
    if (Res) {
      return res.status(409).json({ message: 'Session Already Exist' })
    }
    if (Id) {
      let resullt = await Session.findById(Id)
      if (resullt) return res.status(409).json({ message: 'Session Already Exist' })
    }
    let session = new Session({username:User.username,...req?.body});
    let result = await session.save()
    res.status(200).json({ result: result })


  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: "Error adding workout", err });


  }
}
const UpdateWorkoutSession = async (req, res) => {
  try {

    console.log('req.body', req.body?.exercises[0]?.sets)
    let { username,
      planType,
      Title,
      day,
      date,
      exercises } = req?.body;
    let result = await Session.findByIdAndUpdate({ _id: req.body._id }, {
      username,
      planType,
      Title,
      day,
      date,
      exercises
    })
    console.log("result", result)
    res.status(200).json({ result: result })
  } catch (err) {
    res.status(500).json({ message: "Error updating workout", err });


  }


}

const GetDailySession = async (req, res) => {
  try {
    console.log('req.query=', req?.query)
    let {id}=req?.user;
    let Usersexist=await UserModel.findOne({_id:id})
    if(!Usersexist){
      return res.status(401).json({message:'User Not Found'})
    }
    let { plantype, Date, Title } = req?.query
    let result = await Session.findOne({username:Usersexist?.username,planType: plantype, date: Date, Title: Title })
    console.log('result', result)
    res.status(200).json({ getworkoutsession: result })


  } catch (err) {
    console.log('err=',err)
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

const GetWorkoutHistory = async (req, res) => {
  try {
    let User = await UserModel.findById(req?.user?.id)

    let Result = await Session.aggregate([{
      $match: {
        planType: 'custom', username:
          User?.username
      }
    }, { $sort: { createdAt: -1 } }, { $project: { _id: 1, planType: 1, username: 1, date: 1, Title: 1, day: 1 } }])
    console.log('Result=', Result)
    res.send(Result)




  } catch (err) {
    res.status(400).json({ message: "something went wrong" })


  }
}

const WorkoutHistoryDetail = async (req, res) => {
  try {
    console.log('WorkoutHistoryDetail=')

    const id = new mongoose.Types.ObjectId(req?.query?.id);

    let Result = await Session.aggregate([{ $match: { _id: id } }])
    // console.log('WorkoutHistoryDetail=',Result)
    // console.log('result=before', results)

    res.status(200).json({ Result: Result })


  } catch (err) {
    console.log('err', err)
    res.status(400).json({ message: "something went wrong" })

    // consq

  }

}


const GetWorkoutBarChartDetail = async (req, res) => {
  try {
    let FinalResult = [];

    // --------------------------- UTIL FUNCTIONS ---------------------------- //

    // Safely gets prevSet for one exercise
    function GetSpecificExerciseDetail(arr, Title) {
      if (!Array.isArray(arr)) return [];

      for (let j = 0; j < arr.length; j++) {
        if (arr[j]?.name === Title) {
          return arr[j]?.sets || [];
        }
      }

      return [];
    }

    // Creates graph-friendly data for frontend charts
    function GetFormatedData(data) {
      const prev = Array.isArray(data?.prevSet) ? data.prevSet : [];
      const curr = Array.isArray(data?.TodaysSet) ? data.TodaysSet : [];

      const longest = prev.length > curr.length ? prev : curr;
      let formatted = [];

      for (let i = 0; i < longest.length; i++) {
        formatted.push({
          set: i + 1,
          lastReps: prev[i]?.reps || 0,
          lastWeight: prev[i]?.weight || 0,
          currentReps: curr[i]?.reps || 0,
          currentWeight: curr[i]?.weight || 0
        });
      }

      return {
        name: data?.name || "Unknown",
        Data: formatted
      };
    }

    // --------------------------- MAIN LOGIC ---------------------------- //

    const Id = new mongoose.Types.ObjectId(req?.query?.id);
    const sessionData = await Session.findById(Id);

    if (!sessionData) {
      return res.status(404).json({ error: true, message: "Session not found" });
    }

    const title = sessionData?.Title;
    const givenDate = sessionData?.createdAt;

    const GraphData = await Session.aggregate([
      { $match: { Title: title, createdAt: { $lte: givenDate } } },
      { $sort: { createdAt: -1 } },
      { $project: { exercises: 1 } }
    ]);

    if (!Array.isArray(GraphData) || GraphData.length === 0) {
      return res.status(200).json({ result: [] });
    }

    const today = GraphData[0]?.exercises || [];
    const hasPrev = GraphData.length > 1;
    const previous = hasPrev ? GraphData[1]?.exercises || [] : [];

    let graphResult = [];

    for (let i = 0; i < today.length; i++) {
      const exerciseName = today[i]?.name;

      const prevSetData = hasPrev
        ? GetSpecificExerciseDetail(previous, exerciseName)
        : [];

      const todaySetData = Array.isArray(today[i]?.sets)
        ? today[i].sets
        : [];

      graphResult.push({
        name: exerciseName || "Unknown",
        prevSet: prevSetData,
        TodaysSet: todaySetData
      });
    }

    // Format all results
    for (let i = 0; i < graphResult.length; i++) {
      FinalResult.push(GetFormatedData(graphResult[i]));
    }

    return res.status(200).json({ result: FinalResult });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, message: err.message || "Something went wrong" });
  }
};
const UpdateCustomWorkoutPlan = async (req, res) => {
  try {
    const { Id } = req?.query;
    const result = await WorkoutRoutine.findById(Id);
    if (!result) {
      return res.status(404).json({ message: "Routine not found" });
    }

    const days = ["mon", "tue", "wed", "thur", "fri", "sat", "sun"];

    days.forEach((day) => {
      if (req.body[day] !== undefined) {
        result[day] = req.body[day];
      }
    });

    await result.save();

    return res.status(200).json({ message: "Routine updated successfully", result });


    // await Result.save()



  } catch (err) {
    return res.status(400).json({ error: true, message: err.message || "Something went wrong" });


  }
}
const DeleteWorkoutRoutineExerise = async (req, res) => {
  console.log("DeleteWorkoutRoutineExerise", req?.body)
  let { Day, id } = req.body;

  const result = await WorkoutRoutine.findById(id);
  if (!result) {
    return res.status(404).json({ message: "Routine not found" });
  }

  if (!result[Day]) {
    return res.status(400).json({ message: "Invalid day provided" });
  }

  result[Day].Title = "";
  result[Day].exercises = [];

  await result.save();



  res.status(200).json({ message: 'routine deleted' })
}
const GetUserProgress = async (req, res) => {

  try {
    console.log('req.query date in progressbar', req.query.Date)
    let Date = req.query.Date
    let User = await UserModel.findById(req?.user?.id)
    let Progress = await Session.findOne({ date: Date, username: User?.username })

    if (Progress) {
      let NoOfExercise = Progress?.exercises?.length;
      let Progresscount = 0;

      for (let i = 0; i < NoOfExercise; i++) {
        const sets = Progress?.exercises[i]?.sets;
        if (!sets || sets.length === 0) continue;

        const completedSets = sets.filter(
          set => set?.reps > 0 && set?.weight > 0 && set?.isSetCompleted
        ).length;

        const exerciseProgress = (completedSets / sets.length) * (100 / NoOfExercise);

        Progresscount += exerciseProgress;
      }


      console.log('Progress', Progresscount)
      let IsPointAllocated=await AllPointHistorys.findOne({username:User?.username,Date:getFormattedToday(), PointsType:"WorkoutComplete"})
        Progress.isCompleted = true;
     
      if (Progresscount ==100) {
         if(!IsPointAllocated){
        
      
        // AllPointHistorys
        let data= {
        PointsType:"WorkoutComplete",
        username:User?.username,
        Date:getFormattedToday(),

        points:5}
        let NewPoint=new AllPointHistorys(data);
       let Val= await NewPoint.save();
        await Progress.save()
        console.log(Val)
      }}
      res.status(200).json({ ProgressPercentage: Progresscount })



    } else {
      res.status(200).json({ ProgressPercentage: 0 })
    }

  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: true, message: err.message || "Something went wrong" });


  }

}

const DailyWorkoutSessionUpdate = async (req, res) => {
  try {
    const { Date, ReqDay } = req.body;

    const user = await UserModel.findById(req.user.id);

    const existingSession = await Session.findOne({
      username: user.username,
      day: ReqDay,
      date: Date
    });

    if (existingSession) {
      return res.status(200).json({ message: "session already exists" });
    }

    // get routine
    const routine = await WorkoutRoutine.findOne({ username: user.username });

    if (!routine || !routine.mon) {
      return res.status(400).json({ message: "routine not found" });
    }

    const newSessionObj = {
      username: user.username,
      planType: "custom",
      Title: routine[ReqDay].Title,
      exercises: routine[ReqDay].exercises.map((ele) => ({
        name: ele,
        sets: [{ reps: 0, weight: 0 }]
      })),
      day: ReqDay,
      date: Date
    };

    const created = await Session.create(newSessionObj);

    return res.status(201).json({
      message: "Session created",
      session: created
    });

  } catch (err) {
    console.log("err", err);
    return res.status(400).json({
      error: true,
      message: err.message || "Something went wrong"
    });
  }
};
const GetAllExercisesLastSessionHistory = async (req, res) => {

  try {
    let { SessionTitle, Day } = req?.query;
    if (!SessionTitle || !Day) {
      return null
    }
    const today = getFormattedToday();
    let User = await UserModel.findById(req?.user?.id)
    let result = await Session.findOne({
      username: User?.username,
      day: Day,
      date: { $lt: today } // strictly before today
    }).sort({ date: -1 });

    res.status(200).json({ result: result })



  } catch (err) {

    res.status(500).json({ message: 'something went wrong' })



  }


}

const GetLastSessionHistory = async (req, res) => {
  console.log('Last session history', req?.query)

  try {
    let { SessionTitle, Currexercise, Day } = req?.query;
    Currexercise = Currexercise.trim().toLowerCase();


    if (!SessionTitle || !Currexercise || !Day) {
      return null
    }
    const today = getFormattedToday();
    let User = await UserModel.findById(req?.user?.id)
    console.log('req?.user?.id', req?.user?.id)
    let result = await Session.aggregate([{
      $match: {
        username: User?.username,

        Title: SessionTitle,
        date: { $lt: today }, day: { $eq: Day }
      }
    },
    { $sort: { date: -1 } },
    { $limit: 1 },
    {
      $project: {
        exercises: {
          $filter: {
            input: "$exercises",
            as: "ex",
            cond: {
              $eq: [
                { $toLower: "$$ex.name" },
                Currexercise

              ]
            }


          }
        }
      }
    }


    ])

    res.status(200).json({ result: result })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'something went wrong' })

  }

}
const Currentexerise= async (req,res)=>{
  try{
console.log("CurrExerciseDetail",req.query.name)
  let {name}=req.query;
  if(!name){
    return null;
  }
  let result=await Exercises.findOne({name:name})

  return res.status(200).json({Currentexerise:result})
  }catch(err){
    res.status(500).json({ message: 'something went wrong' })

  }
  
}
const UpdateUserWorkoutHistory = async (req, res) => {
  try {

    let Exercises = req?.body?.Exercises;
    let id = req?.body?.id;
    let Sessionn = await Session.findByIdAndUpdate({ _id: id }, { $set: { exercises: Exercises } })
    console.log(Sessionn)
    res.status(200).json({ message: 'Update successfull' })

  }
  catch (err) {
    console.log(err)
    res.status(500).json({ message: 'something went wrong' })

  }

  // console.log(req.body)
}
const GetAllProgressPhoto=async (req,res)=>{
  console.log("GetAllProgressPhoto")

  try{
    const userId = new mongoose.Types.ObjectId(req.user.id)
    let result=await ProgressPhotoModal.aggregate([{$match:{user:userId}},
      {
    $group: {
      _id: "$TodaysDate",
      Photos: { $push: "$$ROOT" }
    }
  }


    ])
    console.log("result=",result)
    res.status(200).json({data:result})


  }catch(err){
       res.status(500).json({ message: 'Server Side error',error:err })

  }
}
const AddProgressPhoto = async (req, res) => {
  console.log("ProgressPhotoSchema", req?.body)
  try {
    let { ImageUrl } = req?.body;
    let Data={
      user: req?.user?.id,
          
              imageUrl: ImageUrl,
             TodaysDate:getFormattedToday(),
        

    }
    let IsPhotoExists=await ProgressPhotoModal.find({user:req?.user?.id,TodaysDate:getFormattedToday()})
    console.log("IsPhotoExists",IsPhotoExists)
    if(IsPhotoExists.length>=3){
      return res.status(400).json({message:'Add Progress Photo Limit reached'})
    }
    let Result= new ProgressPhotoModal(Data)
    Result=await Result.save();



    res.status(200).json({ message: 'Upload succesfull',Result:Result })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server Side error',error:err })


  }


  // ProgressPhotoSchema
}

// const GetWorkoutBarChartDetail = async (req, res) => {
//   try {

//     //        const pullupSets = [
//     //   { set: 1, lastReps: 8, lastWeight: 10, currentReps: 10, currentWeight: 0 },
//     //   { set: 2, lastReps: 6, lastWeight: 9, currentReps: 8, currentWeight: 40 },
//     //   { set: 3, lastReps: 5, lastWeight: 5, currentReps: 6, currentWeight: 10 },
//     //   { set: 4, lastReps: 5, lastWeight: 5, currentReps: 6, currentWeight: 10 },
//     //   { set: 5, lastReps: 5, lastWeight: 5, currentReps: 6, currentWeight: 10 },

//     // ];
//     let FinalResult = []

// function GetFormatedData(data) {
//   let prev = Array.isArray(data?.prevSet) ? data.prevSet : [];
//   let curr = Array.isArray(data?.TodaysSet) ? data.TodaysSet : [];

//   let Arr = prev.length > curr.length ? prev : curr;

//   let Data = [];

//   for (let i = 0; i < Arr.length; i++) {
//     Data.push({
//       set: i + 1,
//       lastReps: prev[i]?.reps || 0,
//       lastWeight: prev[i]?.weight || 0,
//       currentReps: curr[i]?.reps || 0,
//       currentWeight: curr[i]?.weight || 0
//     });
//   }

//   return {
//     name: data?.name || "Unknown",
//     Data
//   };
// }


//     function GetSpecificExerciseDetail(arr, Title) {
//   if (!arr || !Array.isArray(arr)) return [];

//   for (let j = 0; j < arr.length; j++) {
//     if (arr[j]?.name === Title) {
//       return arr[j]?.sets || [];
//     }
//   }

//   return [];
// }

//     const Id = new mongoose.Types.ObjectId(req?.query?.id);
//     let Result = await Session.findById(Id)
//     let title = Result?.Title
//     let givenDate = Result?.createdAt;
//     // console.log('day', Result)
//     let GraphData = await Session.aggregate([{ $match: { Title: title, createdAt: { $lte: givenDate } } }, { $sort: { createdAt: -1 } }, { $project: { exercises: 1 } }])
//     // console.log('ResultGraphData0', GraphData[0].exercises)
//     // console.log('ResultGraphData1', GraphData[1].exercises)
//     let graphResult = []

//     for (let i = 0; i < GraphData[0].exercises.length; i++) {
//       let PreviousSetData = GetSpecificExerciseDetail(GraphData[1]?.exercises, GraphData[0]?.exercises[i]?.name) || []
//       let CurrentData = GraphData[0]?.exercises[i].sets || []
//       let Obj = { name: GraphData[0]?.exercises[i]?.name, prevSet: PreviousSetData, TodaysSet: CurrentData }
//       graphResult.push(Obj)
//     }
//     for (let i = 0; i < graphResult.length; i++) {
//       let result = GetFormatedData(graphResult[i])
//       FinalResult?.push(result)


//     }
//     // console.log('graphResult=', graphResult)

//     res.status(200).json({ result: FinalResult })



//   } catch (err) {
//     console.log(err)
//     res.status(400).json({ message: "something went wrong" })
//   }
// }

export {Currentexerise,GetRelatedExerciseData,GetAllPointsSum,GetAllProgressPhoto, AddProgressPhoto, DeleteWorkoutRoutineExerise, UpdateCustomWorkoutPlan, UpdateSelectedRoutinedays, GetSelectedRoutineDays, storedselectedRoutineDays, AddselectedRoutineDays, GetAllExercisesLastSessionHistory, UpdateUserWorkoutHistory, GetLastSessionHistory, DailyWorkoutSessionUpdate, GetUserProgress, GetWorkoutBarChartDetail, WorkoutHistoryDetail, GetWorkoutHistory, UpdateWorkoutSession, GetDailySession, Getworkoutsession, UserDetails, addcustomworkout, Deleteworkoutroutin, Updateworkoutroutin, updateUserActiveWorkoutPlan, AddWorkoutSession }