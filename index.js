const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieSession = require("cookie-session");
const passport = require('passport');
const passportStrategy = require("./passport");
const authRoute = require("./routes/auth");
const conn = require('./conn/conn');
conn();
app.use(cors());
app.use(express.json());

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1',require('./routes/UserRoutes'))
app.use("/auth", authRoute);

app.listen(4000,()=>{
    console.log(`Hii from backend`);
})