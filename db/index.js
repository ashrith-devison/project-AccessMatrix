const mongoose = require('mongoose');


connectDB = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/Access-Matrix');
        console.log('Connected to the database');
    }
    catch(err){
        console.log('Failed to connect to the database');
    }
}

module.exports = connectDB;