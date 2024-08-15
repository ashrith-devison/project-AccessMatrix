import mongoose ,{ Schema} from 'mongoose'

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
    employee :{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: true
});

export const AEP = mongoose.model('AEP',AEPschema)