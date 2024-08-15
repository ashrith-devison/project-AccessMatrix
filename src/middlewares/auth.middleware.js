import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try{
        const token = req.cookies?.accessToken || req.headers('Authorization')?.replace('Bearer ','');
        if(!token){
            throw new ApiError(401, 'Unauthorized request');
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if(!user){
            throw new ApiError(404, 'User not found');
        }

        req.user = user;
        next();
    } catch(error){
        throw new ApiError(401, error?.message() || 'Unauthorized request');
    }
})
