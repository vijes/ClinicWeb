export interface Clinica {
    id?: string;
    ruc: string;
    razonSocial?: string;
    nombreComercial?: string;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    esEmpresa: boolean;
    telefonoCelular: string;
    telefonoConvencional?: string;
    email: string;
    cedulaRepresentante: string;
    codigoAccesoPortal?: string;
}
