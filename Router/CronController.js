// routes/cronRoutes.js
import express from "express";
import { sendDailyReminders } from "../controllers/reminderController.js";

const router = express.Router();

router.get("/run-daily-reminder", sendDailyReminders);

export default router;
