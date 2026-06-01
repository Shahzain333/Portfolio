import jwt from 'jsonwebtoken'
import { ApiErrorResponse } from '../utils/apiErrorResponse.js';

export const adminOnly = (req,res,next) => {
    
    const token = req.cookies?.adminToken || req.headers?.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json(new ApiErrorResponse(401, "Not Authorized Admin"))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.admin = decoded // attach admin info to request
        if(req.admin.email === process.env.ADMIN_EMAIL ) {
            next()
        } 
    } catch (error) {
        return res.status(401).json(new ApiErrorResponse(401, "Invalid or expired token."));
    }

}
