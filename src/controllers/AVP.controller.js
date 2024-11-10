import { ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {AVP} from '../models/AVP.model.js';
import {AEP} from '../models/AEP.model.js';
import {decode} from '../utils/encode&decode.util.js';
import {AddSessionData, GetSessionData} from '../utils/session-manager.js';

const createAVP = asyncHandler(async(req,res) => {
    const { AVPId , DateofIssue, AVPValidity, AuthorizedBy, Name, Designation, Organization, Violation } = req.body;
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
        Violation
    });

    return res.
    json(new ApiResponse(201,{AVP},"Creation of AVP is done"));
});

const getAVP = asyncHandler(async(req,res)=>{
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

const verifyAVP = asyncHandler(async(req, res)=>{
    const Avpid = req.params.id;
    if(!Avpid){
        throw ApiError.badRequest("AVP ID is required");
    }
    const avp_temp = decode(Avpid);
    const AvpDetails = await AVP.findById(avp_temp); 
    if(!AvpDetails){
        throw new ApiError(402,"AVP is not found at server");
    }
    const data = await AddSessionData("AVP",AvpDetails,req);
    return res.cookie('SESSIONDATA', data, { httpOnly: true }).status(200).
    json({ message: 'AVP Details Fetched Successfully', ADP: adp , AEP: GetSessionData('ADP', req) });
});
export {
    createAVP,
    getAVP,
    getAVPs,
    verifyAVP
}