import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined
    }
    interface AuthenticatedRequest extends Request {
      headers: {
        Authorization: string
      }
    }
  }
}

export { Express };