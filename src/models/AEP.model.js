import mongoose ,{ Schema} from 'mongoose'

const AEPschema = new mongoose.Schema({
    AEPId : {
        type: String,
        required: true,
        unique: true
    },
    EmployeeName : {
        type: String,
        required: true
    },
    Locations : {
        type: [String],
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
        type: String,
        required: true
    },
    AdpAvailable : {
        type : Boolean,
    }
},{
    timestamps: true
});

export const AEP = mongoose.model('AEP',AEPschema)