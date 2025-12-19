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

// getFormattedToday()
const AddWorkoutSession = async (req, res) => {

  console.log('AddWorkoutSessionAddWorkoutSession=', req.user)
  try {
    // let result=await SessionSchema(req?.body)
    // res.send(result)
    let Id = req?.body?.Id;
    let User = await UserModel.findOne({ _id: req?.user?.id })
    // getISTDate
    let Res = await Session.findOne({ username: User, date: getFormattedToday() })
    if (Res) {
      return res.status(409).json({ message: 'Session Already Exist' })
    }
    if (Id) {
      let resullt = await Session.findById(Id)
      if (resullt) return res.status(409).json({ message: 'Session Already Exist' })
    }
    let session = new Session(req?.body);
    let result = await session.save()
    res.status(200).json({ result: result })


  } catch (err) {
    console.log('err', err)
    res.status(500).json({ message: "Error adding workout", err });


  }
}
const UpdateWorkoutSession = async (req, res) => {
  try {

    console.log('req.body', req.body)
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
        if (Progress?.exercises[i].sets.length !== 0 && (Progress?.exercises[i].sets[0]?.reps !== 0 && Progress?.exercises[i].sets[0]?.weight !== 0)) {
          Progresscount = Progresscount + (100 / NoOfExercise);
        }

      }
      console.log('Progress', Progresscount)
      if (Progresscount == 100) {
        Progress.isCompleted = true;
        await Progress.save()
      }
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
    //  Title: SessionTitle,
    //       date: { $lt: today },
    //       day: Day
    let result = await Session.aggregate([{ $match: { Title: SessionTitle, 
      date: { $ne: today }, day: { $eq: Day } } },
       { $limit: 1 },
       {$project:{
        exercises:{$filter:{
          input:"$exercises",
          as:"ex",
          cond:{
            $eq:[
              {$toLower:"$$ex.name"},
              Currexercise

            ]
          }


        }}
       }}


    ])
      .sort({ date: -1 });


    res.status(200).json({ result: result })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'something went wrong' })

  }

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


export { GetLastSessionHistory, DailyWorkoutSessionUpdate, GetUserProgress, GetWorkoutBarChartDetail, WorkoutHistoryDetail, GetWorkoutHistory, UpdateWorkoutSession, GetDailySession, Getworkoutsession, UserDetails, addcustomworkout, Deleteworkoutroutin, Updateworkoutroutin, updateUserActiveWorkoutPlan, AddWorkoutSession }