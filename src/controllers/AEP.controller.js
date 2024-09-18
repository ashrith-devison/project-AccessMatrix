import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AEP } from "../models/AEP.model.js";

const createAEP = asyncHandler(async (req, res) => {
    const { AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, AdpAvailable } = req.body;
    if ([AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, AdpAvailable].some((field) => String(field).trim() === '')) throw new ApiError(400, 'All fields are required');
    const existedAEP = await AEP.findOne({ AEPId });
    if (existedAEP) {
        throw new ApiError(400, 'AEP already exists');
    }
    const aep = await AEP.create({
        AEPId,
        Locations,
        DateofIssue,
        DateofExpiry,
        IssuedBy,
        status,
        AdpAvailable
    });
    const createdAEP = await AEP.findById(aep._id);
    return res
        .status(201)
        .json(new ApiResponse(201, "AEP created successfully", { AEP: createdAEP }));
});



const getAEPs = asyncHandler(async (req, res) => {
    const aeps = await AEP.find();
    return res
        .status(200)
        .json(new ApiResponse(200, { AEPs: aeps }, "AEPs retrieved successfully"))
})

const getAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findById(req.params.id);
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: aep }, "AEP retrieved successfully"))
})

const updateAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findById(req.params.id);
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const { AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status } = req.body;
    if ([AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status].some((field) => String(field)?.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }
    const updatedAEP = await AEP.findByIdAndUpdate(req.params.id, {
        AEPId,
        Locations,
        DateofIssue,
        DateofExpiry,
        IssuedBy,
        status,
    }, { new: false });
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: updatedAEP }, "AEP updated successfully"))
})

const deleteAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findById(req.params.id);
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    await AEP.findByIdAndDelete(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "AEP deleted successfully"))
})

export  {
    createAEP,
    getAEPs,
    getAEP,
    updateAEP,
    deleteAEP
}