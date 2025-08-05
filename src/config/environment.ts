import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'dev',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
};