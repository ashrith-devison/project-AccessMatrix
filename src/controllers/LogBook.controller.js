import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { logRecord } from "../models/logbook.model.js";

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
        if(records[0].entryTime.toISOString() === records[0].exitTime.toISOString()){
            const updatedRecord = await logRecord.updateOne(
                { _id: records[0]._id }, 
                { $set: { exitTime: new Date() } } 
            );
            
            return {updatedRecord,success : "true"};
        }
        return {success : "false"};
    }
    return {success : "false"};
}
const updateExitEntryOneTime = async (req, res) => {
    const { IdType, Id } = req.body;
    const data = await updateExitEntry(IdType, Id);
    res.send(data);
};

const createEntry = async (req, res) => {
    const { IdType, Id } = req.body;

    if ([IdType, Id].some((field) => field?.trim() === '')) {
        throw new ApiError.forbidden("All Id are required");
    }

    const exitUpdateResponse = await updateExitEntry(IdType, Id);
    if (exitUpdateResponse.success === 'true') 
        return ApiResponse.success(res, exitUpdateResponse,"Exit Time Updated Successfully");
    const log = await logRecord.create({ validatedId: IdType, Id });
    return ApiResponse.success(res, log, "Entry created successfully");
};


const getLogBookById = asyncHandler(async (req, res) => {
    const { IdType, Id } = req.params;
    const log = await logRecord.find({ validatedId: IdType, Id });
    return ApiResponse.success(res, log, "Logbook fetched successfully");
});

const getAllLogBooks = asyncHandler(async (req, res) => {
    const log = await logRecord.find();
    return ApiResponse.success(res, log, "Logbook fetched successfully");
});

export {
    createEntry,
    updateExitEntryOneTime as updateExitEntry,
    getLogBookById,
    getAllLogBooks
};
