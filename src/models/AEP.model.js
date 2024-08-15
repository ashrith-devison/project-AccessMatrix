const mongoose = require('mongoose');

const AEPschema = new mongoose.Schema({
    AEPId : {
        type: String,
        required: true,
        unique: true
    },
    Locations : {
        type: [String],
        Enumerator: ['ATC', 'Main', 'CNS'],
        required: true
    },
    DateofIssue : {
        type: Date,
        required: true
    },
    DateofExpiry : {
        type: Date,
        required: true
    },
    IssuedBy : {
        type: String,
        required: true
    },
    status : {
        Enumerator: ['Active', 'Inactive','Block'],
        required: true
    },
    Name : {
        type: String,
        required: true
    },
    Designation : {
        type: String,
        required: true
    },
    organization : {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AEP', AEPschema);