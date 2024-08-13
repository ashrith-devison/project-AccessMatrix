const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    deviceId : {
        type: String,
        required: true
    },
    location : {
        Enumerator: ['ATC', 'Main', 'CNS'],
    },
    role : {
        Enumerator: ['Admin', 'Security','Device'],
    }
});

module.exports = mongoose.model('Users', userSchema);