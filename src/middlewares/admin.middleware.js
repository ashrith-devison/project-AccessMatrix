import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const adminMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        console.log("No token found");
        throw new ApiError(401, "Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== "Admin") {
            throw new ApiError(401, "Unauthorized");
        }
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized");
    }
});

const securityMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        if (decoded.role !== "Security") {
            throw new ApiError(401, "Unauthorized Access \nSecurity Login Required ...");
        }
        next();
    } catch (error) {
        throw new ApiError(401, error.message);
    }
});

export { adminMiddleware, securityMiddleware };