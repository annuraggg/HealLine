import express from "express";
const router = express.Router();
import { userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
import { verifyToken } from "../../apis/jwt.js";

router.get("/:doctor", verifyToken, async (req, res) => {
  const doctor = req.params.doctor;

  try {
    const doc = await userCol.findOne({ _id: new ObjectId(doctor) });
    const docObj = {
      fname: doc.fName,
      lname: doc.lName,
      category: doc.category,
      about: doc.about,
      image: doc.image,
      review: doc.reviews,
      fees: doc.fees,
    };

    res.json({ success: true, doctor: docObj });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
