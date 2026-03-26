import { Paciente } from './paciente.model';

export interface Cita {
  id?: string;
  paciente: Paciente;
  profesionalId: string;
  fechaHora: string;
  motivo: string;
  estado?: string;
}
