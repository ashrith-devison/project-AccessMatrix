import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';

const connectDB = async () => {
    try{
        console.log(process.env.DB_URL);
        const connectionInstance = await mongoose.connect(process.env.DB_URL);
        console.log(`\n MongoDB connected !! DB HOSTED AT ${connectionInstance.connection.host} \n`);
    }
    catch(err){
        console.error("MongoDB connection error",err);
        process.exit(1)
    }
}

export {connectDB};