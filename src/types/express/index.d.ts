import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
    }
    interface AuthenticatedRequest extends Request {
      headers: {
        Authorization: string
      }
    }
  }
}

export { Express };