import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {AEP as AEPs}  from "../models/AEP.model.js";
import {encode, decode } from "../utils/encode&decode.util.js";
import {AddSessionData, GetSessionData } from "../utils/session-manager.js";

const qrverify = asyncHandler(async (req, res) => {
    const { id: tokenparam } = req.params; 
    const token = decode(tokenparam);
    if ([token].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Invalid token");
    }
    try {
        const AEPData = await AEPs.findById(token);
        if (!AEPData) throw new ApiError(405, "AEP Not Found");
        console.log(AEPData);
        const data = await AddSessionData("AEP", AEPData,req);
        return res.cookie('SESSIONDATA', data, { httpOnly: true }).status(200).json({ message: "AEP Details Fetched Successfully" , data : AEPData});

    } catch (error) {
        throw new ApiError(405, error.message);
    }
});

const qrCreate = asyncHandler(async (req, res) => {
    const { AEP } = req.body;
    if([AEP].some((field) => field?.trim() === '')) throw new ApiError(402,"All fields are Mandatory");
    try{
        const AEPData = await AEPs.findById(AEP);
        if(!AEPData) throw new ApiError(405,"AEP Not Found");
        const qrtext = encode(AEPData._id);
        return ApiResponse.success(res,{ text : qrtext},"Code Generated Successfully");
    }
    catch(error){
        throw new ApiError(405,"Invalid Object Id");
    }
});

export { qrverify,qrCreate };