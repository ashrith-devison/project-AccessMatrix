import {ApiError} from "./ApiError.js"
import { asyncHandler } from "./asyncHandler.js";
import {decode, encode} from "./encode&decode.util.js"

const AddSessionData = (name, data, cookie) => {
    if (!cookie) {
        throw new ApiError(500, "Session Data not found");
    }
    let sessionData = JSON.parse(decode(cookie));
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

const DecodeCookie = (name, data, req) => {
    let sessionData = JSON.parse(decode(req));
    sessionData[name] = data;
    return encode(JSON.stringify(sessionData));
}


export { AddSessionData, GetSessionData, DecodeCookie };