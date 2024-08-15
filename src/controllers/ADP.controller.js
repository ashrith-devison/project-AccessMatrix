import { ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ADP} from '../models/ADP.model.js';
import {AEP} from '../models/AEP.model.js';

const createADP = asyncHandler(async (req, res) => {
    
    const { ADPId , DateofIssue, ADPValidity, AuthorizedBy, Name, Designation, Organization, Violation,AEPId, DLId, DLValidity, DateofPayment, status } = req.body;
    const aep = await AEP.findById(AEPId);
    
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
        DLId,
        DLValidity,
        DateofPayment,
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

export {
    createADP,
    getADPs,
    getADP,
    updateADP,
    deleteADP
}