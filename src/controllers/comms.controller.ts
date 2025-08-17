import type { Request, Response } from "express";
const { logger } = require("../../utils/logger.ts");
const pool = require("../../db/connection.js");
//  customer_id UUID REFERENCES Customers(id) ON DELETE CASCADE,
//     order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
//     channel channelType NOT NULL,
//     message TEXT NOT NULL,
//     sent_by UUID REFERENCES Users(id),
exports.addComms = (req:Request,res:Response)=>{
    const{customerId,channel,message,orderId,id} = req.body;
    try{
        const result = pool.query("INSERT INTO Communications (customer_id,order_id,channel,message,sent_by) VALUES ($1,$2,$3,$4,$5)",[customerId,orderId,channel,message,id]);
        if(result.rows.length==0){
            //err handler

        }
        //call sucess api
    }catch(err){
        logger.error(err);
        //call err handler
    }
}
exports.removeComms = (req:Request,res:Response)=>{
    const {id} = req.params;
    try{
        const result = pool.query("DELETE FROM Communications WHERE id = $1",id);
        if(result.rowCount>0){
            //call sucess api
        }
        //call err handler
    }catch(err){
        logger.error(err);
        //call err handler
    }
}