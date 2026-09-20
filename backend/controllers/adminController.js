import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import APIResponse from '../utils/apiResponse.js'
import ApiErrorResponse from '../utils/apiErrorResponse.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import { verifyRefreshToken } from '../utils/verifyToken.js'
import bcrypt from 'bcryptjs'

// secure:true breaks cookies on localhost (HTTP)
// Use secure only in production (HTTPS)
const isProduction = process.env.NODE_ENV === 'production'

const cookieOptions = {
    httpOnly: true,
    secure:   isProduction,           // false on localhost, true on production
    sameSite: isProduction ? 'none' : 'lax', // 'none' needs secure:true
}

// Admin Login
export const handleAdminLogin = asyncHandler(async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(new ApiErrorResponse(400, "Please fill all the fields"))
        }

        const adminEmail        = process.env.ADMIN_EMAIL
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        // FIX: was reading ADMIN_PASSWORD (plain text) — now reads ADMIN_PASSWORD_HASH
        if (!adminPasswordHash) {
            console.error('ADMIN_PASSWORD_HASH is not set in .env')
            return res.status(500).json(new ApiErrorResponse(500, "Server misconfiguration"))
        }

        const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash)

        if (email !== adminEmail || !isPasswordCorrect) {
            return res.status(401).json(new ApiErrorResponse(401, "Invalid Credentials"))
        }

        const accessToken  = generateAccessToken(email)
        const refreshToken = generateRefreshToken(email)

        res.cookie("accessToken",  accessToken,  { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        return res.status(200).json(new APIResponse(200, { admin: email }, "Admin logged in successfully"))

    } catch (error) {
        console.error("Error in handleAdminLogin:", error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

// Logout
export const handleAdminLogout = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("accessToken",  cookieOptions)
        res.clearCookie("refreshToken", cookieOptions)
        return res.status(200).json(new APIResponse(200, null, "Admin logged out successfully."))
    } catch (error) {
        console.error("Error in handleAdminLogout:", error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})

// Refresh Access Token
export const handleRefreshToken = asyncHandler(async (req, res) => {

    const token = req.cookies?.refreshToken

    if (!token) {
        return res.status(401).json(new ApiErrorResponse(401, "Refresh token missing. Please login again."))
    }

    try {
        const decoded = verifyRefreshToken(token)

        // verifyRefreshToken returns null on error — handle it
        if (!decoded) {
            return res.status(401).json(new ApiErrorResponse(401, "Invalid refresh token. Please login again."))
        }

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json(new ApiErrorResponse(403, "Forbidden."))
        }

        const accessToken = generateAccessToken(decoded.email)
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })

        return res.status(200).json(new APIResponse(200, null, "Access token refreshed successfully."))

    } catch (error) {
        console.error("Error in handleRefreshToken:", error.message)
        return res.status(401).json(new ApiErrorResponse(401, "Invalid or expired refresh token. Please login again."))
    }
})

// Check if admin is authenticated
export const handleIsAuthAdmin = asyncHandler(async (req, res) => {
    try {
        res.status(200).json(new APIResponse(200, { admin: req.admin.email }, "Admin is authorized"))
    } catch (error) {
        console.error("Error in handleIsAuthAdmin:", error.message)
        return res.status(500).json(new ApiErrorResponse(500, "Internal server error"))
    }
})
