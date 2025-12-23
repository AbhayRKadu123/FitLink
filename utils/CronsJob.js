import cron from 'node-cron';
import { sendEmail } from './sendEmail.js';
import { sendPush } from './Push.js';
import { UserModel } from '../modal/users.js';
import { WorkoutRoutine } from '../modal/WorkoutRoutin.js';
import Session from '../modal/SessionSchema.js';


// const recipient = 'abhaykadu203@gmail.com';
// const msg = 'This is a test message for you. Have a great day!';
function getFormattedYesterday() {
  const utcDate = new Date();

  // Convert UTC → IST
  const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

  // Go back 1 day
  istDate.setDate(istDate.getDate() - 1);

  const formattedDate = istDate.toISOString().split('T')[0];

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayName = days[istDate.getDay()];

  return {
    date: formattedDate,
    day: dayName
  };
}

async function CreateDefaultWorkoutRoutine(Routine, date, day, username) {
  
let UserDetail=await UserModel.findOne({username:username})
console.log('UserDetail=',UserDetail?.email)


  const Exercises = Routine?.exercises?.map((ele) => {

    return {
      name: ele,

      sets: []


    }

  })

  let Defaultsession = {
    username: username,
    planType: "custom",
    isCompleted: false,
    Title: Routine?.Title,
    exercises: Exercises,
    day: day,
    date: date




  }
  
  let NewSession = new Session(Defaultsession)
  await NewSession.save();
  await sendEmail(UserDetail?.email,"Missed Your Todays Workout","if You Forgot to log workout u can still log workout from History section ")
  console.log('Create Default workout routine', Defaultsession)
}

function GetSpecificUserWorkoutRoutine(WorkoutRoutines, username, day) {
  let Routine = null;
  for (let ele of WorkoutRoutines) {

    if (ele?.username == username && ele[day]) {
      Routine = ele[day];
      break;

    }
  }

  return Routine;
}


cron.schedule(
  '5 0 * * *', // 12:01 AM
  async () => {
    try {
      let Users = await UserModel.aggregate([
        {
          $project: {
            username: 1,
            _id: 0
          }
        }
      ]);

      let AllUsers = [];

      for (const ele of Users) {
        AllUsers.push(ele.username);
      }

      let WorkoutRoutines = await WorkoutRoutine.aggregate([
        {
          $match: {
            username: { $in: AllUsers }
          }
        }
      ]);
      let DateDay = getFormattedYesterday()
      // console.log("WorkoutRoutines",WorkoutRoutines)


      for (const ele of WorkoutRoutines) {

        let IsSessionPresent = await Session.findOne({ username: ele?.username, day: DateDay?.day, date: DateDay?.date })
        if (!IsSessionPresent) {
          let Routine = GetSpecificUserWorkoutRoutine(WorkoutRoutines, ele?.username,DateDay?.day)
          // console.log(`Routine of ${ele?.username}`, Routine)
          if (Routine) {
            // date,day,username
            CreateDefaultWorkoutRoutine(Routine, DateDay?.date, DateDay?.day, ele?.username)

          }
        }

      }








      // console.log('Database updated WorkoutRoutines', getFormattedYesterday());
    } catch (err) {
      console.error(err);
    }
  },
  {
    timezone: 'Asia/Kolkata', // Run in IST
  }
);
