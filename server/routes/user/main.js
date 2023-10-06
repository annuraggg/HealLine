import express from "express"
const router = express.Router();
import dashboardHandler from "./dashboard.js";
import doctorHandler from "./doctor.js";
import appointmentHandler from "./appointment.js";

router.use("/dashboard", dashboardHandler)
router.use("/doctor", doctorHandler)
router.use("/appointments", appointmentHandler)

export default router;