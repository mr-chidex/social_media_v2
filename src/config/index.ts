import dotenv from 'dotenv';

dotenv.config();

const config = {
  API_VERSION: process.env.API_VERSION,
  DB_NAME: process.env.DB_NAME,
  DB_PASS: process.env.DB_PASS,
  DB_USER: process.env.DB_USER,
  PORT: process.env.PORT,
};

export default config;
