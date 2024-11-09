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
        return res.cookie('SESSIONDATA', data, { httpOnly: true }).status(200).json({ message: "AEP Details Fetched Successfully", data: AEPData });

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
    const { data, option } = req.body;
    let responses = {};
    const packet = {
        IdType: "",
        Id: ""
    };

    try {
        if ('aep' in data && data.aep && (data.option === 'driver' || data.option == 'employee')) {
            const response = await axios.get(`${process.env.API_URL}/api/AEP/${data.aep}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            responses.aep = response.data;
            packet.IdType = "AEP";
            packet.Id = data.aep;
            if ('adp' in data && data.adp && data.option === 'driver'){
                const response = await axios.get(`${process.env.API_URL}/api/ADP/getADP/${decode(data.adp)}`, {
                    headers: {
                        "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                        "sessionData": req.cookies.SESSIONDATA
                    }
                });
                responses.adp = response.data;
                packet.IdType = "ADP";
                packet.Id = data.adp;
            }

        }
    

        if ('avp' in data && data.avp && data.option === 'vehicle') {
            const avpData = decode(data.avp);
            const response = await axios.get(`${process.env.API_URL}/api/AVP/${avpData}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            responses.avp = response.data;
            packet.IdType = "AVP";
            packet.Id = data.avp;
        }

        packet.Id = decode(packet.Id);
        const response = await axios.post(`${process.env.API_URL}/api/log/`,packet);
        return ApiResponse.success(res, {data : responses, log :response.data}, "Data Verified Successfully");

    } catch (error) {
        console.error("Error in oneqr function:", error.message || error);
        throw new ApiError(405, error.message || "Error in data verification");
    }
});


export { qrverify, qrCreate, oneqr };