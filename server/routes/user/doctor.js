import express from "express";
const router = express.Router();
import { userCol, apppointmentCol, prescriptionCol } from "../../apis/mongo.js";
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
    const appointment = await apppointmentCol.findOne({
      patientName: req.user.id.toString(),
      doctorName: doctor.toString(),
      status: "approved",
    });
    const docObj = {
      fname: doc.fName,
      lname: doc.lName,
      category: doc.category,
      about: doc.about,
      image: doc.image,
      review: doc.reviews,
      fees: doc.fees,
    };

    res.json({ success: true, doctor: docObj, appointment: appointment });
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
  const date = req.body.date;
  const time = req.body.time;
  const desc = req.body.desc;
  const status = "pending";

  const dt = date + " " + time;
  const dateF = new Date(dt);
  const isoDateString = dateF.toISOString();

  const booking = {
    date: isoDateString,
    status: status,
    patientName: req.user.id,
    doctorName: id,
    confirmed: false,
    desc: desc,
    presc: "",
  };
  try {
    await apppointmentCol.insertOne(booking);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:id/rate", verifyToken, async (req, res) => {
  const id = req.params.id;
  const rating = req.body.rating;
  const review = req.body.review;
  const appointmentNo = req.body.appointmentNo;

  try {
    const appointment = await apppointmentCol.findOne({
      _id: new ObjectId(appointmentNo),
    });
    if (appointment.status == "pending") {
      return res.json({ success: false, error: "Appointment not completed" });
    } else if (appointment.status == "cancelled") {
      return res.json({ success: false, error: "Appointment cancelled" });
    }

    await userCol.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          reviews: {
            rating: rating.toString(),
            review: review.toString(),
            patient: req.user.id.toString(),
          },
        },
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

router.post("/:ui/prescriptions", verifyToken, async (req, res) => {
  try {
    const presc = await prescriptionCol.findOne({
      patientName: req.user.id.toString(),
      doctorName: req.params.id.toString(),
    });
    res.json({ success: true, presc: presc });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: error });
  }
});

export default router;
