import express, { RequestHandler } from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute';
import experienciasRouter from './routes/experienciasRoute';
import wineRouter from './routes/wineRoute';
import sessionTimesRouter from './routes/sessionTimesRoute'; // Importar el nuevo router
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
app.use('/api/sessionTimes', sessionTimesRouter); // Agregar el nuevo router

app.listen(PORT, () => {
    console.log('El servidor está escuchando en el puerto ' + PORT);
});