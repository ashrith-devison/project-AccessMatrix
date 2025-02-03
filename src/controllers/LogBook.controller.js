import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logRecord } from "../models/logbook.model.js";
import { AEP } from "../models/AEP.model.js";
import { ADP } from "../models/ADP.model.js";
import { AVP } from "../models/AVP.model.js";

const canCreateEntry = async(entryTime )  =>{
    const currentTime = new Date();
    const timeDiff = currentTime - entryTime;
    const bufferTime = 3* 60 * 1000; // 10 minutes
    if(timeDiff >= bufferTime) return {op : true, message : "Proceed to exit entry"};
    else{
        const remTime = bufferTime - timeDiff;
        return {op : false, message : "Entry was done, please wait for "+remTime/60000+" minutes for exit entry"};
    }
};

const updateExitEntry = async(IdType, Id ) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const records = await logRecord.find({
        entryTime: { $gte: startOfDay, $lt: endOfDay },
        Id,
        validatedId: IdType,
    }).sort({ entryTime: -1 }
    );
    if (records.length > 0) {
        const canCreate = await canCreateEntry(records[0].entryTime);
        if(canCreate.op === false){
            return {success : 'false-entry', message : canCreate.message};
        }
        else if (records[0].entryTime.toISOString() === records[0].exitTime.toISOString()) {
            const updatedRecord = await logRecord.updateOne(
                { _id: records[0]._id }, 
                { $set: { exitTime: new Date() } } 
            );
            return { updatedRecord, success: "true" };
        }
        return { success: "false" };
    }
    return { success: "false" };
};

const updateExitEntryOneTime = async (req, res) => {
    const { IdType, Id } = req.body;
    const data = await updateExitEntry(IdType, Id);
    res.send(data);
};

const createEntry = async (req, res) => {
    const { IdType, Id, location } = req.body;
    if ([IdType, Id].some((field) => field?.trim() === '')) {
        throw ApiError.forbidden("All Id are required");
    }

    const exitUpdateResponse = await updateExitEntry(IdType, Id);
    if (exitUpdateResponse.success === 'true') 
        return ApiResponse.success(res, exitUpdateResponse,"Exit Time Updated Successfully");
    else if (exitUpdateResponse.success === 'false-entry') 
        return ApiResponse.error(res,exitUpdateResponse.message,200,false,exitUpdateResponse);
    else {
        const log = await logRecord.create({ validatedId: IdType, Id, location });
        return ApiResponse.success(res, log, "Entry created successfully");
    }
};


const getLogBookById = asyncHandler(async (req, res) => {
    const { IdType, Id } = req.params;
    const log = await logRecord.find({ validatedId: IdType, Id });
    return ApiResponse.success(res, log, "Logbook fetched successfully");
});

const getAllLogBooks = asyncHandler(async (req, res) => {
    let log = await logRecord.find();
    for(let i=0; i<log.length; i++){
        if(log[i].validatedId === 'AEP'){
            const aep = await AEP.findById(log[i].Id);
            log[i] = {...log[i]._doc, name: aep?.EmployeeName};
        }
        else if(log[i].validatedId === 'ADP'){
            const adp = await ADP.findById(log[i].Id);
            log[i] = {...log[i]._doc, name: adp?.Name};
        }
        else if(log[i].validatedId === 'AVP'){
            const avp = await AVP.findById(log[i].Id);
            log[i] = {...log[i]._doc, name: avp?.Name};
        }
    }
    return ApiResponse.success(res, log, "Logbook fetched successfully");
});

export {
    createEntry,
    updateExitEntryOneTime as updateExitEntry,
    getLogBookById,
    getAllLogBooks
};
