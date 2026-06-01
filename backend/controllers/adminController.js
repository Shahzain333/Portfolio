import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { APIResponse, ApiErrorResponse } from '../utils/APIResponse.js'

// Admin Login
export const handleAdminLogin = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).json(new ApiErrorResponse(400, "Please fill all the fields"))
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if(email !== adminEmail || password !== adminPassword) {
            return res.status(401).json(new ApiErrorResponse(401, "Invalid Credentials"))
        }

        const adminToken = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        })

        res.cookie("adminToken", adminToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24*60*60*1000
        })

        return res.status(200).json(new APIResponse(200, { admin: adminEmail }, "Admin logged in successfully"))

    } catch (error) {
        console.log("Error in HandleAdminLoginUser : ",error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

// Logout User
export const handleAdminLogout = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("adminToken")
        return res.status(200).json(new APIResponse(200, null, "Admin logged out successfully"))
    } catch (error) {
        console.log("Error in HandleAdminLogout : ",error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

export const handleIsAuthAdmin = asyncHandler(async (req, res) => {
    try {

        const { email } = req.body

        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json(new ApiErrorResponse(401, "Not authorized Admin"))
        }

        res.status(200).json(new APIResponse(200, null, "Admin is authorized"))

    } catch (error) {
        console.log("Error in isAdmin : ", error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

