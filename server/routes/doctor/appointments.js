import express from "express";
import { apppointmentCol, userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
import { verifyToken } from "../../apis/jwt.js";
import { CompositionHookListInstance } from "twilio/lib/rest/video/v1/compositionHook.js";
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id)
    const appointments = await apppointmentCol
      .find({ doctorName: id.toString() })
      .toArray();

      console.log(appointments)

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
      { $set: { status: "approved" } }
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

router.post("/approvedUnits", verifyToken, async (req, res) => {
  console.log("HIT")
  try {
    const { id } = req.body;
    console.log(id);
    const appointments = await apppointmentCol
      .find({ patientName: id.toString(), status: "approved" })
      .toArray();

      console.log(appointments)
      
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
