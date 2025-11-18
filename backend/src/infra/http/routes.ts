import { Router } from 'express';
import { RoomsController } from '../../modules/rooms/http/RoomsController';
import { authMiddleware } from './middleware/auth';
import { ensureHostMiddleware } from './middleware/ensureHost';

const routes = Router();

const roomsController = new RoomsController();

// Rotas públicas
routes.post('/api/v1/rooms', (req, res) => 
  roomsController.createRoom(req, res)
);

routes.post('/api/v1/rooms/join', (req, res) => 
  roomsController.joinRoom(req, res)
);

routes.get('/api/v1/rooms/:code', authMiddleware, (req, res) => 
  roomsController.getRoom(req, res)
);

routes.post('/api/v1/rooms/:code/movies', authMiddleware, (req, res) =>
  roomsController.addMovie(req, res)
);

routes.post('/api/v1/rooms/:code/finish', authMiddleware, ensureHostMiddleware, (req, res) =>
  roomsController.finishRoom(req, res)
);

export { routes };