import express from "express";
const router = express.Router();
import { userCol } from "../apis/mongo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const user = await userCol.findOne({
      email: email.toString(),
    });

    if (user) {
      const pwVerify = await bcrypt.compare(password, user.password);
      if (pwVerify) {
        const token = jwt.sign(
          {
            fName: user.fName,
            lName: user.lName,
            imageURL: user.image,
            role: user.role,
            email: user.email,
            id: user._id,
          },
          process.env.JWT_SECRET
        );

        const expirationTime = 7 * 24 * 60 * 60 * 1000;
        const expirationDate = new Date(Date.now() + expirationTime);

        res
          .cookie("token", token, {
            expires: expirationDate,
          })
          .send({ success: true, role: user.role });
      } else {
        res.json({ succes: false });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  const { fName, lName, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await userCol.findOne({
      email: email.toString(),
    });

    if (user) {
      res.json({ success: false, error: "User already exists" });
    } else {
      const newUser = await userCol.insertOne({
        fName: fName.toString(),
        lName: lName.toString(),
        email: email.toString(),
        password: hashedPassword,
        role: role.toString(),
      });

      const token = jwt.sign(
        {
          fName: fName.toString(),
          lName: lName.toString(),
          imageURL: "",
          role: role.toString(),
          email: email.toString(),
          id: newUser.insertedId.toString(),
        },
        process.env.JWT_SECRET
      );

      const expirationTime = 7 * 24 * 60 * 60 * 1000;
      const expirationDate = new Date(Date.now() + expirationTime);

      res
        .cookie("token", token, {
          expires: expirationDate,
        })
        .send({ success: true, role: role.toString() });
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
