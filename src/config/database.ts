import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./environment";
import { Stock } from "../entities/stock.entity";
import { Movement } from "../entities/movement.entity";
import logger from "../utils/logger";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: false, // ¡Use migrations.
    logging: env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    entities: [Stock, Movement],
    migrations: [],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        logger.info("Database successfully initialized");
    } catch (error) {
        logger.error("Error during Data Source initialization:", error);
        process.exit(1);
    }
};