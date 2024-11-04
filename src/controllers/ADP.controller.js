import { ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ADP} from '../models/ADP.model.js';
import {AEP} from '../models/AEP.model.js';
import {decode} from '../utils/encode&decode.util.js';
import {AddSessionData, GetSessionData} from '../utils/session-manager.js';
const createADP = asyncHandler(async (req, res) => {
    
    const { ADPId , DateofIssue, ADPValidity, AuthorizedBy, Name, Designation, Organization, Violation,AEPId, status } = req.body;
    const aep = await AEP.findOne({AEPId});
    console.log(aep);
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
    .json(new ApiResponse(201, {ADP}, 'ADP created successfully'));

});

const getADPs = asyncHandler(async (req, res) => {
    const adps = await ADP.find();
    return res
    .status(200)
    .json(new ApiResponse(200, {ADPs: adps}, 'ADPs retrieved successfully'));
});

const getADP = asyncHandler(async (req, res) => {
    const adp = await ADP.findById(req.params.id);
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
    let adp_temp = decode(ADPId);
    const adp = await ADP.findById(adp_temp);
    if (!adp) {
        throw new ApiError(404, 'ADP not found');
    }
    const data = await AddSessionData('ADP', adp, req);
    return res.cookie('SESSIONDATA', data, { httpOnly: true }).status(200).
    json({ message: 'ADP Details Fetched Successfully', ADP: adp , AEP: GetSessionData('AEP', req) });
});


export {
    createADP,
    getADPs,
    getADP,
    updateADP,
    deleteADP,
    verifyADP
}