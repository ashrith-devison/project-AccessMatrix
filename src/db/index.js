import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';

connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect('mongodb://127.0.0.1:27017/Access-Matrix');
        console.log(`\n MongoDB connected !! DB HOSTED AT ${connectionInstance.connection.host} \n`);
    }
    catch(err){
        console.error("MongoDB connection error",error);
        process.exit(1)
    }
}

export default connectDB;