import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import i18nextMiddleware from './config/i18n';
import { env } from './config/environment';
import warehouseRoutes from './api/v1/warehouse.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { idempotencyMiddleware } from './middleware/idempotency.middleware';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { corsOptions } from './config/cors';


const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nextMiddleware);

const limiter = rateLimit({
	windowMs: env.RATE_LIMIT_WINDOW_MS,
	max: env.RATE_LIMIT_MAX_REQUESTS,
	standardHeaders: true,
	legacyHeaders: false,
});
app.use(limiter);

app.use(idempotencyMiddleware);

app.use((req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NutriChain Warehouse API',
            version: '1.0.0',
            description: 'API for managing stock and movements in NutriChain Logistics',
        },
        servers: [{ url: `/api/v1` }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ['./src/api/v1/*.ts', './src/dto/*.ts'],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.get('/health', (req, res) => res.status(200).send('OK'));
app.use('/api/v1/warehouse', warehouseRoutes);

app.use(notFoundHandler);
app.use(errorHandler);


export default app;