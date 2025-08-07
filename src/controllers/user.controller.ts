import type { Request, Response } from "express";
const { logger } = require("../../utils/logger.ts");
const pool = require("../../db/connection.js");
exports.getUsers = async (req: Request, res: Response) => {
  console.log("Hi");
  try {
    const result = await pool.query("SELECT * FROM users");
    if (result.rows.length == 0) {
      return res
        .status(401)
        .json({ status: "FAIL", message: "Invalid Credentials" });
    }
    const users = result.rows;
    return res.status(200).json(users);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
exports.getOneUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length == 0) {
      return res
        .status(401)
        .json({ status: "FAIL", message: "Invalid Credentials" });
    }
    const user = result.rows[0];
    return res.status(200).json(user);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
exports.deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      return res
        .status(401)
        .json({ status: "SUCCESS", message: "User Deleted" });
    } else res.status(404).json({ message: "User not found" });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
exports.updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const allowedParams = ["name", "email"];
    const filteredEntries = Object.entries(updates).filter(([key]) =>
      allowedParams.includes(key)
    );
    console.log(filteredEntries);
    if (filteredEntries.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update." });
    }
    const setClause = filteredEntries
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(", ");
    console.log(setClause);
    const values = filteredEntries.map(([, value]) => value);
    values.push(id);
    console.log(values);
    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length}`,
      values
    );
    console.log(result);
    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ status: "Success", message: "User updated successfully" });
    } else
      res
        .status(401)
        .json({
          status: "FAIL",
          message: "Not updated due to invalid credentials",
        });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server side error" });
  }
};
