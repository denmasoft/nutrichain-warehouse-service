import { CorsOptions } from 'cors';
import { env } from './environment';
import logger from '../utils/logger';

const whitelist = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : [];

if (env.NODE_ENV === 'prod' && whitelist.length === 0) {
    logger.warn('CORS_ORIGIN is not set in production. No external origins will be allowed.');
}

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin && env.NODE_ENV !== 'prod') {
            return callback(null, true);
        }

        if (origin && whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const error = new Error(`CORS policy does not allow access from the specified Origin: ${origin}`);
            logger.warn(error.message);
            callback(error);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Idempotency-Key'],
};
