import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from './config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  //   synchronize: true,
  logging: false,
  entities: ['/src/entity/**/*.ts'],
  migrations: [],
  subscribers: [],
});
