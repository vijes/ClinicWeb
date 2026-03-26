export interface Persona {
  id?: string;
  tipoDocumento: string;
  documento: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  fechaNacimiento: string;
  sexo?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  nombreCompleto?: string;
}
