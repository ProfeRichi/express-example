import express, { Request, Response } from 'express';
import { pool } from './db/postgres';
import usuariosRoutes from './routes/usuarios.routes';
import { logger } from './middlewares/usuarios/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = 3000;

// middleware básico
app.use(express.json());
app.use(logger);

app.use('/api/usuarios', usuariosRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'API funcionando 🚀' });
});


app.use(errorHandler)

if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Servidor local en http://localhost:${PORT}`);
  });
}

export default app;