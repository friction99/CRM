import type { Request, Response } from "express";
const { logger } = require("../../utils/logger.ts");
const pool = require("../../db/connection.js");

exports.addOrder = (req:Request,res:Response)=>{
    const {customerId,productId,orderStatus} = req.body;
    try{
        const resultOrder = pool.query("INSERT INTO ORDERS (customer_id,order_status,product_id) VALUES ($1,$2,$3)",[customerId,productId,orderStatus]);
        if(resultOrder.rowCount>0){
            //call api response middleware
        }
        //call central error middleware
    }catch(err){
        logger.error(err);
        res.status(500).send({status:"FAILURE",message:"Server side err"});
    }
}
exports.getOrder = (req:Request,res:Response)=>{
    const {id} = req.body;
    try{
        const result = pool.query("SELECT * from ORDERS where customer_id = $1",id);
        if(result.rows.length==0){
            //call err handler
        }
        const order = result.rows[0];
        //call success api 
    }catch(err){
        logger.error(err);
        //err handler
    }
}
exports.getOrders = (req:Request,res:Response)=>{
    try{
        const result = pool.query("SELECT * FROM ORDERS");
        if(result.rows.length==0){
            //call err hander
        }
        const orders = result.rows;
        //call success api
    }catch(err){
        logger.error(err);
        //call err handler
    }
}
exports.removeOrder = (req:Request,res:Response)=>{
    const {id} = req.params;
    try{
        const result = pool.query("DELETE from ORDERS where id = $1",[id]);
        if(result.rowCount>0){
            //call api response middlware
        }
        //call error middleware;
    }catch(err){
        logger.error(err);
        //call error handler
    }
}