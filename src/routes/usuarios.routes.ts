import { Router, Request, Response } from 'express';
import { pool } from '../db/postgres';
import { validateUsuario } from '../middlewares/usuarios/validate.middleware';


const usuariosRoutes = Router();

/**
 * GET /api/usuarios
 * Listar usuarios
 */
usuariosRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM public.usuarios ORDER BY id ASC'
    );

    res.json({
      total: rows.length,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

/**
 * GET /api/usuarios/:id
 */
usuariosRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'SELECT * FROM public.usuarios WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

/**
 * POST /api/usuarios
 */
usuariosRoutes.post('/',validateUsuario, async (req: Request, res: Response) => {
  try {
    const { nombre, email, edad, activo } = req.body;

    const { rows } = await pool.query(
      `
      INSERT INTO public.usuarios (nombre, email, edad, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [nombre, email, edad, activo ?? true]
    );

    res.status(201).json(rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    console.error(error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

/**
 * PUT /api/usuarios/:id
 */
usuariosRoutes.put('/:id',validateUsuario, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, email, edad, activo } = req.body;

    const { rowCount, rows } = await pool.query(
      `
      UPDATE public.usuarios
      SET nombre = $1,
          email = $2,
          edad = $3,
          activo = $4
      WHERE id = $5
      RETURNING *
      `,
      [nombre, email, edad, activo, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    console.error(error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * DELETE /api/usuarios/:id
 */
usuariosRoutes.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'DELETE FROM public.usuarios WHERE id = $1',
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

export default usuariosRoutes;
