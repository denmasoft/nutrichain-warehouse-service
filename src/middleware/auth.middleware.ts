import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment';

export interface AuthenticatedRequest extends Request {
    user?: { id: string; [key: string]: any };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const t = req.t;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: t('errors.unauthorized') });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: t('errors.invalidToken') });
    }
};