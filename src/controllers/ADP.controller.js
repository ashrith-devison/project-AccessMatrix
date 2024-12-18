import { ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ADP} from '../models/ADP.model.js';
import {AEP} from '../models/AEP.model.js';
import {decode} from '../utils/encode&decode.util.js';
import {AddSessionData, GetSessionData} from '../utils/session-manager.js';
import mongoose from 'mongoose';


const createADP = asyncHandler(async (req, res) => {
    const { ADPId, DateofIssue, ADPValidity, AuthorizedBy, Name, Designation, Organization, Violation, AEPId, status } = req.body;
    
    if ([ADPId, DateofIssue, ADPValidity, AuthorizedBy, Name, Designation, Organization, Violation, AEPId, status].some((field) => String(field).trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }
    
    const adpExists = await ADP.findOne({ ADPId : ADPId });
    if (adpExists) {
        throw new ApiError(400, 'ADP already exists');
    }
    const aep = await AEP.findOne({ AEPId: AEPId });

    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }

    const adp = await ADP.create({
        ADPId,
        DateofIssue,
        ADPValidity,
        AuthorizedBy,
        Name,
        Designation,
        Organization,
        Violation,
        AEP: aep._id,
        status
    });

    return res
        .status(201)
        .json(new ApiResponse(201, 'ADP created successfully', { ADP: adp }));
});


const getADPs = asyncHandler(async (req, res) => {
    const adps = await ADP.find();
    return res
    .status(200)
    .json(new ApiResponse(200, {ADPs: adps}, 'ADPs retrieved successfully'));
});

const getADPbyId = asyncHandler(async (req, res) => {
    const adp = await ADP.findById(req.params.id);
    console.log(adp)
    if (!adp) {
        throw new ApiError(404, 'ADP not found');
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {ADP: adp}, 'ADP retrieved successfully'));
});

const updateADP = asyncHandler(async (req, res) => {
    const adp = await ADP.findById(req.params.id);
    if (!adp) {
        throw new ApiError(404, 'ADP not found');
    }
    const { ADPId , DateofIssue, ADPValidity, AuthorizedBy, Name, Designation, Organization, Violation,AEPId, DLId, DLValidity, DateofPayment, status } = req.body;
    const aep = await AEP.findById(AEPId);
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const updatedADP = await ADP.findByIdAndUpdate(req.params.id, {
        ADPId,
        DateofIssue,
        ADPValidity,
        AuthorizedBy,
        Name,
        Designation,
        Organization,
        Violation,
        AEP: aep._id,
        DLId,
        DLValidity,
        DateofPayment,
        status
    }, {new: true});
    return res
    .status(200)
    .json(new ApiResponse(200, {ADP: updatedADP}, 'ADP updated successfully'));
});

const deleteADP = asyncHandler(async (req, res) => {
    const adp = await ADP.findById(req.params.id);
    if (!adp) {
        throw new ApiError(404, 'ADP not found');
    }
    await ADP.findByIdAndDelete(req.params.id);
    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'ADP deleted successfully'));
});

const verifyADP = asyncHandler(async (req, res) => {
    const ADPId = req.params.id;
    if (!ADPId) {
        throw new ApiError(400, 'ADP ID is required');
    }

    let adp_temp = decode(ADPId); // Assuming decode returns the ADPId in proper format

    // Validate the decoded ADPId to ensure it's a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(adp_temp)) {
        throw new ApiError(400, 'Invalid ADP ID format');
    }

    const adp = await ADP.findById(adp_temp);
    if (!adp) {
        throw new ApiError(404, 'ADP not found');
    }

    return res.cookie('SESSIONDATA', adp_temp, { httpOnly: true }).status(200).
    json({ message: 'ADP Details Fetched Successfully', ADP: adp, AEP: GetSessionData('AEP', req) });
});


export {
    createADP,
    getADPs,
    getADPbyId,
    updateADP,
    deleteADP,
    verifyADP
}