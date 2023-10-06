import express from "express";
import { userCol } from "../../apis/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
const router = express.Router();

router.get("/",verifyToken, async (req, res) => {
  try {
    const doctors = await userCol.find({role: "D"}).toArray();
    console.log(doctors);
    res.json({ doctors });
  } catch (err) {
    console.log(err);
  }
});

export default router;
