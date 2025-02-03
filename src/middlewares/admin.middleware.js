import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const adminMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        console.log("No token found");
        throw new ApiError(401, "Unauthorized -- Token Not Found");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== "Admin") {
            throw new ApiError(401, "Unauthorized -- Admin Login Required ...");
        }
        next();
    } catch (error) {
        if (error.message === "jwt expired") {
            throw new ApiError(401, "Token Expired");
        }
        throw new ApiError(401, "Unauthorized -- " + error.message);
    }
});

const securityMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        console.log(req.headers);
        throw new ApiError(401, "Unauthorized -- Token Not Found");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        if (decoded.role !== "Security") {
            throw new ApiError(401, "Unauthorized Access \nSecurity Login Required ...");
        }
        next();
    } catch (error) {
        if (error.message === "jwt expired") {
            return ApiResponse.error(res, "Token Expired", 201, false);
        }
        throw new ApiError(401, "Unauthorized -- " + error.message);
    }
});

export { adminMiddleware, securityMiddleware };