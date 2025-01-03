import mongoose, { Schema } from 'mongoose';
import { AEP } from './AEP.model.js';
import { ADP } from './ADP.model.js';
import { AVP } from './AVP.model.js';

const models = { AEP, ADP, AVP };

const logSchema = new Schema({
    validatedId: {
        type: String,
        enum: ['AEP', 'ADP', 'AVP'],
        required: [true, "AVP, AEP, or ADP ID is required"],
    },
    Id: {
        type: Schema.Types.ObjectId,
        required: [true, "Identified ID is required"],
        validate: {
            validator: async function (value) {
                const model = models[this.validatedId];
                if (!model) return false;
                const exists = await model.exists({ _id: value });
                return !!exists;
            },
            message: 'The referenced ID does not exist in the specified collection',
        },
    },
    entryTime: {
        type: Date,
        default: Date.now,
    },
    exitTime: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    EntryId: {
        type: String,
    }
});

// Pre-save hook to set the EntryId field
logSchema.pre('save', async function (next) {
    const model = models[this.validatedId];
    if (model) {
        const document = await model.findById(this.Id);
        if (document) {
            this.EntryId = document[this.validatedId + 'Id'];
        }
    }
    next();
});

export const logRecord = mongoose.model("logRecord", logSchema);
