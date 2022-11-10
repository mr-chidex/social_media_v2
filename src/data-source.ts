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
  synchronize: false,
  logging: false,
  entities: [__dirname + '/entities/*{.js,.ts}'],
  migrations: [__dirname + '/migrations/*.js'],
  subscribers: [],
  cache: {
    duration: 10000, //10 secs
  },
});
