import type {Request,Response,NextFunction} from 'express';
const ApiError = require('../../utils/ApiError');

exports.errorHandler = (
    err:Error|InstanceType<typeof ApiError>,
    req:Request,
    res:Response,
    _next:NextFunction
)=>{
    const statusCode = err instanceof ApiError && err.statusCode ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success:false,
        message,
        stack:process.env.NODE_ENV === 'production' ? undefined : err.stack
    })
}