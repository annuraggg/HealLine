import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userHandler from "./routes/user/main.js";
import authHandler from "./routes/auth.js";
import doctorHandler from "./routes/doctor/main.js";
import Razorpay from  'razorpay';
import crypto from 'crypto';
// import paymentRoutes from "./routes/paymentRoutes.js";

app.use(cors({ credentials: true, origin: [process.env.FRONTEND_ADDRESS, process.env.BHARAT ] }));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log(process.env.FRONTEND_ADDRESS);

app.use("/auth", authHandler);
app.use("/users", userHandler);
app.use("/doctors", doctorHandler);
const instance = new Razorpay({
    key_id:  'rzp_test_DpBTKd9iOzAvSw',
    key_secret:  '8gK6zfspGkK96ENZSp2dkMWF',
  });

app.get('/api/v1/getKey',(req,res)=>{
    res.status(200).json({
        key:process.env.RAZORPAY_API_KEY
    });
})

app.post('/api/v1/checkout', async (req, res) => {
    // const RequestBody = req.body;
    console.log(req.body);
    const options = {
        amount: req.body.amount * 100,  // amount in the smallest currency unit
        currency: "INR",
      };
    const order = await  instance.orders.create(options)
      console.log(order);
      res.status(200).json({
          success:true,
          order
      })
})

app.post('/api/v1/paymentVarification', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log(req.body);
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest("hex");
    console.log(body);
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log(isAuthentic);

    if (isAuthentic) {
        res.status(200).json({
            success: true,
            message : "Payment successfull"
        })
        // res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
        res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }
});


app.listen(3000);
