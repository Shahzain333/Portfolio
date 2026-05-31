import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary'
import { sendOtpEmail } from '../utils/sendTransactionalEmails.js'
import crypto from 'node:crypto'

// Admin Login
export const handleAdminLogin = async(req,res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) {
            return res.json({ message: "Please fill all the fields", success: false })
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if(email !== adminEmail || password !== adminPassword) {
            return res.json({ message: "Invalid Credentials", success: false })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24*60*60*1000
        })

        return res.json({ 
            success: true,
            message: "Admin logged in successfully", 
            admin: {
                admin: adminEmail
            },
        })

    } catch (error) {
        console.log("Error in HandleAdminLoginUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

// Logout User
export const handleAdminLogout = async(req,res) => {
    try {
        res.clearCookie("token")
        return res.json({ message: "User logged out successfully", success: true })
    } catch (error) {
        console.log("Error in HandleLogoutUser : ",error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const handleIsAuthAdmin = async(req,res) => {
    try {

        const { email } = req.user

        if (email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not authorized Admin" })
        }

        res.json({ success: true })

    } catch (error) {
        console.log("Error in isAdmin : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

