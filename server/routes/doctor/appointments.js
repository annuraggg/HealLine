import express from "express";
import { apppointmentCol, userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
import { verifyToken } from "../../apis/jwt.js";
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    const appointments = await apppointmentCol
      .find({ doctorName: id.toString() })
      .toArray();

    for (const appointment of appointments) {
      const patient = await userCol.findOne({
        _id: new ObjectId(appointment.patientName),
      });
      if (patient) {
        appointment.patientName = patient.fName + " " + patient.lName;
      }
    }
    res.json({ success: true, appointments: appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await apppointmentCol.findOne({
      _id: new ObjectId(id),
    });
    res.json({ success: true, appointment: appointment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:id/accept", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    await apppointmentCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "accepted" } }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:id/reject", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    await apppointmentCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "rejected" } }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
