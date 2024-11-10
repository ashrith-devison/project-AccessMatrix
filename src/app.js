import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js"
import QrRouter from "./routes/qr.routes.js";
import AEP from "./routes/AEP.routes.js";
import ADP from "./routes/ADP.routes.js";
import encodeUtils from "./routes/decode.routes.js";
import AVP from "./routes/AVP.routes.js";
import logbook from "./routes/LogBook.routes.js";

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

import {encode} from "./utils/encode&decode.util.js";
app.use((req, res, next) => {
    res.cookie('SESSIONDATA',encode("{}"),{
        httpOnly: true,
        secure : true,
        sameSite : 'Strict'
    });
    next();
});


app.get('/',(req,res)=>{
    res.send("<h1>Backend Server is Initiated</h1>");
});

app.use('/api/users', userRouter);
app.use('/api/AEP',QrRouter);
app.use('/api/ADP',ADP);
app.use('/api/admin/AEP',AEP);
app.use('/api/utils',encodeUtils);
app.use('/api/AVP',AVP);
app.use('/api/log',logbook);

export { app };