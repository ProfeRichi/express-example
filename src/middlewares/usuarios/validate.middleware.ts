import { Request, Response, NextFunction } from 'express';

export const validateUsuario = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { nombre, email, edad } = req.body;

  if (!nombre || typeof nombre !== 'string') {
    return res.status(400).json({ error: 'Nombre inválido' });
  }

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (edad !== undefined && typeof edad !== 'number') {
    return res.status(400).json({ error: 'Edad inválida' });
  }

  next();
};
