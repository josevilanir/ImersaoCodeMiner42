import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { routes } from './infra/http/routes';
import { errorHandler } from './infra/http/middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorHandler);

export { app };