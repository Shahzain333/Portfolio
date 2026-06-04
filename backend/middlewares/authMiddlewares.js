import jwt from 'jsonwebtoken'
import ApiErrorResponse from '../utils/apiErrorResponse.js';
import { verifyAccessToken } from '../utils/verifyToken.js';

// Middleware to protect routes that require authentication
export const adminOnly = (req,res,next) => {
    
    // check accessToken from cookie or Authorization header
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json(new ApiErrorResponse(401, "Access Token missing. Please login again."))
    }

    try {
        
        const decoded = verifyAccessToken(token);
        
        // double check email matches admin
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json(new ApiErrorResponse(403, "Forbidden. Not an admin."))
        }
        
        req.admin = decoded // attach admin info to request
        next()

    } catch (error) {
        
        // token expired — tell frontend to refresh
        if (error.name === "TokenExpiredError") {
            return res.status(401).json(new ApiErrorResponse(401, "Access token expired. Please refresh."));
        }

        return res.status(401).json(new ApiErrorResponse(401, "Invalid token. Please login again."));

    }

}
