/**
 * app.ts
 * Punto central de configuración de la aplicación Express
 * Aquí se definen:
 *  - Middlewares globales
 *  - Rutas
 *  - Manejo de errores
 *  - Arranque del servidor en local
 */

import express from 'express'; // Framework web
import cors from 'cors'; // Middleware para CORS

// Rutas
import usuariosRoutes from './routes/usuarios.routes';
import clientesRoutes from './routes/clientes.routes';

// Middlewares personalizados
import { logger } from './middlewares/usuarios/logger.middleware';
import { errorHandler } from './middlewares/error.middleware';

// Inicializamos la aplicación Express
const app = express();

/**
 * =========================
 * MIDDLEWARES GLOBALES
 * =========================
 */

/**
 * Permite leer JSON en el body de las peticiones
 * Ejemplo: req.body.nombre
 */
app.use(express.json());

/**
 * Middleware de logging
 * Se ejecuta en TODAS las peticiones
 * Útil para depuración y monitoreo
 */
app.use(logger);

/**
 * Middleware de CORS
 * Permite que esta API sea consumida desde navegadores
 * (por ejemplo, desde un frontend en React)
 */
app.use(cors());

/**
 * =========================
 * RUTAS
 * =========================
 */

/**
 * Rutas relacionadas con usuarios
 * Ejemplo:
 *  GET  /api/usuarios
 *  POST /api/usuarios
 */
app.use('/api/usuarios', usuariosRoutes);

/**
 * Rutas relacionadas con clientes
 * Ejemplo:
 *  GET  /api/clientes
 *  POST /api/clientes
 */
app.use('/api/clientes', clientesRoutes);

/**
 * Endpoint base (health check)
 * Sirve para verificar que la API está viva
 */
app.get('/', (_req, res) => {
  res.json({ status: 'API funcionando' });
});

/**
 * =========================
 * MANEJO DE ERRORES
 * =========================
 */

/**
 * Middleware de manejo de errores
 * IMPORTANTE:
 *  - Siempre debe ir al FINAL
 *  - Captura errores lanzados en rutas y middlewares
 */
app.use(errorHandler);

/**
 * =========================
 * SERVIDOR LOCAL
 * =========================
 */

/**
 * En producción (Vercel):
 *  - NO se usa app.listen()
 *  - Vercel invoca la función directamente (serverless)
 *
 * En desarrollo local:
 *  - Levantamos el servidor en el puerto 3000
 */
if (process.env.NODE_ENV !== 'production') {
  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`Servidor local en http://localhost:${PORT}`);
  });
}

/**
 * Exportamos la app
 * Esto es obligatorio para que Vercel pueda usarla
 */
export default app;
