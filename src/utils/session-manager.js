import {ApiError} from "./ApiError.js"
import { asyncHandler } from "./asyncHandler.js";

const AddSessionData = (name, data, req) => {
    if (!req.cookies) {
        throw new ApiError(500, "Session Data not found");
    }
    let sessionData = JSON.parse(decodeURIComponent(req.cookies.SESSIONDATA));
    sessionData[name] = data;
    return encodeURIComponent(JSON.stringify(sessionData));
}

const GetSessionData = (name, req) => {
    if (!req.cookies.SESSIONDATA) {
        throw new ApiError(500, "Session Data not found");
    }
    let sessionData = JSON.parse(decodeURIComponent(req.cookies.SESSIONDATA));
    return sessionData[name];
}

export { AddSessionData, GetSessionData };