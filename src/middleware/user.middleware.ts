import type { Request, Response, NextFunction } from "express";
const { logger } = require('../../utils/logger.ts');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
exports.verifyRole = (allowedRoles:string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Acces denied" });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      const role = decoded.role;
      if(!allowedRoles.includes(role)) return res.status(401).json({message:"Access denied"});
      next();
    } catch (err) {
        logger.error(err);
        res.status(500).json({message:"Server error"});
    }
  };
};
