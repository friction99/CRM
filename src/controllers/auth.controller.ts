import type { Request, Response } from "express";
const { generateToken } = require("../../utils/jwt.ts");
const { logger } = require("../../utils/logger.ts");
const pool = require("../../db/connection.js");
const bcrypt = require("bcrypt");
exports.register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await pool.query(
      "INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)",
      [name, email, await hashedPassword,role]
    );
    res
      .status(201)
      .json({
        status: "Success",
        message: "User registered successfully",
      });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ message: "Server error" });
    } else {
      logger.error("An unknown error occurred");
    }
  }
};
exports.login = async (req: Request, res: Response) => {
  //validation
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
      email,
    ]);
    if(result.rows.length==0){
      return res.status(401).json({status:"Fail",message:"Invalid credentials"})
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid details" });
    const token = generateToken({ userId: user.id, role:user.role });
    res.status(200).json({ staus: "Success", message: "Login Successful!" ,token});
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
      res.status(500).json({ message: "Server error .." });
    } else {
      logger.error("An unknown error occurred");
    }
  }
};
