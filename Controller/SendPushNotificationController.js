import { sendPush } from "../utils/Push.js";

let subscriptionStore = null;

export const Subscribe = (req, res) => {
  subscriptionStore = req.body; // ✅ FIXED
  console.log("Subscription saved");

  res.status(201).json({ message: "Subscribed" });
};

export const Notify = async (req, res) => {
  if (!subscriptionStore) {
    return res.status(400).json({ error: "No subscription found" });
  }

  try {
    await sendPush(subscriptionStore, "You missed today’s workout 💪");
    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: "Push failed" });
  }
};
