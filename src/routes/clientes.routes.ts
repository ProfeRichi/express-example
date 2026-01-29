import { Router, Request, Response } from "express";
import { clientesService } from "../services/clientes.service";

const clientesRoutes = Router();

/**
 * GET /clientes
 */
clientesRoutes.get("/", async (_req: Request, res: Response) => {
	const clientes = await clientesService.findAll();
	res.json(clientes);
});


clientesRoutes.get("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const cliente = await clientesService.findById(id);

	if (!cliente) {
		return res.status(404).json({ message: "Cliente no encontrado" });
	}

	res.json(cliente);
});


clientesRoutes.post("/", async (req: Request, res: Response) => {
	const { nombre, telefono, email, empresa } = req.body;

	if (!nombre) {
		return res.status(400).json({ message: "El nombre es obligatorio" });
	}

	const nuevoCliente = await clientesService.create({
		nombre,
		telefono,
		email,
		empresa,
	});

	res.status(201).json(nuevoCliente);
});


clientesRoutes.put("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);
	const { nombre, telefono, email, empresa } = req.body;

	const clienteActualizado = await clientesService.update(id, {
		nombre,
		telefono,
		email,
		empresa,
	});

	if (!clienteActualizado) {
		return res.status(404).json({ message: "Cliente no encontrado" });
	}

	res.json(clienteActualizado);
});


clientesRoutes.delete("/:id", async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const eliminado = await clientesService.remove(id);

	if (!eliminado) {
		return res.status(404).json({ message: "Cliente no encontrado" });
	}

	res.status(204).send();
});

export default clientesRoutes;
