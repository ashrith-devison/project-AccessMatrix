import mongoose ,{ Schema} from 'mongoose'

const AEPschema = new mongoose.Schema({
    AEPId : {
        type: String,
        required: true,
        unique: true
    },
    Locations : {
        type: [String],
        enum: ['ATC', 'Main', 'CNS'],
        required: true
    },
    DateofIssue : {
        type: Date,
        required: true
    },
    AEPValidity : {
        type: Date,
        required: true
    },
    IssuedBy : {
        type: String,
        required: true
    },
    status : {
        type: String,
        enum: ['Active', 'Inactive','Block'],
        required: true
    },
},{
    timestamps: true
});

export const AEP = mongoose.model('AEP',AEPschema)