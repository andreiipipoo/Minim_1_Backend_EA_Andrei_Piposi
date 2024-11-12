import { Request, Response } from 'express';
import { SessionTimeModel } from '../modelos/types_d_sessionTimes';
import { Types } from 'mongoose';

// Crear un nuevo tiempo de sesión
export const createSessionTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, startTime, endTime } = req.body;

    // Verificar si el userId es válido
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;

    const newSessionTime = new SessionTimeModel({
      userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration
    });

    const result = await newSessionTime.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session time' });
  }
};

// Obtener los tiempos de sesión de un usuario
export const getSessionTimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Verificar si el userId es válido
    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const sessionTimes = await SessionTimeModel.find({ userId }).exec();
    res.status(200).json(sessionTimes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get session times' });
  }
};

// Actualizar un tiempo de sesión existente
export const updateSessionTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    // Verificar si el id del tiempo de sesión es válido
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid session time ID' });
      return;
    }

    const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;

    const updatedSessionTime = await SessionTimeModel.findByIdAndUpdate(
      id,
      { startTime: new Date(startTime), endTime: new Date(endTime), duration },
      { new: true }
    );

    if (!updatedSessionTime) {
      res.status(404).json({ error: 'Session time not found' });
      return;
    }

    res.status(200).json(updatedSessionTime);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update session time' });
  }
};

// Eliminar un tiempo de sesión existente
export const deleteSessionTime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar si el id del tiempo de sesión es válido
    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid session time ID' });
      return;
    }

    const deletedSessionTime = await SessionTimeModel.findByIdAndDelete(id);

    if (!deletedSessionTime) {
      res.status(404).json({ error: 'Session time not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session time' });
  }
};