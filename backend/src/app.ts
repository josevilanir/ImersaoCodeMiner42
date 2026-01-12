import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { routes } from './infra/http/routes';
import { errorHandler } from './infra/http/middleware/errorHandler';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://localhost:4200',
    'http://127.0.0.1:4200'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,      // 👈 ADICIONE
  optionsSuccessStatus: 204 
}));

app.use(express.json());

app.use(routes);

app.use(errorHandler);

export { app };