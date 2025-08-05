import { AppDataSource } from '../config/database';
import { Stock } from '../entities/stock.entity';
import { Movement } from '../entities/movement.entity';
import logger from '../utils/logger';

const seedDatabase = async () => {
    logger.info('Starting database seeding...');
    
    try {
        await AppDataSource.initialize();
        logger.info('Database connection established.');

        const stockRepository = AppDataSource.getRepository(Stock);
        const movementRepository = AppDataSource.getRepository(Movement);

        await movementRepository.clear();
        await stockRepository.clear();
        logger.info('Cleared existing data from stock and movements tables.');

        const initialStockData = [
            { productId: 101, quantity: 50 }, // Manzanas
            { productId: 102, quantity: 30 }, // Plátanos
            { productId: 103, quantity: 100 }, // Leche Procesada
            { productId: 205, quantity: 0 }, // Salmón Fresco (sin stock inicial)
        ];

        const stockEntities = stockRepository.create(initialStockData);
        await stockRepository.save(stockEntities);

        logger.info(`Successfully seeded ${stockEntities.length} stock records.`);
        logger.info('Database seeding completed successfully.');

    } catch (error) {
        logger.error('Error during database seeding:', error);
        process.exit(1);
    } finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            logger.info('Database connection closed.');
        }
    }
};

seedDatabase();