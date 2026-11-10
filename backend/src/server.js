import express from 'express';
import cors from 'cors';

// Импорти роутов
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import toursRoutes from './routes/tours.js';
import bookingsRoutes from './routes/bookings.js';

const app = express();
app.use(cors());
app.use(express.json());

// Подключение роутов к базовым путям
app.use('/api', authRoutes);                  // /api/login
app.use('/api/services', servicesRoutes);     // /api/services
app.use('/api/tours', toursRoutes);           // /api/tours
app.use('/api/bookings', bookingsRoutes);     // /api/bookings

const PORT = 3001;
app.listen(PORT, () => console.log(`API готов: http://localhost:${PORT}/api/services`));