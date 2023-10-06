import express from "express";
const app = express();
import userHandler from "./routes/user/main.js";
import authHandler from "./routes/auth.js"
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
app.use(express.json())
app.use(cookieParser());
console.log(process.env.FRONTEND_ADDRESS);

app.use(cors({ credentials: true, origin: process.env.FRONTEND_ADDRESS }));

app.use("/auth", authHandler)
app.use("/users", userHandler);

app.listen(3000);
