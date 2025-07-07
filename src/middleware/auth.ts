import supabase from '../utils/supabase';
import {Response, Request, NextFunction} from 'express';
import { Express } from '../types/express';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    //get token from headers
    const token = (req.headers as Express.AuthenticatedRequest['headers']).Authorization.split(' ')[1];
    //return error if no token
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    //get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    //return error if no user
    if (error || !user) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
    //attach user to request
    req.user = user; 
    next();
}