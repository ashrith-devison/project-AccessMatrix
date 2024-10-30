import {ApiError} from "./ApiError.js"
import { asyncHandler } from "./asyncHandler.js";
import {decode, encode} from "./encode&decode.util.js"

const AddSessionData = (name, data, req) => {
    if (!req.cookies) {
        throw new ApiError(500, "Session Data not found");
    }
    let sessionData = JSON.parse(decode(req.cookies.SESSIONDATA));
    sessionData[name] = data;
    return encode(JSON.stringify(sessionData));
}

const GetSessionData =(name, req) => {
    if (!req.cookies.SESSIONDATA) {
        throw new ApiError(500, "Session Data not found");
    }
    let sessionData = JSON.parse(decode(req.cookies.SESSIONDATA));
    return sessionData[name];
}

export { AddSessionData, GetSessionData };