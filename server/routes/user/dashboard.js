import express from "express";
import { userCol } from "../../apis/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const doctors = await userCol.find({ role: "D" }).toArray();
    const doctorsObj = doctors.map((doctor) => {
      return {
        _id: doctor._id,
        fName: doctor.fName,
        lName: doctor.lName,
        category: doctor.category,
        about: doctor.about,
        image: doctor.image,
        review: doctor.reviews,
        fees: doctor.fees,
      };
    });

    res.json({ doctors: doctorsObj });
  } catch (err) {
    console.log(err);
  }
});

export default router;
