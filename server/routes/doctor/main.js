import express from "express"
const router = express.Router()
import appointments from "./appointments.js"
import messages from "./messages.js"


router.use("/appointments", appointments)
router.use("/messages", messages)

export default router;