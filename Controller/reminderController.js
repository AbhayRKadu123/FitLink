// controllers/reminderController.js
import User from "../models/User.js";
import WeightTracking from "../models/WeightTracking.js";
import WorkoutSession from "../models/WorkoutSession.js";
import getTodayIST from "../utils/getTodayIST.js";
import { sendEmail } from "../utils/sendEmail.js"; // SendGrid version

export async function sendDailyReminders(req, res) {
  try {
    const today = getTodayIST(); // 'YYYY-MM-DD'
    // fetch all users (or only active ones)
    const users = await User.find({}); // add filters if needed

    const results = {
      totalUsers: users.length,
      emailed: 0,
      skipped: 0,
      errors: []
    };

    // Option A: naive loop (simple)
    for (const u of users) {
      try {
        const hasWeight = await WeightTracking.exists({
          username: u.username,
          TodaysDate: today
        });

        const hasSession = await WorkoutSession.exists({
          username: u.username,
          date: today
        });

        // if user has either logged weight OR started session, no mail
        if (hasWeight && hasSession) {
          results.skipped++;
          continue;
        }

        // Build email content
        let html = `<p>Hi ${u.username},</p><p>We noticed:</p><ul>`;
        if (!hasWeight) html += "<li>You haven't logged your weight today.</li>";
        if (!hasSession) html += "<li>You haven't started a workout session today.</li>";
        html += `</ul><p>Open the app to log your progress — consistency wins! 💪</p>`;
        const subject = "Daily fitness reminder";

        await sendEmail(u.email, subject, html);
        results.emailed++;
      } catch (errUser) {
        console.error("Error processing user", u.username, errUser);
        results.errors.push({ user: u.username, error: String(errUser) });
      }
    }

    return res.json({ ok: true, results });
  } catch (err) {
    console.error("sendDailyReminders error", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
