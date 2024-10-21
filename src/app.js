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

import userRouter from "./routes/user.routes.js"
import QrRouter from "./routes/qr.routes.js";
import AEP from "./routes/AEP.routes.js";

app.get('/',(req,res)=>{
    res.send("<h1>Backend Server is Initiated</h1>");
});

app.use('/api/users', userRouter);
app.use('/api/AEP',QrRouter);
app.use('/api/admin/AEP',AEP);

export { app };