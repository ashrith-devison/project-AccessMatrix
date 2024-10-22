import {encode, decode } from "../utils/encode&decode.util.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from '../utils/ApiResponse.js';
import {Router} from 'express';

const create = asyncHandler(async (req, res) => {
    const {id : tokenparam} = req.params;
    return ApiResponse.success(res,{code : encode(tokenparam)},"encoded Successfully");
});

const verify = asyncHandler(async (req, res) => {
    const { id: tokenparam } = req.params; 
    const token = decode(tokenparam);
    if ([token].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Invalid token");
    }
    return ApiResponse.success(res,{decoded : token},"decoded Successfully");
});

const router = Router();
router.route('/create/:id').get(create);
router.route('/verify/:id').get(verify);

export default router;