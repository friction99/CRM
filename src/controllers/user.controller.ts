import type { Request, Response } from "express";
const { logger } = require('../../utils/logger.ts');
const pool = require('../../db/connection.js');
exports.getUsers = async(req:Request,res:Response)=>{
    try{
        const result = await pool.query('SELECT * FROM users');
        if(result.rows.length==0){
            return res.status(401).json({status:"FAIL",message:"Invalid Credentials"});
        }
        const users = result.rows;
        return res.status(200).json(users);
    }catch(err){
        logger.error(err);
        res.status(500).json({error:"Failed to fetch users"});
    }
}