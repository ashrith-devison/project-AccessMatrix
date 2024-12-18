import mongoose, { Schema } from 'mongoose';
import { AEP } from './AEP.model.js';

const ADPschema = new mongoose.Schema({
    ADPId: {
        type: String,
        required: true,
        unique: true
    },
    DateofIssue: {
        type: Date,
        required: true
    },
    ADPValidity: {
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
    },
    Violation:{
        type: [String], // This should be an array of strings
        required: true
    },
    AEP:{
        type: Schema.Types.ObjectId, 
        ref: 'AEP',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Block'],
        required: true
    },
},{timestamps: true});

export const ADP = mongoose.model('ADP', ADPschema);