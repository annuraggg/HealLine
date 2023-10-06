import express from "express";
import { apppointmentCol, userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";

router.post("/",verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const appointments = await apppointmentCol
      .find({ patientName: id.toString() })
      .toArray();
    for (const appointment of appointments) {
      const doctor = await userCol.findOne({
        _id: new ObjectId(appointment.doctorName),
      });
      appointment.doctorFName = doctor.fName + " " + doctor.lName;
    }

    res.json({ success: true, appointments: appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
