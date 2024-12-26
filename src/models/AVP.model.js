import mongoose, { Schema } from 'mongoose';

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
},{timestamps: true});

export const AVP = mongoose.model('AVP', AVPschema);