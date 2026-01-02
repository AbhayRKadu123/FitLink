import webpush from "web-push";

webpush.setVapidDetails(
  'mailto:abhaykadu2201@gmail.com',
  'BG2Ec75sVaASZ4kVtEB3h-v4TIh-65TfjsL0ym3ScVQvJGWFPvPZm2kITk2lKMpxuY5r8m1Dl_wsJR2-DNzEYfU',
  '9S0OTWdVgOxc889Vj4lsQojB0paUdnfu6_bD-hXQFto'
);
export const sendPush = async (subscription, message) => {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Workout Reminder 💪",
        body: message,
      })
    );
  } catch (err) {
    if (err.statusCode === 410) {
      console.log("Subscription expired, remove from DB");
      // delete subscription from DB here
    } else {
      throw err;
    }
  }
};
