export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  empresa?: string | null;
  created_at: string;
}

export interface CreateClienteDTO {
  nombre: string;
  telefono?: string;
  email?: string;
  empresa?: string;
}
