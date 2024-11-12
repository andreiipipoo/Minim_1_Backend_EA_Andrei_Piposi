# Gestor de Tiempos de Uso - Ejercicio Tipo 5 - Andrei Piposi

Este proyecto implementa un Gestor de Tiempos de Uso que registra la duración de las sesiones de los usuarios y permite visualizar un resumen de su actividad en la aplicación web.

## Estructura del Proyecto

El proyecto está compuesto por los siguientes directorios y archivos relevantes:

- **src/**: Contiene el código fuente de la aplicación.
    - **controllers/**: Controladores para manejar las solicitudes HTTP.
        - `experienciasControllers.ts`
        - `userControllers.ts`
        - `wineControllers.ts`
        - `sessionTimesController.ts` (Nuevo)
    - **database/**: Configuración de la conexión a la base de datos.
        - `mongo_conn.ts`
    - **modelos/**: Definiciones de tipos e interfaces.
        - `type_d_extras.ts`
        - `types_d_experiencias.ts`
        - `types_d_users.ts`
        - `types_d_wine.ts`
        - `types_d_sessionTimes.ts` (Nuevo)
    - **routes/**: Definición de rutas de la API.
        - `experienciasRoute.ts`
        - `userRoute.ts`
        - `wineRoute.ts`
        - `sessionTimesRoute.ts` (Nuevo)
    - **services/**: Servicios para interactuar con la base de datos.
        - `experienciasServices.ts`
        - `userServices.ts`
        - `wineServices.ts`
        - `users.json`
    - `index.html`: Archivo HTML principal.
    - `index.ts`: Archivo TypeScript principal.
    - `mongo.js`: Archivo JavaScript para la conexión a MongoDB.

- **package.json**: Archivo de configuración del proyecto y dependencias.
- **README.md**: Archivo de documentación del proyecto.
- **tsconfig.json**: Archivo de configuración de TypeScript.

## Implementación del Gestor de Tiempos de Uso

### 1. Crear una nueva colección en MongoDB

Se ha creado una nueva colección en MongoDB llamada `sessionTimes` para gestionar los tiempos de uso. Los documentos de esta colección tienen la siguiente estructura:

```typescript
import { model, Schema, Document } from 'mongoose';

// Definición de la interfaz para el tiempo de sesión
export interface SessionTimeInterface extends Document {
    userId: Schema.Types.ObjectId; // Relación con la colección 'users'
    startTime: Date;
    endTime: Date;
    duration: number; // en segundos
}

// Definición del esquema para el tiempo de sesión
const sessionTimeSchema = new Schema<SessionTimeInterface>({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }
});

// Exportar el modelo
export const SessionTimeModel = model<SessionTimeInterface>('SessionTime', sessionTimeSchema);
```

### 2. Controlador para operaciones CRUD

Se ha implementado un controlador `sessionTimesController.ts` para gestionar las operaciones CRUD.

```typescript
import { Request, Response } from 'express';
import { SessionTimeModel } from '../modelos/types_d_sessionTimes';
import { Types } from 'mongoose';

export const createSessionTime = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, startTime, endTime } = req.body;
        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid userId' });
            return;
        }
        const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
        const newSessionTime = new SessionTimeModel({ userId, startTime: new Date(startTime), endTime: new Date(endTime), duration });
        const result = await newSessionTime.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create session time' });
    }
};

//READ - Obtiene los tiempos de sesión de un usuario.
export const getSessionTimes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
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

export const updateSessionTime = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.body;
        if (!Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid session time ID' });
            return;
        }
        const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;
        const updatedSessionTime = await SessionTimeModel.findByIdAndUpdate(id, { startTime: new Date(startTime), endTime: new Date(endTime), duration }, { new: true });
        if (!updatedSessionTime) {
            res.status(404).json({ error: 'Session time not found' });
            return;
        }
        res.status(200).json(updatedSessionTime);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update session time' });
    }
};

export const deleteSessionTime = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
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
```

### 3. Rutas para el controlador

Se ha creado un archivo de rutas `sessionTimesRoute.ts` para definir las rutas de las operaciones CRUD.

```typescript
import { Router } from 'express';
import * as sessionTimesController from '../controllers/sessionTimesController';

const router = Router();

router.post('/sessionTimes', sessionTimesController.createSessionTime);
router.get('/sessionTimes/:userId', sessionTimesController.getSessionTimes);
router.put('/sessionTimes/:id', sessionTimesController.updateSessionTime);
router.delete('/sessionTimes/:id', sessionTimesController.deleteSessionTime);

export default router;
```

### 4. Actualización del archivo `index.ts`

Se ha actualizado el archivo `index.ts` para incluir las nuevas rutas.

```typescript
import express, { RequestHandler } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute';
import experienciasRouter from './routes/experienciasRoute';
import wineRouter from './routes/wineRoute';
import sessionTimesRouter from './routes/sessionTimesRoute';
import { run } from './database/mongo_conn';

const app = express();
app.use(express.json());
run();

app.use(cors());
app.use(express.json() as RequestHandler);

const PORT = 3000;

app.get('/ping', (_req, res) => {
        console.log('ping recibido correctamente');
        res.send('pinged');
});

app.use('/api/user', userRouter);
app.use('/api/experiencias', experienciasRouter);
app.use('/api/wine', wineRouter);
app.use('/api/sessionTimes', sessionTimesRouter);

app.listen(PORT, () => {
        console.log('El servidor está escuchando en el puerto ' + PORT);
});
```

## Visualización de Tiempos de Uso

Se ha añadido una funcionalidad para visualizar los tiempos de uso de un usuario. Para ello, se puede realizar una solicitud GET a la ruta `/api/sessionTimes/:userId`, donde `:userId` es el identificador del usuario cuyos tiempos de uso se desean consultar. 

La función getSessionTimes obtiene los tiempos de sesión de un usuario específico y los devuelve en formato JSON.

## Conclusión

Se ha implementado un Gestor de Tiempos de Uso que incluye una nueva colección en MongoDB, un controlador para operaciones CRUD, rutas para el controlador y la actualización del archivo `index.ts` para incluir las nuevas rutas.