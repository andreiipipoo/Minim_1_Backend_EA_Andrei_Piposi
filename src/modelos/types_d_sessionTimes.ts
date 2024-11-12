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