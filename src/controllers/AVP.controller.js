import { ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {AVP} from '../models/AVP.model.js';
import {AEP} from '../models/AEP.model.js';
import {decode} from '../utils/encode&decode.util.js';
import {AddSessionData, GetSessionData} from '../utils/session-manager.js';
import mongoose from 'mongoose';

const createAVP = asyncHandler(async(req,res) => {
    const { AVPId , DateofIssue, AVPValidity, AuthorizedBy, Name, 
        Designation, Organization, Violation, status,
        VehicleNo, VehicleType
     } = req.body;
    const avp_check = await AVP.findOne({AVPId : AVPId});
    console.log(avp_check);
    if(avp_check != null) {
        throw ApiError.forbidden("AVP already Exists");
    }
    const avp = await AVP.create({
        AVPId , 
        DateofIssue, 
        AVPValidity, 
        AuthorizedBy,
        Name, 
        Designation, 
        Organization, 
        Violation,
        status,
        VehicleNo,
        VehicleType
    });

    return res.
    json(new ApiResponse(201,{avp},"Creation of AVP is done"));
});

const getAVP = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findOne({AVPId : Avpid}); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    return res.status(200).
    json(new ApiResponse(200,{AVP : AvpDetails},"Avps fetched successfully"));
});

const getAVPById = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findById(Avpid); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    return res.status(200).
    json(new ApiResponse(200,{AVP : AvpDetails},"Avps fetched successfully"));
});

const getAVPs = asyncHandler(async(req,res)=>{
    const Avps = await AVP.find();
    return res.status(200).
    json(new ApiResponse(200,{AVP : Avps},"Avps fetched successfully"));
});

const updateAVP = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findById(Avpid); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    const { AVPId , DateofIssue, AVPValidity, AuthorizedBy, Name, Designation, Organization, Violation } = req.body;
    const avp = await AVP.findByIdAndUpdate(Avpid,{
        AVPId , 
        DateofIssue, 
        AVPValidity, 
        AuthorizedBy,
        Name, 
        Designation, 
        Organization, 
        Violation
    },{new:true});

    return res.status(200).
    json(new ApiResponse(200,{AVP : avp},"Avp updated successfully"));
});

const verifyAVP = asyncHandler(async (req, res) => {
    const AVPid = req.params.id;
    if (!AVPid) {
        throw new ApiError(400, 'AVP ID is required');
    }

    let avp_temp = decode(AVPid);
    if (!mongoose.Types.ObjectId.isValid(avp_temp)) {
        throw new ApiError(400, 'Invalid AVP ID format');
    }

    const avp = await AVP.findById(avp_temp);
    if (!avp) {
        throw new ApiError(404, 'AVP not found');
    }

    // const data = await AddSessionData('AVP', avp, req);

    return res.cookie('SESSIONDATA', avp_temp, { httpOnly: true })
        .status(200)
        .json({
            message: 'AVP Details Fetched Successfully',
            AVP: avp, 
            AEP: GetSessionData('AEP', req)
        });
});

const renewAVP = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findOne({AVPId : Avpid}); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    const { AVPValidity, DateofIssue } = req.body;
    if (!AVPValidity) {
        throw new ApiError(400, 'DateofExpiry is required');
    }
    const updatedAVP = await AVP.findByIdAndUpdate(AvpDetails._id, { AVPValidity, DateofIssue }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AVP: updatedAVP,  }, "AVP renewed successfully"))
}
);

const blockAVP = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findOne({AVPId : Avpid}); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    const updatedAVP = await AVP.findByIdAndUpdate(AvpDetails._id, { status: "Blocked" }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AVP: updatedAVP,  }, "AVP Blocked successfully"))
    }
);

const unblockAVP = asyncHandler(async(req,res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const AvpDetails = await AVP.findOne({AVPId : Avpid}); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    const updatedAVP = await AVP.findByIdAndUpdate(AvpDetails._id, { status: "ACTIVE" }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AVP: updatedAVP,  }, "AVP Unblocked successfully"))
    }
);


export {
    createAVP,
    getAVP,
    getAVPs,
    updateAVP,
    verifyAVP,
    renewAVP,
    getAVPById,
    blockAVP,
    unblockAVP
}