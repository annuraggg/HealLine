import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { prescriptionCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const prescriptions = await prescriptionCol
      .find({ patientName: req.user.id.toString() })
      .toArray();
    for (const prescription of prescriptions) {
      const doctor = await userCol.findOne({
        _id: new ObjectId(prescription.doctorName),
      });
      prescription.doctorFName = doctor.fName + " " + doctor.lName;
    }

    res.json({ success: true, prescriptions: prescriptions });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});
