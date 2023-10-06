import express from "express";
const router = express.Router();
import { userCol, apppointmentCol } from "../../apis/mongo.js";
import { ObjectId } from "mongodb";
import { verifyToken } from "../../apis/jwt.js";
import twilio from "twilio";
import { v4 as uuidv4 } from "uuid";
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
import dotenv from "dotenv";
dotenv.config();

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

const twilioClient = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const findOrCreateRoom = async (roomName) => {
  try {
    await twilioClient.video.v1.rooms(roomName).fetch();
  } catch (error) {
    if (error.code == 20404) {
      await twilioClient.video.v1.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      throw error;
    }
  }
};

const getAccessToken = (roomName) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { identity: uuidv4() }
  );
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  token.addGrant(videoGrant);
  return token.toJwt();
};

router.post("/:did/video", async (req, res) => {
  console.log("TOKEN SENT");
  if (!req.body || !req.body.roomName) {
    return res.status(400).json({ msg: "Must include roomName argument." });
  }
  const roomName = req.body.roomName;
  findOrCreateRoom(roomName);
  const token = getAccessToken(roomName);
  res.json({
    token: token,
  });
});

router.post("/:id/book", verifyToken, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const date = req.body.date;
  const time = req.body.time;
  const status = "pending";

  const formattedDate = new Date(date);
  const formattedTime = new Date(`${time}`);
  const timestamp = formattedTime.getTime() / 1000;

  const booking = {
    date: formattedDate,
    time: timestamp,
    status: status,
    patientName: req.user.id,
    doctorName: id,
    confirmed: false,
  };
  try {
    await apppointmentCol.insertOne(booking);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
