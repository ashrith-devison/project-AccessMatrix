import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL, // allow to server to accept request from different origin
        credentials: true,
    })
)

app.use(express.json(
    {limit : "20kb"}
))

app.use(express.urlencoded({ 
    extended: true,
    limit : "20kb"
}));


app.use(express.static('public')); 
app.use(cookieParser());

import userRouter from "./routes/user.route.js";


app.use('/api/v1/users', userRouter);

export { app };