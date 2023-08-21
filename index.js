const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const cors = require("cors");
const { userRouter } = require("./routes/user.route");
const { doctorRouter } = require("./routes/doctor.route");

const app = express();
app.use(cors())
app.use(express.json());

app.use("/users",userRouter);
app.use("/doctors",doctorRouter);

app.listen(process.env.port,async()=> {
    try {
        await connection
        console.log(`Running on port ${process.env.port}`);
        console.log("Connected to the DB")
    } catch (err) {
        console.log("Something went wrong")
    }
})