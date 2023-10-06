import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { userCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await userCol.findOne({ _id: new ObjectId(req.user._id) });
    const userObj = {
      fName: user.fName,
      lName: user.lName,
      about: user.about,
      image: user.image,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      password: user.password,
    };

    res.json({ success: true, user: userObj });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/edit", verifyToken, async (req, res) => {
  try {
    const { fName, lName, about, image, email, phone, gender, password } =
      req.body;
    const user = await userCol.findOne({ _id: new ObjectId(req.user._id) });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      await userCol.insertOne({
        fName: fName.toString(),
        lName: lName.toString(),
        about: about.toString(),
        image: image.toString(),
        email: email.toString(),
        phone: phone.toString(),
        gender: geder.toString(),
        password: hashedPassword.toString(),
      });

      res.json({ success: true, message: "User updated successfully" });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
