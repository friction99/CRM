import { Request } from "express";

// Augmenting express's Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};