import { pool } from "../db/postgres";
import { Cliente, CreateClienteDTO } from "../types/cliente";

export const clientesService = {
	async findAll(): Promise<Cliente[]> {
		const { rows } = await pool.query(
			"select * from clientes order by created_at desc",
		);
		return rows;
	},

	async findById(id: number): Promise<Cliente | null> {
		const { rows } = await pool.query("select * from clientes where id = $1", [
			id,
		]);
		return rows[0] || null;
	},

	async create(data: CreateClienteDTO): Promise<Cliente> {
		const { rows } = await pool.query(
			`
      insert into clientes (nombre, telefono, email, empresa)
      values ($1, $2, $3, $4)
      returning *
      `,
			[data.nombre, data.telefono, data.email, data.empresa],
		);

		return rows[0];
	},

	async update(id: number, data: CreateClienteDTO): Promise<Cliente | null> {
		const { rows } = await pool.query(
			`
      update clientes
      set nombre = $1,
          telefono = $2,
          email = $3,
          empresa = $4
      where id = $5
      returning *
      `,
			[data.nombre, data.telefono, data.email, data.empresa, id],
		);

		return rows[0] || null;
	},

	async remove(id: number): Promise<boolean> {
		const result = await pool.query("delete from clientes where id = $1", [id]);

		return result.rowCount === 1;
	},
};
