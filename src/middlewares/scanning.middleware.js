import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GetSessionData } from "../utils/session-manager.js";

const verifyAEP = asyncHandler(async (req, res, next) => {
    const AEP = GetSessionData("AEP",req);
    if (!AEP) {
        throw new ApiError(405, 'AEP not found please scan the AEP QR code');
    }
    next();
});

export default verifyAEP;
