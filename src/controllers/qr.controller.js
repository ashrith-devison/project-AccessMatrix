import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AEP as AEPs } from "../models/AEP.model.js";
import { encode, decode } from "../utils/encode&decode.util.js";
import { AddSessionData, DecodeCookie } from "../utils/session-manager.js";
import axios from 'axios';
import moment from 'moment-timezone';

const qrverify = asyncHandler(async (req, res) => {
    const { id: tokenparam } = req.params; // ENCODED AEP ID
    const token = decode(tokenparam);
    console.log(token);
    if (!token || token.trim() === '') {
        throw new ApiError(400, "Invalid token");
    }
    try {
        const AEPData = await AEPs.findById(token);
        if (!AEPData) throw new ApiError(405, "AEP Not Found");
        return res.status(200).json({ message: "AEP Details Fetched Successfully", data: AEPData });

    } catch (error) {
        const errorMessage = error.message || "An unexpected error occurred";
        throw new ApiError(405, errorMessage);
    }
});

// const qrCreate = asyncHandler(async (req, res) => {
//     const { AEP } = req.body;
//     if (!AEP || AEP.trim() === '') throw new ApiError(402, "All fields are Mandatory");
//     try {
//         const AEPData = await AEPs.findById(AEP);
//         if (!AEPData) throw new ApiError(405, "AEP Not Found");
//         const qrtext = encode(AEPData._id);
//         return ApiResponse.success(res, { text: qrtext }, "Code Generated Successfully");
//     } catch (error) {
//         throw new ApiError(405, "Invalid Object Id");
//     }
// });

const oneqr = asyncHandler(async (req, res) => {
    const { data } = req.body; // {aep: "encoded_aep", adp: "encoded_adp", avp: "encoded_avp", option: "driver/employee/vehicle"}
    let responses = {};
    const packet = {
        IdType: "",
        Id: ""
    };
    try {
        const currentDateIST = moment().tz("Asia/Kolkata").toDate();
        if ('aep' in data && data.aep && (data.option === 'driver' || data.option === 'employee')) {
            const response = await axios.get(`${process.env.API_URL}/api/AEP/${data.aep}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : req.headers.authorization ,
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            responses.aep = response.data;
            packet.IdType = "AEP";
            packet.Id = data.aep;
            if(new Date(response.data.data.DateofExpiry) < currentDateIST){
                return ApiResponse.error(res, "AEP Expired", 405);
            }
            if(response.data.data.status === "BLOCKED"){
                return ApiResponse.error(res, "AEP is Blocked", 405);
            }
            if(!response.data.data.Locations.includes(data.location)){
                return ApiResponse.error(res, "Access Denied", 405);
            }

            if ('adp' in data && data.adp && data.option === 'driver'){
                const adp_temp = decode(data.adp);
                const headers = {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : req.headers.authorization,
                    "sessionData": req.cookies.SESSIONDATA
                };
                const response = await axios.get(`${process.env.API_URL}/api/ADP/${adp_temp}`, {
                    headers: {
                        "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : req.headers.authorization,
                        "sessionData": req.cookies.SESSIONDATA
                    }
                });
                responses.adp = response.data;
                packet.IdType = "ADP";
                packet.Id = data.adp;
                console.log(responses)

                if(new Date(response.data.data.ADP.ADPValidity) < currentDateIST){
                    return ApiResponse.error(res, "ADP Expired", 405);
                }
                if(response.data.data.ADP.status === "BLOCKED"){
                    return ApiResponse.error(res, "ADP is Blocked", 405);
                }
            }

        }

        if ('avp' in data && data.avp && data.option === 'vehicle') {
            const avpData = decode(data.avp);
            const response = await axios.get(`${process.env.API_URL}/api/AVP/id/${avpData}`, {
                headers: {
                    "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : req.headers.authorization,
                    "sessionData": req.cookies.SESSIONDATA
                }
            });
            responses.avp = response.data;
            packet.IdType = "AVP";
            packet.Id = data.avp;

            if(new Date(response.data.data.AVP.AVPValidity) < currentDateIST){
                return ApiResponse.error(res, "AVP Expired", 405);
            }
            if(response.data.data.AVP.status === "BLOCKED"){
                return ApiResponse.error(res, "AVP is Blocked", 405);
            }
        }

        packet.Id = decode(packet.Id);
        packet.location = data.location;
        const response = await axios.post(`${process.env.API_URL}/api/log/`,packet, {
            headers: {
                "authorization": req.cookies.accessToken ? `Bearer ${req.cookies.accessToken}` : "",
                "sessionData": req.cookies.SESSIONDATA
            }
        });
        return ApiResponse.success(res, {data : responses, logs : response.data}, "Data Verified Successfully");

    } catch (error) {
        console.error("Error in oneqr function:", error.message || error);
        throw new ApiError(405, error.message || "Error in data verification");
    }
});


export { qrverify, oneqr };