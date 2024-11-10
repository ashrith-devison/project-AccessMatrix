import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        console.log(`Generating tokens for userId: ${userId}`);
        
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        console.log(`User found: ${user}`);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        console.log(`Access Token: ${accessToken}`);
        console.log(`Refresh Token: ${refreshToken}`);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        console.error('Error in generateAccessAndRefreshToken:', error);
        throw new ApiError(500, 'Token generation failed');
    }
}

const registerSecurityEmployee = asyncHandler(async (req,res)=>{
    const { employeeId, employeeName, email, password, location, role} = req.body; //,AdpAvailable 
    console.log(req.body); // or log the specific fields
    if([employeeId,employeeName,email,password,role,location].some((field)=>field?.trim() === '')){
        throw new ApiError(400, 'All fields are required');
    }
    const existedUser = await User.findOne(
        { $or: [{email}, {employeeId}]}
    );
    if(existedUser){
        throw new ApiError(400, 'Employee already exists');
    }
    const user = await User.create({
        employeeId,
        employeeName,
        email,
        password,
        role,
        location,
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    return ApiResponse.success(res,{user: createdUser}, "Employee registered successfully");
})

const loginUser = asyncHandler(async (req,res)=>{
    const { employeeId, password } = req.body;
    if(!employeeId || !password){
        throw new ApiError(400, 'Employee ID and Password are required');
    }
    const user = await User.findOne({employeeId});
    if(!user) throw new ApiError(404, 'Employee not found');

    const isPasswordMatch  = await user.matchPassword(password);
    if(!isPasswordMatch) throw new ApiError(401, 'Password is incorrect');

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password');
    
    const options = {
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, {user: loggedInUser, accessToken,refreshToken},
        "User logged in successfully"
    ))
})

const logoutUser =  asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset :{
                refreshToken: 1
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly: true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const changePassword = asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400, 'Old Password and New Password are required');
    }
    const user = await User.findById(req.user._id);
    const isPasswordMatch = await user.matchPassword(oldPassword);
    if(!isPasswordMatch){
        throw new ApiError(401, 'Old Password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const forgotPassword = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, 'Email is required');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, 'User not found');
    }
    const resetToken = user.generatePasswordResetToken();
    // need to complete this code
 })

export { registerSecurityEmployee, loginUser, logoutUser,changePassword,forgotPassword }