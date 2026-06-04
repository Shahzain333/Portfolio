import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import APIResponse from '../utils/apiResponse.js'
import ApiErrorResponse from '../utils/apiErrorResponse.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import { verifyRefreshToken } from '../utils/verifyToken.js'
import bcrypt from 'bcryptjs'

const cookieOptions = {
    httpOnly: true,  // JS cannot access — prevents XSS attacks
    secure: true,   // HTTPS only
    sameSite: "none", // needed for cross-origin (frontend/backend on different domains)
}

// Admin Login
export const handleAdminLogin = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json(new ApiErrorResponse(400, "Please fill all the fields"))
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD_HASH

        // bcrypt compare — checks entered password against stored hash
        const isPasswordCorrect = await bcrypt.compare(password, adminPassword);

        // If email doesn't match or password is incorrect, return 401
        if(email !== adminEmail || !isPasswordCorrect) {
            return res.status(401).json(new ApiErrorResponse(401, "Invalid Credentials"))
        }

        const accessToken = generateAccessToken(email)
        const refreshToken = generateRefreshToken(email) 

        // set both in httpOnly cookies
        res.cookie("accessToken",  accessToken,  
            { 
                ...cookieOptions, 
                maxAge: 15 * 60 * 1000 
            }
        ); // 15 min

        res.cookie("refreshToken", refreshToken, 
            { 
                ...cookieOptions, 
                maxAge: 7 * 24 * 60 * 60 * 1000 
            }
        ); // 7 days

        return res.status(200).json(new APIResponse(200, { admin: email }, "Admin logged in successfully"))

    } catch (error) {
        console.log("Error in HandleAdminLoginUser : ",error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

// Logout User
export const handleAdminLogout = asyncHandler(async (req, res) => {
    try {
        
        res.clearCookie("accessToken",  cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
       
        return res.status(200).json(new APIResponse(200, null, "Admin logged out successfully."));

    } catch (error) {
        console.log("Error in HandleAdminLogout : ",error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

// Refresh Access Token
export const handleRefreshToken = asyncHandler(async (req, res) => {
    
    const token = req.cookies?.refreshToken;

    if(!token) {
        return res.status(401).json(new ApiErrorResponse(401, "Refresh token missing. Please login again."))
    }

    try {

        const decoded = verifyRefreshToken(token)

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json(new ApiErrorResponse(403, "Forbidden."));
        }

        // issue a new accessToken only
        const accessToken = generateAccessToken(decoded.email)

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

        return res.status(200).json(new APIResponse(200, null, "Access token refreshed successfully."));

    } catch (error) {
        console.log("Error in HandleAdminRefreshToken : ",error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Invalid or expired refresh token. Please login again."))
    }

});

export const handleIsAuthAdmin = asyncHandler(async (req, res) => {
    try {

        // const { email } = req.admin

        // if (email !== process.env.ADMIN_EMAIL) {
        //     return res.status(401).json(new ApiErrorResponse(401, "Not authorized Admin"))
        // }

        // req.admin is attached by adminOnly middleware
        res.status(200).json(new APIResponse(200, { admin: req.admin.email }, "Admin is authorized"))

    } catch (error) {
        console.log("Error in isAuthAdmin : ", error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

