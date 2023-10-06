import express from "express";
import { userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await userCol.findOne({ _id: new ObjectId(id) });
    const reviews = user.reviews;
    res.json({ success: true, reviews: reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userCol.findOne({ "review.id": id });
    const reviews = user.reviews;
    res.json({ success: true, reviews: reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default express;
