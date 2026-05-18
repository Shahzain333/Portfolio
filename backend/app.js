import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

// Error handler 
app.use((err, req, res, next) => {
    
    console.error(err); 

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });


});

export default app;