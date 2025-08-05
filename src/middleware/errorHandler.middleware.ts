import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { env } from '../config/environment';

interface HttpError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    error: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(`Error occurred for request ${req.method} ${req.path}:`, error);

    const statusCode = error.statusCode || 500;
    const isProduction = env.NODE_ENV === 'production';

    const responseBody = {
        message: req.t('errors.internalError'),
        ...( !isProduction && {
            error: error.message,
            stack: error.stack
        })
    };
    
    if (statusCode < 500) {
        responseBody.message = error.message;
    }
    
    res.status(statusCode).json(responseBody);
};
