import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const processedRequests = new Map<string, { status: 'processing' | 'completed', responseBody?: any, statusCode?: number }>();

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const idempotencyKey = req.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
             logger.warn('Idempotency key missing for a mutable request.');
        }
        return next();
    }
    
    if (processedRequests.has(idempotencyKey)) {
        const storedRequest = processedRequests.get(idempotencyKey)!;
        if (storedRequest.status === 'processing') {
            logger.warn(`Idempotency conflict for key: ${idempotencyKey}`);
            return res.status(429).json({ message: 'Request with this idempotency key is already being processed.' });
        }
        if (storedRequest.status === 'completed') {
            logger.info(`Returning cached response for idempotency key: ${idempotencyKey}`);
            return res.status(storedRequest.statusCode!).json(storedRequest.responseBody);
        }
    }
    
    processedRequests.set(idempotencyKey, { status: 'processing' });
    
    const originalJson = res.json;
    res.json = (body) => {
        processedRequests.set(idempotencyKey, { status: 'completed', responseBody: body, statusCode: res.statusCode });
        setTimeout(() => processedRequests.delete(idempotencyKey), 3600 * 1000);
        return originalJson.call(res, body);
    };

    next();
};