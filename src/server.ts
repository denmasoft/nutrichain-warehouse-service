import app from './app';
import { env } from './config/environment';
import { initializeDatabase } from './config/database';
import logger from './utils/logger';

const startServer = async () => {
    await initializeDatabase();
    
    app.listen(env.PORT, () => {
        logger.info(`Warehouse microservice running on http://localhost:${env.PORT}`);
        logger.info(`Environment: ${env.NODE_ENV}`);
        logger.info(`API docs available at http://localhost:${env.PORT}/api-docs`);
    });
};

startServer();