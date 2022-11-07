import dotenv from 'dotenv';

dotenv.config();

const config = {
  API_VERSION: process.env.API_VERSION,
  DB_NAME: process.env.DB_NAME,
  DB_PASS: process.env.DB_PASS,
  DB_USER: process.env.DB_USER,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_KEY: process.env.SECRET_KEY,
  CLOUD_NAME: process.env.CLOUD_NAME,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY,
};

export default config;
