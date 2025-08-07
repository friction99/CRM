const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload{
    userId:String,
    role:String
}

exports.generateToken = (payload:JwtPayload):string=>{
    return jwt.sign(payload,JWT_SECRET,{
        expiresIn : '1h'
    });
}