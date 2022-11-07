import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import config from './config';
import { error } from './middlewares/logger';
import { authRoutes } from './routes';

const app: Application = express();
const apiVersion = config.API_VERSION || 'v1';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');

app.use(`/api/${apiVersion}/auth`, authRoutes);

// error handler
app.use(error);

export default app;
