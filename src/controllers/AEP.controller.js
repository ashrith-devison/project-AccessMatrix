import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AEP } from "../models/AEP.model.js";

const createAEP = asyncHandler(async (req, res) => {
    const { AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, AdpAvailable, EmployeeName } = req.body;
    if ([AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, AdpAvailable, EmployeeName].some((field) => String(field).trim() === '')) throw new ApiError(400, 'All fields are required');
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
        AdpAvailable,
        EmployeeName
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
    const aep = await AEP.findOne({ AEPId: req.params.id });
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: aep }, "AEP retrieved successfully"))
})

const updateAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findOne({ AEPId: req.params.id });
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const { AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, EmployeeName } = req.body;
    if ([AEPId, Locations, DateofIssue, DateofExpiry, IssuedBy, status, EmployeeName].some((field) => String(field)?.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }
    const updatedAEP = await AEP.findByIdAndUpdate(aep._id, {
        AEPId,
        Locations,
        DateofIssue,
        DateofExpiry,
        IssuedBy,
        status,
        EmployeeName
    }, { new: false });
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: updatedAEP }, "AEP updated successfully"))
});

const renewAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findOne({ AEPId: req.params.id });
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const { DateofExpiry, DateofIssue } = req.body;
    if (!DateofExpiry) {
        throw new ApiError(400, 'DateofExpiry is required');
    }
    const updatedAEP = await AEP.findByIdAndUpdate(aep._id, { DateofExpiry, DateofIssue }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: updatedAEP }, "AEP renewed successfully"))
});

const deleteAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findById(req.params.id);
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    await AEP.findByIdAndDelete(req.params.id);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "AEP deleted successfully"))
});

const fetchAdpByAEP = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const aeps = await AEP.aggregate([
        {
            $match: { AEPId: id } // Match the specific AEP by id
        },
        {
            $lookup: {
                from: "adps",
                localField: "_id",
                foreignField: "AEP",
                as: "ADP"
            }
        },
        {
            $unwind: {
                path: "$ADP",
                preserveNullAndEmptyArrays: true // Preserve AEP even if ADP is not available
            }
        },
        {
            $sort: { "ADP.dateofvalidity": -1 } // Sort ADPs by dateofvalidity in descending order
        },
        {
            $group: {
                _id: "$_id",
                AEPId: { $first: "$AEPId" },
                Locations: { $first: "$Locations" },
                DateofIssue: { $first: "$DateofIssue" },
                DateofExpiry: { $first: "$DateofExpiry" },
                IssuedBy: { $first: "$IssuedBy" },
                status: { $first: "$status" },
                AdpAvailable: { $first: "$AdpAvailable" },
                EmployeeName: { $first: "$EmployeeName" },
                ADP: { $push: "$ADP" }
            }
        }
    ]);

    if (aeps.length === 0) {
        throw new ApiError(502, 'AEP not found');
    }

    if (aeps[0]?.ADP.length >= 2) {
        return ApiResponse.error(res, 'Multiples ADP available for this AEP .. contact admin ....',400);
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { AEPs: aeps }, "AEP and ADP retrieved successfully"))
});

const blockAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findOne({ AEPId: req.params.id });
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const updatedAEP = await AEP.findByIdAndUpdate(aep._id, { status: 'BLOCKED' }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: updatedAEP }, "AEP blocked successfully"))
});

const unblockAEP = asyncHandler(async (req, res) => {
    const aep = await AEP.findOne({ AEPId: req.params.id });
    if (!aep) {
        throw new ApiError(404, 'AEP not found');
    }
    const updatedAEP = await AEP.findByIdAndUpdate(aep._id, { status: 'ACTIVE' }, { new: true });
    return res
        .status(200)
        .json(new ApiResponse(200, { AEP: updatedAEP }, "AEP unblocked successfully"))
    }
);

export  {
    createAEP,
    getAEPs,
    getAEP,
    updateAEP,
    deleteAEP,
    fetchAdpByAEP,
    renewAEP,
    blockAEP,
    unblockAEP
}