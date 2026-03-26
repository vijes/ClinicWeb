import { Persona } from './persona.model';

export interface Paciente {
  id?: string;
  persona: Persona;
  tipoSangre?: string;
  seguroMedico?: string;
  contactoEmergencia?: string;
  observaciones?: string;
}
