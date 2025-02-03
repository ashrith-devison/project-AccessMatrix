import mongoose, { Schema } from 'mongoose';
import { AEP } from './AEP.model';
const AVPschema = new mongoose.Schema({
    AVPId: {
        type: String,
        required: true,
        unique: true
    },
    DateofIssue: {
        type: Date,
        required: true
    },
    AVPValidity: {
        type: Date,
        required: true
    },
    AuthorizedBy: {
        type: String,
        required: true
    },
    Name:{
        type: String,
        required: true
    },
    Designation:{
        type: String,
        required: true
    },
    Organization:{
        type: String,
        required: true
    },
    Violation:{
        type: [String], // This should be an array of strings
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'Inactive', 'BLOCKED'],
        required: true
    },
    VehicleNo : {
        type: String,
        required: true
    },
    VehicleType : {
        type: String,
        enum : ['Two Wheeler', 'Four Wheeler', 'Heavy Vehicle'],
        required: true
    },
},{timestamps: true});

AVPschema.pre('save', async function (next){
    if(this.isNew){
        try{
            const aep = await AEP.findById(this.AEP);
            if(aep){
                this.Name = aep.EmployeeName;
            }
        }
        catch(err){
            console.log(err);
            next(err);
        }
    }
});
export const AVP = mongoose.model('AVP', AVPschema);