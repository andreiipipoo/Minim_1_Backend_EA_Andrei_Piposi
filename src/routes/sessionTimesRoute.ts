
import { Router } from 'express';
import * as sessionTimesController from '../controllers/sessionTimesController';

const router = Router();

// Ruta para crear un nuevo tiempo de sesión
router.post('/sessionTimes', sessionTimesController.createSessionTime);

// Ruta para obtener los tiempos de sesión de un usuario
router.get('/sessionTimes/:userId', sessionTimesController.getSessionTimes);

// Ruta para actualizar un tiempo de sesión existente
router.put('/sessionTimes/:id', sessionTimesController.updateSessionTime);

// Ruta para eliminar un tiempo de sesión existente
router.delete('/sessionTimes/:id', sessionTimesController.deleteSessionTime);

export default router;