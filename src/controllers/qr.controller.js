import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AEP as AEPs } from "../models/AEP.model.js";
import { encode, decode } from "../utils/encode&decode.util.js";
import { AddSessionData, DecodeCookie } from "../utils/session-manager.js";
import axios from 'axios';

const qrverify = asyncHandler(async (req, res) => {
    const { id: tokenparam } = req.params;
    const token = decode(tokenparam);
    if (!token || token.trim() === '') {
        throw new ApiError(400, "Invalid token");
    }
    try {
        const AEPData = await AEPs.findById(token);
        if (!AEPData) throw new ApiError(405, "AEP Not Found");

        if (!req.cookies.SESSIONDATA && req.headers.sessiondata) {
            const cookie = req.headers.sessiondata;
            const data = await DecodeCookie("AEP", AEPData, cookie);
            return res.cookie('SESSIONDATA', AEPData, { httpOnly: true }).status(200).json({ message: "AEP Details Fetched Successfully", data: AEPData });
        }
        const data = await AddSessionData("AEP", AEPData, req.cookies.SESSIONDATA);
        return res.cookie('SESSIONDATA', AEPData, { httpOnly: true }).status(200).json({ message: "AEP Details Fetched Successfully", data: AEPData });

    } catch (error) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new ApiError(405, errorMessage);
    }
});

const qrCreate = asyncHandler(async (req, res) => {
    const { AEP } = req.body;
    if (!AEP || AEP.trim() === '') throw new ApiError(402, "All fields are Mandatory");
    try {
        const AEPData = await AEPs.findById(AEP);
        if (!AEPData) throw new ApiError(405, "AEP Not Found");
        const qrtext = encode(AEPData._id);
        return ApiResponse.success(res, { text: qrtext }, "Code Generated Successfully");
    } catch (error) {
        throw new ApiError(405, "Invalid Object Id");
    }
});

const oneqr = asyncHandler(async (req, res) => {
    const { data } = req.body;
    let responses = {};
    try {
        if(data.aep){
            const response = await axios.get(`${process.env.API_URL}/api/AEP/${data.aep}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            responses.aep = response.data;
        }
        if(data.adp){
            const response = await axios.get(`${process.env.API_URL}/api/ADP/getADP/${decode(data.adp)}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            if(response.data.data.ADP.AEP != responses.aep.data._id){
                console.log("Contact Airport Admin");
            }
            responses.adp = response.data;
        }

        if(data.avp){
            const response = await axios.get(`${process.env.API_URL}/api/ADP/getADP/${decode(data.adp)}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            if(response.data.data.ADP.AEP != responses.aep.data._id){
                throw new ApiError(400,"Error in Data Mapping PM1001");
            }
            responses.avp = response.data;
        }
        return ApiResponse.success(res, responses, "Data Verified Successfully");
    } catch (error) {
        throw new ApiError(405, error.message);
    }
});

export { qrverify, qrCreate, oneqr };